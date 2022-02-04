import {NodeSSH} from "node-ssh";

const connect = async (ip: string) => {
  const ssh = new NodeSSH()
  await ssh.connect({
    host: ip,
    username: process.env.STB_USERNAME,
    password: process.env.STB_PASSWORD,
    readyTimeout: 1000
  })
  return ssh
}


export default connect