import { usersOnline } from '../helpers/onlineUsers.js';

// Deze functie handelt de gebeurtenissen af die optreden wanneer een gebruiker de verbinding verbreekt
const handleDisconnect = (socket) => {
  socket.on('disconnect', () => {
    let disconnectedUser = usersOnline.get(socket.id);
    usersOnline.delete(socket.id);
    console.log(`Gebruiker ${disconnectedUser} losgekoppeld. Resterende gebruikers: ${Array.from(usersOnline.entries())}`);
  });
};

export default handleDisconnect;
