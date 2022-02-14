import fetchStb from "../utils/get-stb-non-blocking.js";
import {emit} from "../utils/emit-log";
import {getConfig} from "../repository/setting";
import {periodicFetch, stopPeriodicFetch} from "./device-update";

export default async () => {
  stopPeriodicFetch()
  try {
    const subnetConfig = await getConfig('segments')
    const subnets = subnetConfig.value.split(',')
    const promises: Promise<void>[] = []

    emit('SCANNING', {
    })

    // in case more than 1 subnet, make it processed one by one
    for (const subnet of subnets) {
      console.log('finding stb : ', subnet)
      await fetchStb({
        segments: subnet.trim(),
        onFound: data => {
          console.log('found stb : ', data.ip)
          emit('UPDATE SINGLE', data)
        }
      })
    }

    console.log('finding stb done')
    emit('SCAN-DONE', {})
  } catch (e) {
    console.error(e)
  } finally {
    periodicFetch()
  }

}
