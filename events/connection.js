import { usersOnline } from '../helpers/onlineUsers.js';

// Deze functie handelt de gebeurtenissen af die optreden wanneer een gebruiker verbinding maakt
const handleConnection = (socket) => {
    socket.on('connect', () => {
      console.log('Een gebruiker verbonden');
      console.log('server socket.id', socket.id);
    })
    socket.on('setUsername', (username) => {
      // Voeg de gebruiker toe aan de lijst van online gebruikers
      usersOnline.set(socket.id, username);
    });
};

export default handleConnection;