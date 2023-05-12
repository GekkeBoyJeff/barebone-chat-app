import fs from 'fs';
import path from 'path';

const rankCommand = (args, socket) => {
  const filepath = path.resolve('data.json');

  if (!fs.existsSync(filepath)) {
    socket.emit('message', { user: 'Server', text: `No data has been fetched yet.` });
    return;
  }

  const fileData = JSON.parse(fs.readFileSync(filepath));

  fileData.forEach(player => {
    // Zorg ervoor dat u de juiste pad naar de rang in uw API data gebruikt
    const rank = player.global.rank.rankName;
    const name = player.global.name;
    socket.emit('message', { user: 'Server', text: `The rank of ${name} is ${rank}.` });
  });
};

export default rankCommand;
