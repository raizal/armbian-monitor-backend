import express from 'express';
import { createServer } from 'http';
import {Server, Socket} from 'socket.io';
import {Client} from "socket.io/dist/client";
import {SocketId} from "socket.io-adapter";

import 'dotenv/config'

import sendDeviceUpdate, {periodicFetch} from "./actions/device-update.js";
import actions from './actions/web-client-router'
import {loadConfig} from "./actions/config-actions";

const connectedWebClient: Map<SocketId, Client<any, any, any>> = new Map<SocketId, Client<any, any, any>>()

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

app.get('/', (get, res) => {
  res.send('RUNNING 👍')
})

io.on("error", (err) => {
  console.log('ERROR ON SOCKET - SERVER : ', err)
})

io.on("connection", (socket: Socket) => {

  socket.on("error", (err) => {
    console.log(err)
  })

  socket.on('web-client-register', async () => {
    const client = socket
    console.log("Web Client Connected : ", client.id)
    connectedWebClient.set(client.id, client.client)
    loadConfig(client)
    await sendDeviceUpdate(client)
  })

  socket.on('web-client-send', actions(socket))

  socket.on("disconnect",function(){
    //delete all user data here
  })
});

httpServer.listen(3000);
periodicFetch(io)
console.log('RUN ON http://localhost:3000')
