import { usersOnline } from '../helpers/onlineUsers.js';

const handleDisconnect = (socket) => {
  socket.on('disconnect', () => {
    let disconnectedUser = usersOnline.get(socket.id);
    usersOnline.delete(socket.id);
    console.log(`User ${disconnectedUser} disconnected. Remaining users: ${Array.from(usersOnline.entries())}`);
  });
};

export default handleDisconnect;
