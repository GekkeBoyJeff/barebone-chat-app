import express from 'express';
import httpModule from 'http';
import { Server } from 'socket.io';
import path from 'path';

import handleConnection from './events/connection.js';
import handleDisconnect from './events/disconnect.js';
import handleMessage from './events/message.js';

import dotenv from "dotenv"
dotenv.config()

const app = express();
const http = httpModule.createServer(app);
const io = new Server(http);
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve('public')));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.render('index');
});

io.on('connection', (socket) => {
  handleConnection(socket);
  handleDisconnect(socket);
  handleMessage(socket, io);
});

http.listen(port, () => {
  console.log(`listening on localhost:${port}`);
});
