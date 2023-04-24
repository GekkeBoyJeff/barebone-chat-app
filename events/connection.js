const handleConnection = (socket) => {
    console.log('a user connected');
    console.log('server socket.id', socket.id);
    // addMessage(socket, 'Welcome to the chat!');
  };
  
  export default handleConnection;
  