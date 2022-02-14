import {NodeSSH} from "node-ssh";

const run = async (ssh: NodeSSH, command:string, showlog: boolean = false): Promise<string> => {
  if (showlog) console.log(`RUN : ${command}`)
  const result = await ssh.execCommand(command, { cwd:'/root' })
  const error = result.stderr
  const output = result.stdout
  if (showlog) console.log(`RESULT : ${error || output}`)

  if (error) return error
  return output
}

export type UploadProgressListener = (progress: number, filepath: string, remoteFile: string) => void

export type LogListener = (log: string) => void

export const upload = async (ssh: NodeSSH, filepath: string, remoteFile: string, onProgress: LogListener) => {
  return await ssh.putFile(filepath, remoteFile, null, {
    step: (transfered, chunk, total) => {
      const progress = Math.ceil(((transfered > 0 ? transfered : 1)/total) * 100)

      if (onProgress) onProgress(`Uploading ${filepath} to ${remoteFile} ${progress}%`)

      console.log('UPLOAD : ', progress, '%' )
    },
    concurrency: 5
  })
}

export default run
