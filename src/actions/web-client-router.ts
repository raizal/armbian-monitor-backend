import scans from "./scans";
import {Socket} from "socket.io";
import {loadConfig, saveConfig} from "./config-actions";
import installs from "./installs";
import terminalHandler from "./terminal";
import sendDeviceUpdate from "./device-update";

const actions = (socket: Socket) => (message: any) => {
    const client = socket
    const {action, payload} = message
    console.log('web-client-send : ', message)

    switch (action) {
        case 'SCAN':
            scans()
            break
        case 'REFRESH':
            sendDeviceUpdate(client)
            break
        case 'SAVE SETTING':
            saveConfig(client, payload)
            break
        case 'LOAD SETTING':
            loadConfig(client)
            break
        case 'SSH CONNECT':
        case 'SSH CLOSE':
            terminalHandler(client, action, payload)
            break
        default:
            installs(client, action, payload)
            break
    }
}

export default actions
