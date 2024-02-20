import connect from "./connect.js";
import getSTBData from "./get-stb-data.js";
import Stb from "../model/stb";
import {saveStb} from "../repository/stb";

export const fetchSingleStb = async ({
  ip = '192.168.1.1',
  netDevice = '*'
}): Promise<Stb> => {
  try {
    const ssh = await connect(ip)
    const dataStb = await getSTBData(ssh, netDevice)
    //ssh.dispose()
    if (dataStb) {
      const dbsave = await saveStb({
        ...dataStb,
        ip
      })

      return {
        ...dataStb,
        ip,
        _id: dbsave.id
      }
    }
  } catch (e) {
    console.error(`ERROR ${ip} : `, e.message)
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

const fetchStbNonBlocking = ({
  segments = '192.168.1',
  start = 1,
  end = 254,
  netDevice = '*',
  onFound
}: FetchStbArgs): Promise<void>[] => {
  const promises: Promise<void>[] = []

  for (let i = start; i <= end; i++) {
    const ip = `${segments}.${i}`

    promises.push(new Promise<void>(async (resolve) => {
      try {
        const result = await fetchSingleStb({ ip, netDevice })
        if (result) {
          if (onFound) onFound(result)
        }
      } catch (e) {
        console.error(`${ip} : `, e)
      }
      resolve()
    }))
  }
  return promises
}

export default fetchStbNonBlocking
