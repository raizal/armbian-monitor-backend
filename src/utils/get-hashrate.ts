import run from "./run.js";
import { isArray, replace } from 'lodash'
import { NodeSSH } from "node-ssh";
import {CustomNodeSSH} from "./CustomNodeSSH";

const getHashrate = async (ssh: CustomNodeSSH) => {
  try {
    const pid = await run(ssh, `pgrep ccminer`)
    const ccminerRunning = pid && pid.length > 0 && !isNaN(parseInt(pid))

    const miningLog = await run(ssh, 'journalctl -u ccminer.service -n 5 --no-pager')

    if (!miningLog) throw Error(`empty mining log`)

    const hashrateLog = miningLog.split('\n')
    const result = hashrateLog.slice().reverse().find((log) => {
      const logRaws = log.split(']: ')[1].split(', ')
      return (isArray(logRaws) && logRaws.length === 2 && logRaws[0].indexOf(' (diff ') >= 0)
    })
    if (result) {
      const log = result.split(']: ')[1]
      const lastUpdateMatches = log.match(/\[(.*?)\]/);
      const lastUpdate = lastUpdateMatches.length > 1 ? lastUpdateMatches[1] : null
      const raws = log.split('), ')
      const rawsDiffShares = raws[0].split(' (')

      const shares = rawsDiffShares[0].replace('accepted: ', '').split(' ')[2]
      const diff = rawsDiffShares[1].replace('diff ', '')

      const hashrate = replace(replace((raws[1] || ''), ' yes!', ''), ' booooo', '')

      return {
        hashrate: ccminerRunning ? hashrate : 'n/a',
        diff,
        shares,
        lastUpdate: lastUpdate
      }
    }
  } catch (e) {
    console.error(e)
  }

  return {
    hashrate: 'n/a',
    diff: 'n/a',
    shares: 'n/a',
    lastUpdate: null
  }
}

export default getHashrate
