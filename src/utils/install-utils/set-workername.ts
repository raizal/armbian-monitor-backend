import run from "../run.js";
import {NodeSSH} from "node-ssh";

const setWorkerName = async (ssh: NodeSSH, workerName: string) => {
  await run(ssh, `echo "WORKER_NAME=${workerName}" >> /etc/environment`)
  return true
}

export default setWorkerName
