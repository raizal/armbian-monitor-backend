import run from "./run.js";
import { isArray, replace } from 'lodash'
import { NodeSSH } from "node-ssh";

const getHashrate = async (ssh: NodeSSH) => {
  try {
    const miningLog = await run(ssh, 'tail /root/mining.log')
    const hashrateLog = miningLog.split('\n')
    const result = hashrateLog.slice().reverse().find((log) => {
      const logRaws = log.split(', ')
      return (isArray(logRaws) && logRaws.length === 2 && logRaws[0].indexOf(' (diff ') >= 0)
    })
    if (result) {
      const raws = result.split('), ')
      const rawsDiffShares = raws[0].split(' (')

      const diff = rawsDiffShares[0].replace('accepted: ', '')
      const shares = rawsDiffShares[1].replace('diff ', '')

      const hashrate = replace((raws[1] || ''), ' \x1B[32myes!\x1B[0m', '')
      return {
        hashrate,
        diff,
        shares
      }
    }
  } catch (e) {
    console.error(e)
  }

  return {
    hashrate: 'n/a',
    diff: 'n/a',
    shares: 'n/a'
  }
}

export default getHashrate
