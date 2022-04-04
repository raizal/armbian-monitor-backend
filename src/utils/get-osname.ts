import run from "./run.js";
import {NodeSSH} from "node-ssh";
import {CustomNodeSSH} from "./CustomNodeSSH";

const getOS = async (ssh: CustomNodeSSH): Promise<string> => {
  return await run(ssh, 'cat /etc/issue')
}

export default getOS
