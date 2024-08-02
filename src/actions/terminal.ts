import {getStb} from "../repository/stb";
import connect from "../utils/connect";
import {Socket} from "socket.io";
import {NodeSSH} from "node-ssh";
import {ClientChannel} from "ssh2";
import Stb from "../model/stb";
import run from "../utils/run";

interface ActiveConnection {
  shellStream: ClientChannel,
  ssh: NodeSSH,
  isNew: boolean
}

const activeConnections: Map<string, ActiveConnection> = new Map<string, ActiveConnection>()

const getClient = async (stb: Stb): Promise<ActiveConnection> => {
  if (activeConnections.has(stb._id)) {
    return activeConnections.get(stb._id)
  }
  const ssh = await connect(stb.ip)
  const shellStream = await ssh.requestShell()
  activeConnections.set(stb._id, {
    ssh, shellStream, isNew: false
  })
  return {
    ssh, shellStream, isNew: true
  }
}

export const runCmd = async (client: Socket, cmd: string, id: string) => {
  const stb = await getStb(id);
  const ssh = await connect(stb.ip);
  const output = await run(ssh, cmd, true);
  client.emit(`terminal-${stb.hostname}`, {
    result: output,
  });
};

const terminalHandler = async (client: Socket, action: String, payload: any) => {
  console.log({
    action, payload
  })
  console.log(`PROCEEED ${action}`)

  const { id } = payload
  try {

    const stb = await getStb(id)
    console.log(`PROCEEED ${action} done : `, stb)

    const connection: ActiveConnection = await getClient(stb)

    switch (action) {
      case "SSH CLOSE": {
        connection.shellStream.close()
        connection.shellStream.destroy()
        connection.ssh.dispose()
      }
        break
      case "SSH CONNECT": {
        if (connection.isNew) {
          connection.shellStream.on('data', (data: any) => {
            client.emit('web-client-receive', {
              action: 'SHELL STREAM',
              result: data.toString()
            })
          })
          connection.shellStream.stderr.on('data', (data: any) => {
            client.emit('web-client-receive', {
              action: 'SHELL STREAM',
              result: data.toString()
            })
          })
        }
      }
        break
    }

  } catch (e) {
    console.error(e)
  }
}

export default terminalHandler;

