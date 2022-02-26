import run from "./run.js";
import { isArray, replace } from 'lodash'
import { NodeSSH } from "node-ssh";

const getHashrate = async (ssh: NodeSSH) => {
  try {
    const active = await run(ssh, 'ps -C ccminer | grep ccminer')
    const miningLog = await run(ssh, 'tail -n 5 /root/mining.log')
    const hashrateLog = miningLog.split('\n')
    const result = hashrateLog.slice().reverse().find((log) => {
      const logRaws = log.split(', ')
      return (isArray(logRaws) && logRaws.length === 2 && logRaws[0].indexOf(' (diff ') >= 0)
    })
    if (result) {
      const lastUpdateMatches = result.match(/\[(.*?)\]/);
      const lastUpdate = lastUpdateMatches.length > 1 ? lastUpdateMatches[1] : null
      const raws = result.split('), ')
      const rawsDiffShares = raws[0].split(' (')

      const shares = rawsDiffShares[0].replace('accepted: ', '').split(' ')[2]
      const diff = rawsDiffShares[1].replace('diff ', '')

      const hashrate = replace(replace((raws[1] || ''), ' \x1B[32myes!\x1B[0m', ''), '[31mbooooo[0m', '')

      const ccminerRunning = active && active.length > 0

      return {
        hashrate: ccminerRunning ? hashrate : 'n/a',
        diff,
        shares,
        lastUpdate: ccminerRunning ? lastUpdate : null
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
