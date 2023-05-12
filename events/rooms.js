// Importeer de benodigde modules
import { fileURLToPath } from 'url';
import path from 'path';
import { usersOnline } from '../helpers/onlineUsers.js';

// Maak een nieuwe Map voor alle chatrooms
const rooms = new Map();

// Definieer een functie om de chatrooms te beheren
const handleRooms = (socket, io) => {
  let currentRoom; // Houd bij in welke chatroom de gebruiker momenteel is

  // Luister naar het 'joinRoom' event wanneer een gebruiker een chatroom betreedt
  socket.on('joinRoom', ({ room, welcomeMessage, user }) => {
    if (currentRoom) {
      socket.leave(currentRoom); // Verlaat de huidige chatroom
    }
    currentRoom = room;
    socket.join(room); // Voeg de gebruiker toe aan de nieuwe chatroom
    if (!rooms.has(room)) {
      rooms.set(room, []); // Voeg de chatroom toe aan de lijst van chatrooms als deze nog niet bestaat
    }
    socket.emit('loadMessages', rooms.get(room)); // Laad alle berichten in de chatroom van de gebruiker
    if (welcomeMessage) {
      const welcomeText = `Welcome to the chat! ${user}`;
      io.to(room).emit('message', { user: 'Server', text: welcomeText }); // Stuur een welkomstbericht naar de chatroom
    }
    io.emit('roomList', Array.from(rooms.keys())); // Stuur een lijst van alle chatrooms naar alle gebruikers
  });

// Luister naar het 'message' event wanneer een gebruiker een bericht stuurt
socket.on('message', async (message) => {
  if (!currentRoom) return; // Als er geen chatroom is, doe niets
  rooms.get(currentRoom).push(message); // Voeg het bericht toe aan de lijst met berichten in de huidige chatroom
  io.to(currentRoom).emit('message', message); // Stuur het bericht naar alle gebruikers in de chatroom

  if (message.text.trim().startsWith('/')) { // Als het bericht begint met een '/', verwerk het als een commando
    const commandText = message.text.trim().slice(1); // Haal het gedeelte na '/' op (commando en argumenten)
    const [command, ...args] = commandText.split(' '); // Split het gedeelte op in commando en argumenten

    const commandPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../commands', `${command}.js`); // Bepaal het pad naar het bestand met het commando

    try {
      const commandModule = await import(`file://${commandPath}`); // Importeer het commando

      if (typeof commandModule.default === 'function') {
        // Voer het commando uit en geef de huidige socket en usersOnline mee
        commandModule.default(args.join(' '), socket, usersOnline);
      } else {
        console.error(`Invalid command module: ${command}`);
      }
    } catch (err) {
      // Als het bestand niet bestaat, doe niets
      if (err.code !== 'ENOENT') {
        console.error(err);
      }
    }
  }
});

  // Luister naar het 'leaveRoom' event wanneer een gebruiker een chatroom verlaat
  socket.on('leaveRoom', () => {
    socket.leave(currentRoom); // Verlaat de huidige chatroom
    currentRoom = null; // Reset de huidige chatroom
  });
};

// Exporteer de functie
export default handleRooms;
