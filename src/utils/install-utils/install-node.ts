import {NODE_FILE} from "./const.js";
import run, {upload, UploadProgressListener} from "../run.js";
import {NodeSSH} from "node-ssh";
import {InstallationStatus} from "../../model/stb";
import * as path from "path";

const DEBUG = false

export const getNodeStatus = async (ssh: NodeSSH) => {
    const response = await run(ssh, 'node -v', DEBUG)
    return (response.indexOf('not found') >= 0) ? InstallationStatus.NOT_INSTALLED : InstallationStatus.INSTALLED
}

export const isNodeExist = async (ssh: NodeSSH) => {
    const ls = await run(ssh, `ls ./`)
    const dirNodeExists = ls.indexOf('node') >= 0

    const response = await run(ssh, 'node -v', DEBUG)
    const nodeInstalled = !(response.indexOf('not found') >= 0)

    return dirNodeExists && nodeInstalled
}

const installNode = async (ssh: NodeSSH, onUpload: UploadProgressListener) => {
    //install node & pm2
    const filepath = path.join(process.cwd(), 'files', `${NODE_FILE}.tar.gz`)
    const remoteFile = `/root/${NODE_FILE}.tar.xz`
    console.log('UPLOAD NODE FILE : ', remoteFile)
    await upload(ssh, filepath, remoteFile, () => {})
    await run(ssh, `tar xfv ./${NODE_FILE}.tar.xz`, DEBUG)
    await run(ssh, 'rm /usr/bin/node /usr/bin/npm /usr/bin/npx /usr/bin/pm2')
    await run(ssh, 'ln -s /root/node/bin/node /usr/bin/', DEBUG)
    await run(ssh, 'ln -s /root/node/bin/npm /usr/bin/', DEBUG)
    await run(ssh, 'ln -s /root/node/bin/npx /usr/bin/', DEBUG)
    await run(ssh, 'ln -s /root/node/bin/pm2 /usr/bin/', DEBUG)
    await run(ssh, `rm ${NODE_FILE}.tar.xz`, DEBUG)
    const exists = await isNodeExist(ssh)
    if (!exists) throw new Error('Node failed to install')
}

export default installNode
