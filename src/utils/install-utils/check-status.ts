import run from "../run.js";
import {InstallationStatus} from "../../model/stb";
import {NodeSSH} from "node-ssh";

export const getStatus = async (ssh: NodeSSH, dirName: string, fileName: string, processName: string) => {
  const response = await run(ssh, `ls | grep "${dirName}"`)
  const exists = response.indexOf(dirName) >= 0

  if (exists) {
    const file = fileName
    const response2 = await run(ssh, `ls ${dirName}/ | grep "${file}"`)
    if (response2.indexOf(file) >= 0) {
      const pid = await run(ssh, `pgrep ${processName}`)
      if (pid && pid.length > 0 && !isNaN(parseInt(pid))) {
        return InstallationStatus.RUNNING
      }
      return InstallationStatus.INSTALLED
    }
  }
  return InstallationStatus.NOT_INSTALLED
}

export default getStatus
