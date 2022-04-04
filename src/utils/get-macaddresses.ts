import run from "./run.js";
import {NodeSSH} from "node-ssh";
import {CustomNodeSSH} from "./CustomNodeSSH";

const getMacAddress = async (ssh: CustomNodeSSH, device: string = 'wlan0'): Promise<string> => {
  return  await run(ssh, `cat /sys/class/net/${device}/address`)
}

export default getMacAddress
