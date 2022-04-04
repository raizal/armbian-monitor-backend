import {CustomNodeSSH as NodeSSH} from "./CustomNodeSSH"

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
  const username = process.env.STB_USERNAME
  const passwordRaw = process.env.STB_PASSWORD

  try {
    // if password is eval-able, it means it contains multi password
    const passwords = eval(passwordRaw)

    for (const password of passwords) {
      try {
        const ssh = new NodeSSH()
        await ssh.connect({
          host: ip,
          username,
          password,
          readyTimeout: 2000,
          keepaliveCountMax: 300,
          keepaliveInterval: 10000
        })
        if (ssh.isConnected()) {
          connections.set(ip, ssh)
          return ssh
        }
      } catch (e) {
      }
    }
  } catch (e) {
    // if eval throw exception, it means the password is string
    try {
      const ssh = new NodeSSH()
      await ssh.connect({
        host: ip,
        username,
        password: passwordRaw,
        readyTimeout: 2000,
        keepaliveCountMax: 300,
        keepaliveInterval: 10000
      })
      if (ssh.isConnected()) {
        connections.set(ip, ssh)
        return ssh
      }
    } catch (e) {}
  }
  return null
}


export default connect
