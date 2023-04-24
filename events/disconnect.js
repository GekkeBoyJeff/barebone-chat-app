const handleDisconnect = (socket) => {
    socket.on('disconnect', () => {
      console.log('user disconnected :D');
      // socket.broadcast.emit("user_leave", this.username);
    });
  };
  
  export default handleDisconnect;
  