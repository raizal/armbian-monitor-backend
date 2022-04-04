import {Config, NodeSSH, SSHExecCommandOptions, SSHExecCommandResponse} from "node-ssh";

export type SSHLog = (ip: string, text: string) => void

export class CustomNodeSSH extends NodeSSH {
    private config: Config
    public static log: SSHLog = () => {}

    public connect(givenConfig: Config): Promise<this> {
        this.config = givenConfig
        return super.connect(givenConfig)
    }

    public getConfig() {
        return this.config
    }

    public async execCommand(givenCommand:string, options?:SSHExecCommandOptions, saveLog: boolean = false): Promise<SSHExecCommandResponse>{
        if (CustomNodeSSH.log && saveLog) CustomNodeSSH.log(this.config.host, givenCommand)
        const result = await super.execCommand(givenCommand, options)
        if (CustomNodeSSH.log && saveLog) {
            if (result.stdout) {
                CustomNodeSSH.log(this.config.host, result.stdout)
            }
            if (result.stderr) {
                CustomNodeSSH.log(this.config.host, result.stderr)
            }
        }
        return result
    }

}
