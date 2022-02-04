import {NODE_FILE} from "./const.js";
import run from "../run.js";
import {NodeSSH} from "node-ssh";
import {InstallationStatus} from "../../model/stb";

export const isNodeExist = async (ssh: NodeSSH) => {
  const response = await run(ssh, 'node -v')
  return (response.indexOf('not found') >= 0) ? InstallationStatus.NOT_INSTALLED : InstallationStatus.INSTALLED
}

const installNode = async (ssh: NodeSSH) => {
  //install node & pm2
  await ssh.putFile(`./files/${NODE_FILE}.tar.xz`, `/root/${NODE_FILE}.tar.xz`)
  await run(ssh, `tar xfv ./${NODE_FILE}.tar.xz`)
  await run(ssh, 'mv node-v16.13.1-linux-arm64 node')
  await run(ssh, 'echo "NODE_HOME=/root/node" >> .bashrc')
  await run(ssh, 'echo "PATH=$NODE_HOME/bin:$PATH" >> .bashrc')
  await run(ssh, 'source .bashrc')
  await run(ssh, `rm ${NODE_FILE}.tar.xz`)
  return true
}

export default installNode
