// Een functie die online gebruikers en een socket object als parameters accepteert
export default function(usersOnline, socket) {
    // Array.from() wordt gebruikt om de gebruikersnamen te verkrijgen als een array, join() combineert deze tot één string
    const usernames = Array.from(usersOnline.values()).join(', ');
    
    // De socket verstuurt een bericht naar de client met de gebruikersnaamstring als een deel van de tekst
    socket.emit('message', { user: 'Server', text: `Online users: ${usernames}` });
  };
  