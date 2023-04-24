const handleConnection = (socket) => {
    socket.on('connect', () => {
      console.log('a user connected');
      console.log('server socket.id', socket.id);
    })
  };
  
  export default handleConnection;
  