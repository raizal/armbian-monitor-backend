import connect from "./connect.js";
import getSTBData, {getSTBMinimumData} from "./get-stb-data.js";
import Stb from "../model/stb";

export const fetchSingleStb = async ({
  ip = '192.168.1.1',
  netDevice = '*',
  minimum = false
}): Promise<Stb> => {
  try {
    const ssh = await connect(ip)
    const dataStb = await (minimum? getSTBMinimumData(ssh, netDevice) : getSTBData(ssh, netDevice))

    ssh.dispose()
    if (dataStb) {
      return {
        ...dataStb,
        ip,
        lastUpdate: new Date().getTime()
      }
    }
  } catch (e) {
    if (e.level !== 'client-timeout') console.error(`${ip} : `, e)
  }
  return null
}

export interface FetchStbArgs {
  segments: string,
  start?: number,
  end?: number,
  netDevice?: string | '*',
  onFound?: (stb: Stb | null) => void
}

const fetchStbNonBlocking = async ({
  segments = '192.168.1',
  start = 1,
  end = 254,
  netDevice = '*',
  onFound
}: FetchStbArgs) => {
  const stb: Stb[] = []
  const promises = []

  for (let i = start; i <= end; i++) {
    const ip = `${segments}.${i}`

    promises.push(new Promise<void>(async (resolve) => {
      try {
        const result = await fetchSingleStb({ ip, netDevice })
        if (result) {
          stb.push(result)
          if (onFound) onFound(result)
        }
      } catch (e) {
        if (e.level !== 'client-timeout') console.error(`${ip} : `, e)
      }
      resolve()
    }))
    if (promises.length === 25) {
      await Promise.all(promises)
      promises.splice(0, promises.length)
    }
  }
  await Promise.all(promises)
  return stb
}

export default fetchStbNonBlocking
