import replace from 'lodash/replace'
import run from "./run.js";
import {NodeSSH} from "node-ssh";
import {CustomNodeSSH} from "./CustomNodeSSH";

const getNetworkDeviceStatus = async (ssh: CustomNodeSSH): Promise<Array<string>> => {
  const result = (await run(ssh, "ip -o link show | awk '{print $2,$9}'")) || ''
  const data = result.split('\n').filter(text => text && text.length > 0 && text.indexOf(': UP') >= 0)
  try {
    return data.map(text => replace(text, ': UP', ''))
  } catch (e) {
    console.log(e)
    console.log('ERROR : ', {
      data,
      result
    })
    return []
  }
}

export default getNetworkDeviceStatus
