import { usersOnline } from '../helpers/onlineUsers.js';

// Maak een lege Map aan om alle chatrooms bij te houden
const rooms = new Map();

// Dit is een functie die wordt aangeroepen wanneer een gebruiker een chatroom wil betreden, verlaten of een bericht wil sturen
const handleRooms = (socket, io) => {
  let currentRoom; // Houd bij welke chatroom de gebruiker momenteel is binnengegaan

  // Wanneer een gebruiker een chatroom wil betreden
  socket.on('joinRoom', ({ room, welcomeMessage, user }) => {
    // Verlaat de huidige chatroom als de gebruiker al in een andere chatroom zit
    if (currentRoom) {
      socket.leave(currentRoom);
    }
    // Ga de nieuwe chatroom binnen
    currentRoom = room;
    socket.join(room);
    // Als deze chatroom nog niet bestaat, maak dan een lege array aan om berichten bij te houden
    if (!rooms.has(room)) {
      rooms.set(room, []);
    }
    // Laad eerder verzonden berichten in de chatroom
    socket.emit('loadMessages', rooms.get(room));
    // Stuur een welkomstbericht als deze optie is geselecteerd
    if (welcomeMessage) {
      const welcomeText = `Welcome to the chat! ${user}`;
      io.to(room).emit('message', { user: 'Server', text: welcomeText });
    }
    // Stuur een bijgewerkte lijst met alle beschikbare chatrooms naar alle verbonden clients
    io.emit('roomList', Array.from(rooms.keys()));
  });

  // Wanneer een gebruiker een bericht wil sturen
  socket.on('message', async (message) => {
    // Als de gebruiker geen chatroom heeft betreden, doe dan niets
    if (!currentRoom) return;
    // Voeg het bericht toe aan de lijst met berichten van de huidige chatroom en stuur het naar alle gebruikers in die chatroom
    rooms.get(currentRoom).push(message);
    io.to(currentRoom).emit('message', message);

    if (message.text.trim().startsWith('/')) {
      const commandName = message.text.trim().slice(1);
      const commandPath = path.join(__dirname, 'commands', `${commandName}.js`);
  
      try {
        // Probeer het commando-bestand te lezen
        const commandFile = await fs.readFile(commandPath, 'utf8');
        // Voer het commando uit en geef de huidige socket en usersOnline mee
        (await import(commandPath)).default(usersOnline, socket);
      } catch (err) {
        // Als het bestand niet bestaat, doe niets
        if (err.code !== 'ENOENT') {
          console.error(err);
        }
      }
  
      return;
    }


  });

  // Wanneer een gebruiker een chatroom wil verlaten
  socket.on('leaveRoom', () => {
    // Verlaat de huidige chatroom en zet de huidige chatroom terug naar null
    socket.leave(currentRoom);
    currentRoom = null;
  });
};

export default handleRooms;
