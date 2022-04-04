import 'dotenv/config'
import express from 'express';
import { createServer } from 'http';
import {Server, Socket} from 'socket.io';
import sendDeviceUpdate, {initializeQueue} from "./actions/device-update.js";
import actions from './actions/web-client-router'
import {loadConfig} from "./actions/config-actions";
import * as path from "path";
import {resume} from "./repository/updates-queue";
import connect from "./utils/connect";
import run from "./utils/run";
import getMinerScript from "./utils/get-miner-script";
import {CustomNodeSSH} from "./utils/CustomNodeSSH";
import FileLoggingHandler from "./utils/FileLoggingHandler";

CustomNodeSSH.log = FileLoggingHandler

const port = process.env.SERVER_PORT || 80

//Error handler
process.on('uncaughtException', (exception) => {
  // handle or ignore error
  console.error(exception);
  resume()
});

const app = express()
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

app.use(express.static(path.join(__dirname, '../client')));
app.get('/', (get, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
})

app.get('/settings', (get, res) => {
  res.redirect('/')
})

io.on("connection", (socket: Socket) => {

  socket.on("error", (err) => {})

  socket.on('web-client-register', async () => {
    const client = socket
    console.log("Web Client Connected : ", client.id)
    loadConfig(client)
    await sendDeviceUpdate(client)
  })

  socket.on('web-client-send', actions(socket))

});

httpServer.listen(port);
initializeQueue()
//
// const playground = async () => {
//   const ssh = await connect('192.168.1.212')
//   console.log('192.168.1.201 : ', ssh.isConnected() && 'connected DONG!!!')
//   console.log(await run(ssh, 'cat /etc/hostname'))
// }
// playground()
// console.log('RUN ON http://localhost:3000')
