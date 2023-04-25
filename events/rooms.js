const rooms = new Map();

const handleRooms = (socket, io) => {
  let currentRoom;

  socket.on('joinRoom', ({ room, welcomeMessage, user }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
    }
    currentRoom = room;
    socket.join(room);
    if (!rooms.has(room)) {
      rooms.set(room, []);
    }
    socket.emit('loadMessages', rooms.get(room));
    if (welcomeMessage) {
        const welcomeText = `Welcome to the chat! ${user}`;
        io.to(room).emit('message', { user: 'Server', text: welcomeText });
      }
  
      io.emit('roomList', Array.from(rooms.keys()));
  });

  // Verplaats deze event listeners naar buiten de 'joinRoom' event listener
  socket.on('message', (message) => {
    if (!currentRoom) return;
    rooms.get(currentRoom).push(message);
    io.to(currentRoom).emit('message', message);
  });

  socket.on('leaveRoom', () => {
    socket.leave(currentRoom);
    currentRoom = null;
  });
};

export default handleRooms;
