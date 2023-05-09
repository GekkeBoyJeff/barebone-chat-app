import { usersOnline } from '../helpers/onlineUsers.js';

const handleConnection = (socket) => {
    socket.on('connect', () => {
      console.log('a user connected');
      console.log('server socket.id', socket.id);
    })
    socket.on('setUsername', (username) => {
      usersOnline.set(socket.id, username);
    });
};

export default handleConnection;
