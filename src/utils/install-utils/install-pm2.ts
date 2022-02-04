import run from "../run.js";
import {NodeSSH} from "node-ssh";
import {InstallationStatus} from "../../model/stb";

export const isPm2Exist = async (ssh: NodeSSH) => {
  const response = await run(ssh, 'pm2 -v')
  return (response.indexOf('not found') >= 0) ? InstallationStatus.NOT_INSTALLED : InstallationStatus.INSTALLED
}

const installPm2 = async (ssh: NodeSSH) => {
  await run(ssh, 'npm install -g pm2')
  await run(ssh, 'pm2 startup')
  return true
}
export default installPm2
