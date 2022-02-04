import {NodeSSH} from "node-ssh";

const run = async (ssh: NodeSSH, command:string): Promise<string> => {
  const result = await ssh.execCommand(command, { cwd:'/root' })
  const error = result.stderr
  const output = result.stdout

  if (error) return error
  return output
}

export default run