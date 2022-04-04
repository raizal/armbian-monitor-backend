import run from "./run.js";
import { NodeSSH } from "node-ssh";
import {CustomNodeSSH} from "./CustomNodeSSH";

const  getHostname = async (ssh: CustomNodeSSH): Promise<string> => {
  return await run(ssh, 'cat /etc/hostname')
}

export default getHostname
