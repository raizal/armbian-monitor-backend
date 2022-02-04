import scans from "./scans";
import {Socket} from "socket.io";
import {loadConfig, saveConfig} from "./config-actions";

const actions = (socket: Socket) => (message: any) => {
    const client = socket
    const {action, payload} = message
    console.log('web-client-send : ', message)

    switch (action) {
        case 'SCAN':
            scans(client, action, payload)
            break
        case 'SAVE SETTING':
            saveConfig(client, payload)
            break
        case 'LOAD SETTING':
            loadConfig(client)
            break
    }
}

export default actions
