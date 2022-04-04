import {NodeSSH} from "node-ssh";
import {Socket} from "socket.io";
import emitLog from "../../utils/emit-log";
import installMiner, {ccminerFromConfig} from "../../utils/install-utils/install-miner-systemd";
import {INSTALL_LOG} from "../const";
import run from "../../utils/run";
import Stb from "../../model/stb";
import {getConfigValue} from "../../repository/setting";
import {CustomNodeSSH} from "../../utils/CustomNodeSSH";

const ccminerInstall = async (ssh: CustomNodeSSH, client: Socket, stb: Stb) => {
    const { _id: id } = stb
    const workername = await getConfigValue('workername', 'all-for-one')
    try {
        await run(ssh, 'pkill ccminer')
        await run(ssh, 'pkill monit')
        await run(ssh, 'pkill pm2')

        await run(ssh, 'systemctl disable pm2-root.service')

        emitLog(id, INSTALL_LOG, `Installing ccminer`, false)

        // await installMiner(ssh, await ccminerFromConfig(workername === 'hostname' ? stb.hostname : workername), (log) => {
        //     emitLog(id, INSTALL_LOG, log, false)
        // })

        emitLog(id, INSTALL_LOG, `ccminer installed`, false)
        return true
    } catch (e) {
        emitLog(id, INSTALL_LOG, `ccminer install failed`, true)
        console.error('INSTALL CCMINER : ', e)
    }
    return false
}

export default ccminerInstall
