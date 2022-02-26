import run from "./run.js";
import {NodeSSH} from "node-ssh";

const getIp = async (ssh: NodeSSH): Promise<Array<any>> => {
  const rawResponse = await run(ssh, `ip a | awk 'function outline() {if (link>"") {printf "%s %s %s\\n", iface, inets, link}} $0 ~ /^[1-9]/ {outline(); iface=substr($2, 1, index($2,":")-1); inets=""; link=""} $1 == "link/ether" {link=$2} $1 == "inet" {inet=substr($2, 1, index($2,"/")-1); if (inets>"") inets=inets ","; inets=inets inet} END {outline()}'`)
  const ips = rawResponse.split('\n')
  return ips.filter((ip) => {
    return ip.length > 0 && ip !== '127.0.0.1' && ip !== 'localhost'
  }).map(net => {
    try {
      const splited = net.split(' ')
      return {
        dev: splited[0],
        ip: splited[1],
        mac: splited[2]
      }
    }catch (e) {}
    return {
      dev: null,
      ip: null,
      mac: null
    }
  })
}

export default getIp
