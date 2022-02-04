import run from "./run.js";
import {NodeSSH} from "node-ssh";

const  getWorkername = async (ssh: NodeSSH) => {
  return await run(ssh, 'echo "$WORKER_NAME"')
}

export default getWorkername
