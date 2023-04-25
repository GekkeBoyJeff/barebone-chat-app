import express from 'express';
import httpModule from 'http';
import { Server } from 'socket.io';
import path from 'path';

import handleConnection from './events/connection.js';
import handleDisconnect from './events/disconnect.js';
// import handleMessage from './events/message.js';
import handleRooms from './events/rooms.js';

import dotenv from "dotenv"
dotenv.config()

const app = express();
const http = httpModule.createServer(app);
const io = new Server(http, {
  connectionStateRecovery: {
    // https://socket.io/docs/v4/connection-state-recovery
    enabled: true,
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  } 
});
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve('public')));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.render('index');
});

io.on('connection', (socket) => {
  handleConnection(socket);
  handleDisconnect(socket);
  // handleMessage(socket, io);
  handleRooms(socket, io)
});

http.listen(port, () => {
  console.log(`listening on localhost:${port}`);
});
