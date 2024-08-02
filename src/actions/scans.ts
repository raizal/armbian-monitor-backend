import fetchStb, {fetchSingleStb} from "../utils/get-stb-non-blocking.js";
import {emit} from "../utils/emit-log";
import {getConfig} from "../repository/setting";
import {initializeQueue, stopPeriodicFetch} from "./device-update";
import {add, PRIORITY_SCANNING} from "../repository/updates-queue";

export default async () => {
  try {
    const subnetConfig = await getConfig('segments')
    const subnets = subnetConfig.value.split(',')

    // emit('SCANNING', {
    // })

    // in case more than 1 subnet, make it processed one by one
    for (const subnet of subnets) {
      console.log('finding stb : ', subnet)
      const segments = subnet.trim(), start = 1, end = 254, netDevice = '*'
      for (let i = start; i <= end; i++) {
        const ip = `${segments}.${i}`
        add(new Promise<void>(async (resolve) => {
          try {
            const result = await fetchSingleStb({ ip, netDevice })
            if (result) {
              emit('UPDATE SINGLE', result)
            }
            console.log(`check ${ip} : `, result ? 'FOUND' : 'X')
          } catch (e) {
            console.error(`${ip} : `, e)
          } finally {
            resolve()
          }
        }), PRIORITY_SCANNING)
      }
    }

    console.log('finding stb done')
    // emit('SCAN-DONE', {})
  } catch (e) {
    console.error(e)
  }
}
