import run from "./run.js";
import {NodeSSH} from "node-ssh";

const getMinerScript = async (ssh: NodeSSH): Promise<string> => {
    return await run(ssh, 'cat /root/ccminer/run.sh')
}

export default getMinerScript
