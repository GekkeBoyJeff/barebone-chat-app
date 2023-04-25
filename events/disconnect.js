const handleDisconnect = (socket) => {
    socket.on('disconnect', () => {
      console.log('user disconnected :D');
    });
  };
  
  export default handleDisconnect;
  