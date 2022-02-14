import {NodeSSH} from "node-ssh";
import installNode, {isNodeExist} from "../../utils/install-utils/install-node";
import installPm2 from "../../utils/install-utils/install-pm2";
import {Socket} from "socket.io";
import emitLog from "../../utils/emit-log";
import {INSTALL_LOG} from "../const";
import run from "../../utils/run";

const pm2Install = async (ssh: NodeSSH, client: Socket, id: string) => {
    try {
        console.log('check node existence')
        if (!await isNodeExist(ssh)) {
            console.log('node not exists')
            emitLog(id, INSTALL_LOG, `Installing NodeJs`)
            await installNode(ssh, (progress, filepath, remoteFile) => {
                emitLog(id, INSTALL_LOG, `Downloading NodeJS: ${progress}%`)
            })
            console.log('node installed')
        } else {
            console.log('node exist')
        }
        emitLog(id, INSTALL_LOG, `NodeJS Installed`)
        console.log('check pm2 existence')

        emitLog(id, INSTALL_LOG, `Configure pm2`)
        await installPm2(ssh)

        emitLog(id, INSTALL_LOG, `pm2 installed`, true)
        await run(ssh, 'crontab -r')
        return true
    } catch (e) {
        emitLog(id, INSTALL_LOG, `pm2 install failed`, true)
        console.error('INSTALL PM2 : ', e)
    }
    return false
}

export default pm2Install
