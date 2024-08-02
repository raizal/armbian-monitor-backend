import {getAllStb, getStb} from "../repository/stb";
import {fetchSingleStb} from "../utils/get-stb-non-blocking.js";
import {Socket} from "socket.io";
import {getConfigValue} from "../repository/setting";
import {init, resume, setQueueDelay} from "../repository/updates-queue";

const sendSingleDeviceUpdate = async (client: Socket, id: string) => {
    const stbData = await getStb(id)
    const data = await fetchSingleStb({ip: stbData.ip})
    console.log('SEND STB DATA')
    if (data) {
        client.emit('web-client-receive', {
            action: 'UPDATE SINGLE',
            result: data
        })
    }
}

const sendDeviceUpdate = async (client: Socket) => {
    const data = await getAllStb()
    console.log('SEND STB DATA')
    client.emit('web-client-receive', {
        action: 'UPDATE',
        result: data.docs
    })
}

export const initializeQueue = (forcedDelay: string = null) => {
    console.log('INITIATE PERIODIC FETCH')
    getConfigValue('refreshInterval', '2')
        .then(async (value: string) => {
            // await stopPeriodicFetch()
            const delay = parseInt(forcedDelay || value) * 1000
            // console.log('ASSIGN IP')
            // console.log(`SET DELAY TO : ${delay} ms`)
            const data = await getAllStb()
            const ips = data.docs.map(({ip, _id}) => ({ip, _id}))
            setQueueDelay(delay)
            init(ips)
            resume()
        })
}

export const stopPeriodicFetch = async () => {

}

export default sendDeviceUpdate
