import run from "./run.js";
import {NodeSSH} from "node-ssh";

const getOS = async (ssh: NodeSSH): Promise<string> => {
  return await run(ssh, 'uname -a')
}

export default getOS
