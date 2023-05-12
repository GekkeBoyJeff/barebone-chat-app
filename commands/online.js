export default function(args, socket, usersOnline, room, rooms, saveChatHistory) {
  const usernames = Array.from(usersOnline.values()).join(', ');
  const serverMessage = { user: 'Server', text: `Online users: ${usernames}` };
  socket.emit('message', serverMessage);
  socket.to(room).emit('message', serverMessage);

  // Add the message to the room's chat history
  if (rooms.has(room)) {
    rooms.get(room).push(serverMessage);
    saveChatHistory(room);
  }
};
