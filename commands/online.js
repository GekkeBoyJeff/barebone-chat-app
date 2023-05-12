export default function(args, socket, usersOnline) {
  const usernames = Array.from(usersOnline.values()).join(', ');
  socket.emit('message', { user: 'Server', text: `Online users: ${usernames}` });
};
