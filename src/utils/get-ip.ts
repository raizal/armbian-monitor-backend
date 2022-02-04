import run from "./run.js";
import {NodeSSH} from "node-ssh";

const getIp = async (ssh: NodeSSH): Promise<Array<string>> => {
  const rawResponse = await run(ssh, 'ip -4 addr | grep -oP \'(?<=inet\\s)\\d+(\\.\\d+){3}\'\n')
  const ips = rawResponse.split('\n')
  return ips.filter((ip) => {
    return ip !== '127.0.0.1' && ip !== 'localhost'
  })
}

export default getIp
