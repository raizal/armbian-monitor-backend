import PQueue from 'p-queue'
import {fetchSingleStb} from "../utils/get-stb-non-blocking";
import {emit} from "../utils/emit-log";
import {delay} from "lodash";
import {initializeQueue} from "../actions/device-update";
import {getStb} from "./stb";

export const PRIORITY_SCANNING = 1
export const PRIORITY_SETUP_CCMINER = 2
export const PRIORITY_UPDATE = 0

const CONCURRENCY = process.env.CONCURRENCY || '15'

const queue = new PQueue({
    concurrency: parseInt(CONCURRENCY),
    autoStart: true,
    timeout: 15000,
    throwOnTimeout: false,
    interval: 0,
    carryoverConcurrencyCount: true
});

export interface IpQueue {
    _id: string,
    ip: string
}

let count = 0
const ips: IpQueue[] = []

let isScanning = false

let queueDelay = 1000

queue.on('active', () => {
    console.log(`Working.  Size: ${queue.size}  Pending: ${queue.pending}`);
    const scanningCount = queue.sizeBy({ priority: PRIORITY_SCANNING })
    if (scanningCount === 0) {
        if (isScanning) {
            console.log('SCAN DONE')
            isScanning = false
            emit('SCAN-DONE', {})
            initializeQueue()
        }
    } else if (scanningCount > 0) {
        console.log('SCANNING')
        isScanning = true
        emit('SCANNING', {})
    }
});

queue.on("idle", () => {
    count = 0
    console.log('QUEUE IDLE')
    resetUpdateWorker()
    console.log('QUEUE IDLE UPDATE WITH : ', queue.pending, ' new queues')
})

queue.on('next', () => {

})

const addDelay = (priority: number, delay: number | null = null) => {
    queue.add(async () => await new Promise(resolve => {
        console.log(`Delay ${delay || queueDelay} ms, `, { priority })
        setTimeout(resolve, delay || queueDelay)
    }), { priority });
}

const resetUpdateWorker = (skipDelay = false) => {
    console.log('RESET UPDATE WORKER')
    if (!skipDelay) {
        Array(parseInt(CONCURRENCY)).fill('0').forEach(() => {
            addDelay(PRIORITY_UPDATE)
        })
    }

    ips.forEach(({ ip, _id }) => {
        queue.add(() => {
            return worker(ip, _id)
        }, { priority: PRIORITY_UPDATE })
    })
}

const worker = async (ip: string, _id: string): Promise<void> => {
    return await new Promise<void>(resolve => {
        fetchSingleStb({ ip })
            .then(result => {
                console.log(`RESULT for ${ip}`)
                if (result) {
                    result._id = _id
                    try {
                        emit('UPDATE SINGLE', result)
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    getStb(_id)
                        .then(result => {
                            emit('UPDATE SINGLE', {
                                ...result,
                                lastUpdate: 0,
                                lastRequest: 0
                            })
                        })
                }
            })
            .finally(() => {
                resolve()
            })
    })
}

export const init = (ip: IpQueue[]) => {
    queue.pause()
    queue.clear()
    if(ips.length > 0) ips.splice(0, ips.length)
    ips.push(...ip)
    console.log(`INIT QUEUES, ADD ${ips.length}`)
    resetUpdateWorker(true)
    queue.start()
}

export const setQueueDelay = (d: number) => {
    console.log(`SET QUEUE DELAY TO ${d}`)
    queueDelay = d
}

export const clearIps = () => {
    console.log(`QUEUES CLEAR IP`)
    ips.splice(0, ips.length)
}

export const add = (p: Promise<any>, priority = 0, delay: number | null = null) => {
    // addDelay(priority)
    console.log(`QUEUES ADD JOB`)
    queue.add(async () => {
        return await p
    }, { priority })
    if (delay) {
        addDelay(priority, delay)
    }
}

export const pause = () => {
    return queue.pause()
}

export const resume = () => {
    if (queue.sizeBy({ priority: PRIORITY_UPDATE }) === 0) {
        resetUpdateWorker()
    }
    queue.start()
    console.log('IS QUEUE PAUSED ? :', queue.isPaused)
    console.log(`Working on Size: ${queue.size}  Pending: ${queue.pending}`);
}

