// io rooms
// https://socket.io/docs/v4/rooms

const handleRooms = (socket, io) => {
    socket.on('join-room', (room) => {
        socket.join(room);
        io.to(room).emit('user-connected', socket.id);
    });
};

export default handleRooms;