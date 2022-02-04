import run from "./run.js";
import {NodeSSH} from "node-ssh";

const fetchTemp = async (ssh: NodeSSH): Promise<number> => {
  const tempInGrand = await run(ssh, 'cat /etc/armbianmonitor/datasources/soctemp')
  return parseInt(tempInGrand) / 1000
}

export default fetchTemp
