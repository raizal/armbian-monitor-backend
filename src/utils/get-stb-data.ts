import replace from 'lodash/replace'
import getHostname from "./get-hostname.js";
import getMacAddress from "./get-macaddresses.js";
import getNetworkDeviceStatus from "./get-net-devices.js";
import fetchTemp from "./get-device-temp.js";
import getOS from "./get-osname.js";
import getHashrate from "./get-hashrate.js";
import {getMinerStatus} from "./install-utils/install-miner.js";
import {isSkywireExist} from "./install-utils/install-skywire.js";
import Stb from "../model/stb";
import {NodeSSH} from "node-ssh";
import {getNodeStatus} from "./install-utils/install-node";
import {getPm2Status} from "./install-utils/install-pm2";
import getMinerScript from "./get-miner-script";

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

    // const workerName = await getWorkername(ssh)

    const nodeStatus = await getNodeStatus(ssh)

    const pm2Status = await getPm2Status(ssh)

    const ccminerStatus = await getMinerStatus(ssh)

    const skywireStatus = await isSkywireExist(ssh)

    const minerScript = await getMinerScript(ssh)

    const result = {
      hostname: replace(hostname, 'stb', ''),
      name: hostname,
      mac: (macAddresses || []).filter(mac => mac !== '00:00:00:00:00:00'),
      os,
      netDev,
      temp,
      hashrate,
      diff,
      shares,
      workerName: 'n/a',
      nodeStatus,
      pm2Status,
      ccminerStatus,
      skywireStatus,
      minerScript,
      _id: hostname
    }

    return result
  } catch (e) {
    console.error(e)
  }
  return null
}

export const getSTBMinimumData = async (ssh: NodeSSH, netDevice = 'wlan0'): Promise<Stb> => {
  try {

    const temp = await fetchTemp(ssh)

    const hostname = await getHostname(ssh)

    const { hashrate, diff, shares } = await getHashrate(ssh)

    const ccminerStatus = await getMinerStatus(ssh)

    const skywireStatus = await isSkywireExist(ssh)

    const nodeStatus = await getNodeStatus(ssh)

    const pm2Status = await getPm2Status(ssh)
    const minerScript = await getMinerScript(ssh)

    const result = {
      _id: hostname,
      temp,
      hashrate, diff, shares,
      ccminerStatus,
      skywireStatus,
      nodeStatus,
      pm2Status,
      minerScript
    }
    return result
  } catch (e) {
    console.error(e)
  }
  return null
}

export default getSTBData
