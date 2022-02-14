import {setIntervalAsync, clearIntervalAsync, SetIntervalAsyncTimer} from 'set-interval-async/dynamic'

import {getAllStb, getStb} from "../repository/stb";
import {fetchSingleStb} from "../utils/get-stb-non-blocking.js";
import {Socket} from "socket.io";
import {emit} from "../utils/emit-log";
import {getConfigValue} from "../repository/setting";

const sendSingleDeviceUpdate = async (client: Socket, id: string) => {
  const stbData = await getStb(id)
  const data = await fetchSingleStb({ ip: stbData.ip })
  console.log('SEND STB DATA')
  if (data) {
    client.emit('web-client-receive', {
      action: 'UPDATE SINGLE',
      result: data
    })
  }
}

const sendDeviceUpdate = async (client: Socket) => {
  const data = await getAllStb()
  console.log('SEND STB DATA')
  client.emit('web-client-receive', {
    action: 'UPDATE',
    result: data.docs
  })
}

let intervalID: SetIntervalAsyncTimer = null

export const periodicFetch = () => {
  getConfigValue('refreshInterval', '2')
      .then(async (value: string) => {
        await stopPeriodicFetch()
        intervalID = setIntervalAsync(async () => {

          const maxRun = 15
          const promises = []

          const data = await getAllStb()
          if (data && data.docs && data.docs.length > 0) {
            for (const {ip, _id, ...etc} of data.docs) {
              promises.push(fetchSingleStb({ ip, minimum: false })
                  .then(result => {
                    if (result) {
                      result._id = _id
                      try {
                        emit('UPDATE SINGLE', result)
                      } catch (e) {
                        console.log(e)
                      }
                    }
                  }))
              if (promises.length >= maxRun) {
                console.log(`UPDATE ${promises.length}`)
                await Promise.all(promises)
                promises.splice(0, promises.length)
              }
            }
            console.log(`UPDATE ${promises.length}`)
            await Promise.all(promises)
          }

        }, parseInt(value) * 1000)
      })
}

export const stopPeriodicFetch = async () => {
  if (intervalID) {
    await clearIntervalAsync(intervalID)
  }
}

export default sendDeviceUpdate
