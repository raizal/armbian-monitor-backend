import {NodeSSH} from "node-ssh";
import {CustomNodeSSH} from "./CustomNodeSSH";

const run = async (ssh: CustomNodeSSH, command:string, showlog: boolean = false, saveLog: boolean = false): Promise<string> => {
  if (!ssh || !ssh.isConnected()) return null

  if (showlog) console.log(`RUN : ${command}`)
  const result = await ssh.execCommand(command, { cwd:'/root' }, saveLog)
  const error = result.stderr
  const output = result.stdout
  if (showlog) console.log(`RESULT : ${error || output}`)

  if (error) return error
  return output
}

export type UploadProgressListener = (progress: number, filepath: string, remoteFile: string) => void

export type LogListener = (log: string) => void

export const upload = async (ssh: NodeSSH, filepath: string, remoteFile: string, onProgress: LogListener) => {
  if (!ssh || !ssh.isConnected()) return null

  const result = await ssh.putFile(filepath, remoteFile, null, {
    step: (transfered: number, chunk: number, total: number) => {
      const progress = Math.ceil(((transfered > 0 ? transfered : 1)/total) * 100)

      if (onProgress) onProgress(`Uploading ${filepath} to ${remoteFile} ${progress}%`)

      console.log('UPLOAD : ', progress, '%' )
    },
    concurrency: 5
  })
  return result
}

export default run
