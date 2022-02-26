import {CCMINER_FILE, NODE_FILE} from "./const.js";
import run, {LogListener, upload, UploadProgressListener} from "../run.js";
import getStatus from "./check-status.js";
import {NodeSSH} from "node-ssh";
import {InstallationStatus} from "../../model/stb";
import path from "path";
import {getConfig, getConfigValue} from "../../repository/setting";

const DEBUG = true

export const ccminerFromConfig = async (workername: string = 'all-for-one', id: string) => {
  //zergpool format
  //-a verus -o stratum+tcp://verushash.asia.mine.zergpool.com:3300 -u wallet -p c=DOGE,mc=VRSC,ID=namaworker
  //luckpool
  //ccminer -a verus -o stratum+tcp://ap.luckpool.net:3956#xnsub -u RNZDrcf97tBDwWtCURFpBbexPaCR5evyuu.workername -p hybrid -d 0 -t 4
  //hellminer.exe -c stratum+tcp://ap.luckpool.net:3956#xnsub -u RNZDrcf97tBDwWtCURFpBbexPaCR5evyuu.cpu -p hybrid --cpu 18
  const wallet = await getConfigValue('wallet')
  const algo = await getConfigValue('algo', 'verus')
  const server = await getConfigValue('server')
  const threads = await getConfigValue(`${id}-threads`, await getConfigValue('threads', '4'))
  const password = await getConfigValue('password', 'x')
  return `/root/ccminer/ccminer -a ${algo} -o ${server} -u ${wallet}.${workername} ${password?.length > 0 ? '-p' : ''} ${password} -t ${threads} > /root/mining.log`
}

const ccminerExist = async (ssh: NodeSSH, dirName: string, fileName: string) => {
  const response = await run(ssh, `ls ./`, true)
  const exists = response.indexOf(dirName) >= 0

  const cekFileExistence = await run(ssh, `ls ./${dirName} | grep ${fileName}`, true)
  const fileExists = !(cekFileExistence.indexOf('No such file or directory') >= 0)
  return exists && fileExists
}

const installMiner = async (ssh: NodeSSH, minerScript: string, logListener: LogListener) => {
  //install node & pm2
  const filepath = path.join(process.cwd(), 'files', `${CCMINER_FILE}`)
  const remotepath = `/root/${CCMINER_FILE}`

  //checking if dir & file exists
  if(logListener) logListener('Check ccminer existence')
  const exists = await ccminerExist(ssh, 'ccminer', 'ccminer')
  console.log('CEK CCMINER EXISTS OR NOT : ', exists)
  if (!exists) {
    if(logListener) logListener(`ccminer not found. Install ccminer`)
    console.log('UPLOAD CCMINER')
    await upload(ssh, filepath, remotepath, logListener)
    await run(ssh, `unzip ./${CCMINER_FILE}`, DEBUG)
    await run(ssh, `rm ${CCMINER_FILE}`, DEBUG)
    await run(ssh, 'chmod +x ./ccminer/*')
  } else {
    if(logListener) logListener(`ccminer is exist`)
  }
  // assign new config
  if(logListener) logListener(`assign ccminer new config`)
  await run(ssh, `echo "${minerScript}" > ccminer/run.sh`, DEBUG)

  // const minerStatus = await getMinerStatus(ssh)
  await installCCMinerService(ssh)

  if(await isCCminerServiceIsEnabled(ssh)) {
    if(logListener) logListener(`restart ccminer.service`)
    await run(ssh, 'systemctl enable ccminer.service')
    await run(ssh, 'systemctl restart ccminer.service')
  }

  return true
}

export const isCCminerServiceIsInstalled = async (ssh: NodeSSH): Promise<boolean> => {
  const response = await run(ssh, 'systemctl is-enabled ccminer.service')
  return response.indexOf('enabled') >= 0 || response.indexOf('disabled') >= 0
}

export const isCCminerServiceIsEnabled = async (ssh: NodeSSH): Promise<boolean> => {
  const response = await run(ssh, 'systemctl is-enabled ccminer.service')
  return response.indexOf('enabled') >= 0
}

export const installCCMinerService = async (ssh: NodeSSH) => {
  const service = '[Unit]\n' +
      'Description=CCMiner\n' +
      'StartLimitIntervalSec=0\n' +
      'After=network.target\n' +
      '\n' +
      '[Service]\n' +
      'Type=simple\n' +
      'ExecStart=/bin/bash /root/ccminer/run.sh\n' +
      'Restart=always\n' +
      'RestartSec=1\n' +
      '\n' +
      '[Install]\n' +
      'WantedBy=multi-user.target\n'
  await run(ssh, `echo "${service}" > /etc/systemd/system/ccminer.service`)
  await run(ssh, 'systemctl daemon-reload')
  await run(ssh, 'systemctl enable ccminer.service')
}

export const getMinerStatus = async (ssh: NodeSSH): Promise<InstallationStatus> => {
  return await getStatus(ssh, "ccminer", "run.sh", "ccminer")
}

export default installMiner
