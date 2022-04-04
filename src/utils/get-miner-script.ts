import run from "./run.js";
import {NodeSSH} from "node-ssh";
import {CustomNodeSSH} from "./CustomNodeSSH";

const getMinerScript = async (ssh: CustomNodeSSH): Promise<string> => {
    return await run(ssh, 'cat /root/ccminer/run.sh')
}

export default getMinerScript
