import 'dotenv/config'
import express from 'express';
import { createServer } from 'http';
import {Server, Socket} from 'socket.io';
import sendDeviceUpdate, {periodicFetch} from "./actions/device-update.js";
import actions from './actions/web-client-router'
import {loadConfig} from "./actions/config-actions";
import * as path from "path";

//Error handler
process.on('uncaughtException', (exception) => {
  // handle or ignore error
  console.error(exception);
});

const app = express()
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

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
    periodicFetch()
  })

  socket.on('web-client-send', actions(socket))

});

httpServer.listen(80);
periodicFetch()
// console.log('RUN ON http://localhost:3000')
