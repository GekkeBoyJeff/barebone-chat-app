import fs from 'fs';
import path from 'path';

const rankCommand = (args, socket, usersOnline, room, rooms, saveChatHistory) => {
  const filepath = path.resolve('data.json');

  if (!fs.existsSync(filepath)) {
    socket.emit('message', { user: 'Server', text: `No data has been fetched yet.` });
    return;
  }

  const fileData = JSON.parse(fs.readFileSync(filepath));

  fileData.map(player => {
    const rank = player.global.rank.rankName;
    const name = player.global.name;
    const serverMessage = { user: 'Server', text: `The rank of ${name} is ${rank}.` };
    socket.emit('message', serverMessage);
    socket.to(room).emit('message', serverMessage);
    rooms.get(room).push(serverMessage);
    saveChatHistory(room);
  });
};

export default rankCommand;
