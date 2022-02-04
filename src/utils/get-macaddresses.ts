import run from "./run.js";
import {NodeSSH} from "node-ssh";

const getMacAddress = async (ssh: NodeSSH, device: string = 'wlan0'): Promise<string> => {
  return  await run(ssh, `cat /sys/class/net/${device}/address`)
}

export default getMacAddress
