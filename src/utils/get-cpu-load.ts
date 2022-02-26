import run from "./run.js";
import {NodeSSH} from "node-ssh";

const getCpuLoad = async (ssh: NodeSSH): Promise<string> => {
  return await run(ssh, 'echo "`LC_ALL=C top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1}\'`%"')
}

export default getCpuLoad
