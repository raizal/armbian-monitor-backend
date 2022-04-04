import run from "./run.js";
import {NodeSSH} from "node-ssh";
import {CustomNodeSSH} from "./CustomNodeSSH";

const deleteOldWifiConfigs = async (ssh: CustomNodeSSH) => {
  return await run(ssh, 'rm /etc/NetworkManager/system-connections/*')
}

export default deleteOldWifiConfigs
