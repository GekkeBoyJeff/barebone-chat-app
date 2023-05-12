export default function(args, socket, usersOnline, room, rooms, saveChatHistory) {
  const serverMessages = [
    { user: 'Server', text: `Je hebt een aantal commands, Namelijk:` },
    { user: 'Server', text: `/help - Laat dit bericht zien.` },
    { user: 'Server', text: `/online - Laat zien wie er online zijn.` },
    { user: 'Server', text: `/apex <username> <platform> om je Apex Legends gebruikersnaam en platform vast te zetten. (gebruik incoordination en PC als test of bermuda_elite met PC). Let op, dit is wel hoofdletter gevoelig. Er zit een ratelimit 2 keer per minuut op.` },
    { user: 'server', text: `/rank kan je gebruiken om ten aller tijden je rank te bekijken die lokaal is opgeslagen.` }
  ];

  serverMessages.forEach(message => {
    socket.emit('message', message);
    socket.to(room).emit('message', message);
    
    if (rooms.has(room)) {
      rooms.get(room).push(message);
      saveChatHistory(room);
    }
  });
};
