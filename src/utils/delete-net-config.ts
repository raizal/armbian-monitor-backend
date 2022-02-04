import run from "./run.js";
import {NodeSSH} from "node-ssh";

const deleteOldWifiConfigs = async (ssh: NodeSSH) => {
  return await run(ssh, 'rm /etc/NetworkManager/system-connections/*')
}

export default deleteOldWifiConfigs
