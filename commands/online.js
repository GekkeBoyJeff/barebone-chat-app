export default function(usersOnline, socket) {
    const usernames = Array.from(usersOnline.values()).join(', ');
    socket.emit('message', { user: 'Server', text: `Online users: ${usernames}` });
  };
  