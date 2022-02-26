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
import getMinerScript from "./get-miner-script";
import getCpuLoad from "./get-cpu-load";
import getIp from "./get-ip";

const getMac = async (ssh: NodeSSH, netDev: string[]) => {
  const macRequestPromises: Array<Promise<void>> = []

  const macAddresses: Array<string> = []

  netDev.forEach(net => {
    macRequestPromises.push(new Promise(async (resolve) => {
      macAddresses.push(await getMacAddress(ssh, net))
      resolve()
    }))
  })

  await Promise.all(macRequestPromises)
  return macAddresses
}

const getSTBData = async (ssh: NodeSSH, netDevice = 'wlan0'): Promise<Stb>=> {
  try {
    const hostname = await getHostname(ssh)
    const os = await getOS(ssh)

    const netInfo = await getIp(ssh)

    const temp = await fetchTemp(ssh)

    const { hashrate, diff, shares, lastUpdate } = await getHashrate(ssh)

    const ccminerStatus = await getMinerStatus(ssh)

    const skywireStatus = await isSkywireExist(ssh)

    const minerScript = await getMinerScript(ssh)
    const cpuLoad = await getCpuLoad(ssh)

    const lastRequest = new Date().getTime()

    const result = {
      hostname,
      name: hostname,
      mac: netInfo.map(net => net.mac),
      ips: netInfo.map(net => net.ip).filter(ip => ip && ip.length > 0),
      os,
      netDev: netInfo.map(net => net.dev),
      temp,
      hashrate,
      diff,
      shares,
      workerName: 'n/a',
      ccminerStatus,
      skywireStatus,
      lastUpdate,
      lastRequest,
      cpuLoad,
      minerScript,
    }

    return result
  } catch (e) {
    console.error(e)
  }
  return null
}

export default getSTBData
