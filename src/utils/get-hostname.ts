import run from "./run.js";
import { NodeSSH } from "node-ssh";

const  getHostname = async (ssh: NodeSSH): Promise<string> => {
  return await run(ssh, 'cat /etc/hostname')
}

export default getHostname
