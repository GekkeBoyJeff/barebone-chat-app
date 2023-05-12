// Importeer de benodigde modules
import { fileURLToPath } from 'url';
import path from 'path';
import { usersOnline } from '../helpers/onlineUsers.js';
import fs from 'fs';


// Maak een nieuwe Map voor alle chatrooms
const rooms = new Map();

// Lees de bestanden in de berichtenmap
const messagesDirPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../messages');
const files = fs.readdirSync(messagesDirPath);

// Voeg elke kamer toe aan de kaart
for (const file of files) {
  if (file.endsWith('.json')) {
    const roomName = file.slice(0, -5); // Verwijder de .json extensie
    const jsonFilePath = path.join(messagesDirPath, file);
    const chatHistory = fs.readFileSync(jsonFilePath, 'utf-8');
    rooms.set(roomName, JSON.parse(chatHistory));
  }
}

// Definieer een functie om de chatrooms te beheren
const handleRooms = (socket, io) => {
  let currentRoom; // Houd bij in welke chatroom de gebruiker momenteel is

  // Luister naar het 'joinRoom' event wanneer een gebruiker een chatroom betreedt
  socket.on('joinRoom', ({ room, welcomeMessage, user }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
    }
    currentRoom = room;
    socket.join(room);
  
    if (!rooms.has(room)) {
      const jsonFilePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../messages', `${room}.json`);
      if (fs.existsSync(jsonFilePath)) {
        const chatHistory = fs.readFileSync(jsonFilePath, 'utf-8');
        rooms.set(room, JSON.parse(chatHistory));
      } else {
        rooms.set(room, []);
      }
    }
  
    socket.emit('loadMessages', rooms.get(room));
  
    if (welcomeMessage) {
      const welcomeText = `Welcome to the chat! ${user}`;
      io.to(room).emit('message', { user: 'Server', text: welcomeText });
      
      // Voeg het welkomstbericht toe aan de kamer geschiedenis
      rooms.get(room).push({ user: 'Server', text: welcomeText });
      saveChatHistory(room);
    }
  
    io.emit('roomList', Array.from(rooms.keys()));
  });

// Luister naar het 'message' event wanneer een gebruiker een bericht stuurt
socket.on('message', async (message) => {
  if (!currentRoom) return; // Als er geen chatroom is, doe niets
  rooms.get(currentRoom).push(message); // Voeg het bericht toe aan de lijst met berichten in de huidige chatroom
  io.to(currentRoom).emit('message', message); // Stuur het bericht naar alle gebruikers in de chatroom

  saveChatHistory(currentRoom);

  if (message.text.trim().startsWith('/')) { // Als het bericht begint met een '/', verwerk het als een commando
    const commandText = message.text.trim().slice(1); // Haal het gedeelte na '/' op (commando en argumenten)
    const [command, ...args] = commandText.split(' '); // Split het gedeelte op in commando en argumenten

    const commandPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../commands', `${command}.js`); // Bepaal het pad naar het bestand met het commando

    try {
      const commandModule = await import(`file://${commandPath}`); // Importeer het commando

      if (typeof commandModule.default === 'function') {
        // Voer het commando uit en geef de huidige socket en usersOnline mee
        commandModule.default(args.join(' '), socket, usersOnline, currentRoom, rooms, saveChatHistory);
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
const saveChatHistory = (room) => {
  const messages = rooms.get(room);
  const jsonFilePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../messages', `${room}.json`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(messages));
};
  // Luister naar het 'leaveRoom' event wanneer een gebruiker een chatroom verlaat
  socket.on('leaveRoom', () => {
    socket.leave(currentRoom); // Verlaat de huidige chatroom
    currentRoom = null; // Reset de huidige chatroom
  });
};

// Exporteer de functie
export default handleRooms;
