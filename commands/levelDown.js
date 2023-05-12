import fs from 'fs';
import path from 'path';

const levelDownCommand = (username, socket, usersOnline, room, rooms, saveChatHistory) => {
  const filepath = path.resolve('data.json');

  if (!fs.existsSync(filepath)) {
    socket.emit('message', { user: 'Server', text: `No data has been fetched yet.` });
    return;
  }

  let fileData = JSON.parse(fs.readFileSync(filepath));
  let userToUpdate = fileData.find(player => player.global.name === username);

  if (userToUpdate) {
    userToUpdate.global.level -= 1;
    fs.writeFileSync(filepath, JSON.stringify(fileData));
    socket.emit('message', { user: 'Server', text: `The level of ${username} has been decreased to ${userToUpdate.global.level}` });
  } else {
    socket.emit('message', { user: 'Server', text: `User ${username} not found.` });
  }
};

export default levelDownCommand;
