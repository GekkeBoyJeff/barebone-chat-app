import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const fetchCommand = async (args, socket, usersOnline, room, rooms, saveChatHistory) => {
  const [username, platform] = args.split(' ');

  const filepath = path.resolve('data.json');
  let fileData = fs.existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath)) : [];

  const existingData = fileData.find(player => player.name === username && player.platform === platform);

  if (existingData) {
    socket.emit('message', { user: 'Server', text: `Data for ${username} on ${platform} already exists.` });
  } else {
    try {
      const response = await fetch(`https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${username}&auth=${process.env.apexKey}`);
      const data = await response.json();

      if (data.Error) {
        socket.emit('message', { user: 'Server', text: `Error: ${data.Error}` });
      } else {
        fileData.push(data);
        fs.writeFileSync(filepath, JSON.stringify(fileData));
        socket.to(room).emit('message', { user: 'Server', text: `Data for ${username} on ${platform} has been fetched successfully!` });
        // socket.emit('message', { user: 'Server', text: `Data for ${username} on ${platform} has been fetched successfully!` });
      }
    } catch (error) {
      socket.emit('message', { user: 'Server', text: `Error: ${error.message}` });
    }
  }

  const serverMessage = { user: 'Server', text: `Data for ${username} on ${platform} has been fetched successfully!` };
  socket.emit('message', serverMessage);
  rooms.get(room).push(serverMessage);
  saveChatHistory(room);

};



export default fetchCommand;
