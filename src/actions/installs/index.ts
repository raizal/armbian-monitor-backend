import {Socket} from "socket.io";
import { get } from 'lodash'
import {deleteStb, getStb, saveStb} from "../../repository/stb";
import connect from "../../utils/connect";
import ccminerInstall from "./ccminer";
import run from "../../utils/run";
import {add, PRIORITY_SETUP_CCMINER} from "../../repository/updates-queue";
import {saveConfig, saveConfigs} from "../../repository/setting";
import {initializeQueue} from "../device-update";
import {getLog} from "../../repository/log";

const single = async (id: string, client: Socket, action: string, payload: any) => {
    try {
        const stb = await getStb(id)
        console.log(`PROCEEED ${action} done : `, stb)
        switch (action) {
            case 'SHUTDOWN': {
                add(new Promise<void>(async (resolve) => {
                    try {
                        const ssh = await connect(stb.ip)
                        run(ssh, 'poweroff', true)
                        //ssh.dispose()
                    } catch (e) {}
                    resolve()
                }), PRIORITY_SETUP_CCMINER)
            }
            case 'RESTART': {
                add(new Promise<void>(async (resolve) => {
                    try {
                        const ssh = await connect(stb.ip)
                        await run(ssh, 'reboot', true)
                        //ssh.dispose()
                    } catch (e) {}
                    resolve()
                }), PRIORITY_SETUP_CCMINER)
            }
                break
            case 'CHANGE & APPLY CONFIG': {
                const {
                    config
                } = payload
                for (const key of Object.keys(config)) {
                    await saveConfig(key, config[key])
                }
                add(ccminerInstall(client, stb), PRIORITY_SETUP_CCMINER)
            }
            break
            case "SET HOSTNAME": {
                const {
                    hostname
                } = payload
                console.log({
                    action, payload
                })

                try{
                    const ssh = await connect(stb.ip)

                    await run(ssh, `echo "${hostname}" > /etc/hostname`)
                    await deleteStb(id)
                    const updated = {
                        ...stb,
                        name: hostname,
                        hostname,
                        _id: hostname
                    }
                    await saveStb(updated)
                    await ccminerInstall(client, updated)
                    initializeQueue()
                    //ssh.dispose()
                } catch (e) {
                }

            }
            case "SETUP CCMINER": {
                add(ccminerInstall(client, stb), PRIORITY_SETUP_CCMINER)
            }
                break
            case "STOP MINER": {
                add(new Promise<void>(async (resolve) => {
                    try {
                        const ssh = await connect(stb.ip)
                        await run(ssh, 'systemctl stop ccminer.service', true)
                        await run(ssh, 'pkill ccminer', true)
                        //ssh.dispose()
                    } catch (e) {}
                    resolve()
                }), PRIORITY_SETUP_CCMINER)
            }
                break
            case "SHOW LOG": {
                const data = await getLog(stb.ip)
                client.emit('web-client-receive', {
                    action: 'SHOW LOG',
                    result: data.docs
                })
            }
                break
        }
    } catch (e) {
        console.error(e)
    }
}

const multi = async (ids: string[], client: Socket, action: string, payload: any) => {
    for (const id of ids) {
        await single(id, client, action, payload)
    }
}

export default async (client: Socket, action: string, payload: any) => {
    console.log({
        action, payload
    })
    console.log(`PROCEEED ${action}`)

    const id = get(payload, 'id', null)
    const ids = get(payload, 'ids', [])
    if (id) return await single(id, client, action, payload)
    if (ids && ids.length > 0) return await multi(ids, client, action, payload)
}
