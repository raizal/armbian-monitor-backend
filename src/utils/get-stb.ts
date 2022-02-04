import connect from "./connect.js";
import getSTBData from "./get-stb-data.js";
import Stb from "../model/stb";

const fetchStb = async (segments = '192.168.1', start = 1, end = 254, netDevice = '*'): Promise<Stb[]> => {
  const stb: Stb[] = []
  const promises: Promise<void>[] = []

  for (let i = start; i <= end; i++) {
    const ip = `${segments}.${i}`

    promises.push(new Promise(async (resolve) => {
      try {
        const ssh = await connect(ip)

        const dataStb = await getSTBData(ssh, netDevice)
        if (dataStb) {
          stb.push({
            ...dataStb,
            ip
          })
        }
        ssh.dispose()
      } catch (e) {
        // console.error(`${ip} : `, e.message)
      }
      resolve()
    }))
    if (promises.length === 25) {
      await Promise.all(promises)
      promises.splice(0, promises.length)
    }
  }
  await Promise.all(promises)
  return stb.sort((a, b) => parseInt(a.hostname) - parseInt(b.hostname))
}

export default fetchStb

