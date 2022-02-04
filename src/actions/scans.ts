import get from "lodash/get.js";
import fetchStb from "../utils/get-stb-non-blocking.js";
import stbDb from "../db/index.js";
import {Socket} from "socket.io";

export default (client: Socket, action: string, payload: string[]) => {
  const subnets = get(payload, 'subnets', [])
  const promises: Promise<void>[] = []

  client.emit('web-client-receive', {
    action: 'SCANNING'
  })

  // in case more than 1 subnet, make it processed one by one
  subnets.forEach((subnet: string) => {
    promises.push(new Promise( (resolve) => {
      console.log('finding stb')
      fetchStb({
        segments: subnet,
        onFound: data => {
          stbDb.get(data.name)
              .then(result => {
                stbDb.put({
                  ...result,
                  ...data
                })
              })
              .catch(e => {
                console.log(e.status)
                if (e.status === 404) {
                  stbDb.put({
                    ...data,
                    _id: data.name
                  })
                }
              })

          client.emit('web-client-receive', {
            action: 'UPDATE SINGLE',
            result: data
          })
        }
      }).then(() => resolve())
    }))
  })

  Promise.all(promises)
    .finally(() => {
      console.log('finding stb done')
      client.emit('web-client-receive', {
        action: 'SCAN-DONE'
      })
    })

}