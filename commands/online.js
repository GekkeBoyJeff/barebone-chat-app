export default function(args, socket, usersOnline, room, rooms, saveChatHistory) {
  const usernames = Array.from(usersOnline.values()).join(', ');
  const serverMessage = { user: 'Server', text: `Online users: ${usernames}` };
  socket.emit('message', serverMessage);
  rooms.get(room).push(serverMessage);
  saveChatHistory(room);
};
