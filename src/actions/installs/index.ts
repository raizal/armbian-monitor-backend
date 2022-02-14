import {Socket} from "socket.io";
import {getStb} from "../../repository/stb";
import connect from "../../utils/connect";
import ccminerInstall from "./ccminer";
import run from "../../utils/run";

export default async (client: Socket, action: String, payload: any) => {
    console.log({
        action, payload
    })
    console.log(`PROCEEED ${action}`)

    const {id} = payload
    try {

        const stb = await getStb(id)
        console.log(`PROCEEED ${action} done : `, stb)

        const ssh = await connect(stb.ip)

        switch (action) {
            case 'RESTART': {
                await run(ssh, 'reboot', true)
            }
                break
            case "SETUP CCMINER": {
                await ccminerInstall(ssh, client, stb)
            }
                break
        }
        ssh.dispose()

    } catch (e) {
        console.error(e)
    }
}
