import run from "../run.js";
import getStatus from "./check-status.js";
import {InstallationStatus} from "../../model/stb";
import {NodeSSH} from "node-ssh";
import {CustomNodeSSH} from "../CustomNodeSSH";

const installSkywire = async (ssh: CustomNodeSSH) => {
  await run(ssh,'mkdir skywire')
  await run(ssh,'tar zxfv skywire.tar.gz -C skywire')
  await run(ssh,'cd skywire && ./skywire-cli config gen -i')
  await run(ssh, 'echo "/root/skywire/skywire-visor -c /root/skywire/skywire-config.json" > /root/skywire/run.sh')
  const status = await isSkywireExist(ssh)
  if (status === InstallationStatus.INSTALLED) {
    await run (ssh, 'pm2 start skywire/run.sh --name skywire')
  }
  return true
}

export const isSkywireExist = async (ssh: CustomNodeSSH) => {
  return await getStatus(ssh, "skywire", "skywire-visor", "skywire-visor")
}

export default installSkywire
