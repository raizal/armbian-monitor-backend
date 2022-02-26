import {NodeSSH} from "node-ssh";

const connections: Map<string, NodeSSH> = new Map<string, NodeSSH>()

const connect = async (ip: string, forceNew: boolean = false) => {
  if (!forceNew && connections.has(ip)) {
    const con = connections.get(ip)
    if (con.isConnected()) {
      return con
    } else {
      console.log(`DELETE CON ${ip}`)
      connections.delete(ip)
    }
  }
  const ssh = new NodeSSH()
  await ssh.connect({
    host: ip,
    username: process.env.STB_USERNAME,
    password: process.env.STB_PASSWORD,
    readyTimeout: 2000,
    keepaliveCountMax: 300,
    keepaliveInterval: 10000
  })
  connections.set(ip, ssh)
  return ssh
}


export default connect
