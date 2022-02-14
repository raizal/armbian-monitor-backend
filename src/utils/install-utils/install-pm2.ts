import run from "../run.js";
import {NodeSSH} from "node-ssh";
import {InstallationStatus} from "../../model/stb";

const DEBUG = false

export const isPm2Exist = async (ssh: NodeSSH) => {
  const response = await run(ssh, 'pm2 -v', DEBUG)
  return !(response.indexOf('not found') >= 0)
}

export const getPm2Status = async (ssh: NodeSSH) => {
  const response = await run(ssh, 'pm2 -v', DEBUG)
  return (response.indexOf('not found') >= 0) ? InstallationStatus.NOT_INSTALLED : InstallationStatus.INSTALLED
}

const installPm2 = async (ssh: NodeSSH) => {
  if (!await isPm2Exist(ssh)) {
    await run(ssh, 'npm install -g pm2', DEBUG)
    await run(ssh, 'rm /usr/bin/pm2', DEBUG)
    await run(ssh, 'ln -s /root/node/bin/pm2 /usr/bin/', true)
    if(!await isPm2Exist(ssh)) throw new Error('Failed install pm2')
  }
  await run(ssh, 'pm2 startup', DEBUG)
  return true
}
export default installPm2
