import replace from 'lodash/replace'
import getHostname from "./get-hostname.js";
import getMacAddress from "./get-macaddresses.js";
import getNetworkDeviceStatus from "./get-net-devices.js";
import fetchTemp from "./get-device-temp.js";
import getOS from "./get-osname.js";
import getHashrate from "./get-hashrate.js";
import getWorkername from "./get-workername.js";
import {isPm2Exist} from "./install-utils/install-pm2.js";
import {isNodeExist} from "./install-utils/install-node.js";
import {isMinerExist} from "./install-utils/install-miner.js";
import {isSkywireExist} from "./install-utils/install-skywire.js";
import Stb from "../model/stb";
import {NodeSSH} from "node-ssh";

const getSTBData = async (ssh: NodeSSH, netDevice = 'wlan0'): Promise<Stb>=> {
  try {
    const hostname = await getHostname(ssh)
    const os = await getOS(ssh)
    const netDev = await getNetworkDeviceStatus(ssh)

    const macRequestPromises: Array<Promise<void>> = []

    const macAddresses: Array<string> = []

    netDev.forEach(net => {
      macRequestPromises.push(new Promise(async (resolve) => {
        macAddresses.push(await getMacAddress(ssh, net))
        resolve()
      }))
    })

    await Promise.all(macRequestPromises)

    const temp = await fetchTemp(ssh)

    const { hashrate, diff, shares } = await getHashrate(ssh)

    const workerName = await getWorkername(ssh)

    const nodeStatus = await isNodeExist(ssh)

    const pm2Status = await isPm2Exist(ssh)

    const ccminerStatus = await isMinerExist(ssh)

    const skywireStatus = await isSkywireExist(ssh)

    return {
      hostname: replace(hostname, 'stb', ''),
      name: hostname,
      mac: (macAddresses || []).filter(mac => mac !== '00:00:00:00:00:00'),
      os,
      netDev,
      temp,
      hashrate,
      diff,
      shares,
      workerName: workerName || 'n/a',
      nodeStatus,
      pm2Status,
      ccminerStatus,
      skywireStatus
    }
  } catch (e) {
    console.error(e)
  }
  return null
}

export const getSTBMinimumData = async (ssh: NodeSSH, netDevice = 'wlan0'): Promise<Stb> => {
  try {

    const temp = await fetchTemp(ssh)

    const { hashrate, diff, shares } = await getHashrate(ssh)

    const ccminerStatus = await isMinerExist(ssh)

    const skywireStatus = await isSkywireExist(ssh)

    return {
      temp,
      hashrate, diff, shares,
      ccminerStatus,
      skywireStatus
    }
  } catch (e) {
    console.error(e)
  }
  return null
}

export default getSTBData
