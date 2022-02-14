import Setting from "../model/setting";
import {getAllConfig, saveConfigs} from "../repository/setting";
import {Socket} from "socket.io";

export const loadConfig = (client: Socket) => {
    getAllConfig()
        .then(result => {
            if (result) {
                const configs = result.docs
                console.log('LOAD CONFIGS : ', configs)
                client.emit('web-client-receive', {
                    action: 'LOAD SETTING',
                    result: configs
                })
            } else {
                client.emit('web-client-receive', {
                    action: 'LOAD SETTING',
                    result: []
                })
            }
        })
        .catch(e => {
            console.log(e)
            client.emit('web-client-receive', {
                action: 'LOAD SETTING',
                result: []
            })
        })
}

export const saveConfig = (client: Socket, payloads: any) => {
    console.log('SAVE CONFIG PAYLOAD : ', payloads)
    const settings: Setting[] = Object.keys(payloads).map<Setting>((name: string, index: number) => {
        const value: string = payloads[name]
        return {
            name,
            value
        }
    })
    console.log('SAVE CONFIG SETTINGS : ', settings)
    const isSuccess = saveConfigs(settings)
    client.emit('web-client-receive', {
        action: 'SAVE SETTING',
        result: isSuccess
    })
    if (isSuccess) {
        loadConfig(client)
    }
}