import {CCMINER_FILE, NODE_FILE} from "./const.js";
import run, {upload, UploadProgressListener} from "../run.js";
import getStatus from "./check-status.js";
import {NodeSSH} from "node-ssh";
import {InstallationStatus} from "../../model/stb";
import path from "path";
import {getConfig, getConfigValue} from "../../repository/setting";

const DEBUG = true

export const ccminerFromConfig = async (workername: string = 'all-for-one') => {
  //zergpool format
  //-a verus -o stratum+tcp://verushash.asia.mine.zergpool.com:3300 -u wallet -p c=DOGE,mc=VRSC,ID=namaworker
  //luckpool
  //ccminer -a verus -o stratum+tcp://ap.luckpool.net:3956#xnsub -u RNZDrcf97tBDwWtCURFpBbexPaCR5evyuu.workername -p hybrid -d 0 -t 4
  //hellminer.exe -c stratum+tcp://ap.luckpool.net:3956#xnsub -u RNZDrcf97tBDwWtCURFpBbexPaCR5evyuu.cpu -p hybrid --cpu 18
  const wallet = await getConfigValue('wallet')
  const algo = await getConfigValue('algo', 'verus')
  const server = await getConfigValue('server')
  const threads = await getConfigValue('threads', '4')
  const password = await getConfigValue('password', 'x')
  return `/root/ccminer/ccminer -a ${algo} -o ${server} -u ${wallet}.${workername} ${password?.length > 0 ? '-p' : ''} ${password} -t ${threads} > /root/mining.log`
}

const isAvailabeInPm2 = async (ssh: NodeSSH) => {
  const rawResult = await run(ssh, 'pm2 prettylist')
  const pm2Processes: any[] = JSON.parse(rawResult)
  const found = pm2Processes.findIndex(process => process.name === 'ccminer')
  return found >= 0
}

const ccminerExist = async (ssh: NodeSSH, dirName: string, fileName: string) => {
  const response = await run(ssh, `ls ./`, true)
  const exists = response.indexOf(dirName) >= 0

  const cekFileExistence = await run(ssh, `ls ./${dirName} | grep ${fileName}`, true)
  const fileExists = !(cekFileExistence.indexOf('No such file or directory') >= 0)
  return exists && fileExists
}

const installMiner = async (ssh: NodeSSH, minerScript: string, uploadListener: UploadProgressListener) => {
  //install node & pm2
  const filepath = path.join(process.cwd(), 'files', `${CCMINER_FILE}`)
  const remotepath = `/root/${CCMINER_FILE}`

  const exists = await ccminerExist(ssh, 'ccminer', 'ccminer')
  console.log('CEK CCMINER EXISTS OR NOT : ', exists)
  if (!exists) {
    console.log('UPLOAD CCMINER')
    await upload(ssh, filepath, remotepath, () => {})
    await run(ssh, `unzip ./${CCMINER_FILE}`, DEBUG)
    await run(ssh, `rm ${CCMINER_FILE}`, DEBUG)
  }
  await run(ssh, 'chmod +x ./ccminer/*')
  await run(ssh, `echo "${minerScript}" > ccminer/run.sh`, DEBUG)
  const minerStatus = await getMinerStatus(ssh)
  if (minerStatus !== InstallationStatus.NOT_INSTALLED) {
    await run (ssh, 'pm2 start ccminer/run.sh --name ccminer', DEBUG)
  }
  if (isAvailabeInPm2) {
    await run (ssh, 'pm2 save', DEBUG)
  }
  return true
}

export const getMinerStatus = async (ssh: NodeSSH): Promise<InstallationStatus> => {
  return await getStatus(ssh, "ccminer", "run.sh", "ccminer")
}

export default installMiner

