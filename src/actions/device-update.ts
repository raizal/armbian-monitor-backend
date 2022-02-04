import { getAllStb } from "../repository/stb";
import {fetchSingleStb} from "../utils/get-stb-non-blocking.js";
import {Server, Socket} from "socket.io";
import stbDb from "../db";

const sendDeviceUpdate = async (client: Socket) => {
  const data = await getAllStb()
  console.log('SEND STB DATA')
  client.emit('web-client-receive', {
    action: 'UPDATE',
    result: data.docs
  })
}

let intervalID: NodeJS.Timer = null

export const periodicFetch = (io: Server) => {
  if (intervalID) {
    clearInterval(intervalID)
  }
  intervalID = setInterval(async () => {
    const data = await getAllStb()
    if (data && data.docs && data.docs.length > 0) {
      for (const {ip, _id} of data.docs) {
        fetchSingleStb({ ip, minimum: true })
          .then(result => {
            if (result) {
              result._id = _id

              stbDb.get(_id)
                  .then(fromDb => {
                    stbDb.put({
                      ...fromDb,
                      ...result
                    })
                  })
                  .catch(e => {
                    console.log(e.status)
                  })

              try {
                io.sockets.emit('web-client-receive', {
                  action: 'UPDATE SINGLE',
                  result
                })
              } catch (e) {
                console.log(e)
              }
            }
          })
      }
    }
  }, 1200)
}

export const stopPeriodicFetch = () => {
  clearInterval(intervalID)
}

export default sendDeviceUpdate
