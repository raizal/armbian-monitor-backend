import {CCMINER_FILE, NODE_FILE} from "./const.js";
import run from "../run.js";
import getStatus from "./check-status.js";
import {NodeSSH} from "node-ssh";
import {InstallationStatus} from "../../model/stb";

const installMiner = async (ssh: NodeSSH) => {
  //install node & pm2
  await ssh.putFile(`./files/${CCMINER_FILE}`, `/root/${CCMINER_FILE}`)
  await run(ssh, `tar xfv ./${CCMINER_FILE}`)
  await run(ssh, `rm ${NODE_FILE}`)
  const minerStatus = await isMinerExist(ssh)
  if (minerStatus === InstallationStatus.INSTALLED) {
    await run (ssh, 'pm2 start ccminer/run.sh --name ccminer')
  }
  return true
}

export const isMinerExist = async (ssh: NodeSSH): Promise<InstallationStatus> => {
  return await getStatus(ssh, "ccminer", "run.sh", "ccminer")
}

export default installMiner

