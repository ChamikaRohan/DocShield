const ROOM_NAMES = ['abc@gmail.com', 'xyz@gmail.com'];

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`User:${socket.id} is connected to the socket.io server!`);

        socket.on('joinRoom', (roomId) => {
            if (ROOM_NAMES.includes(roomId)) {
                socket.join(roomId);
                console.log(`User:${socket.id} joined room:${roomId}`);
                io.to(roomId).emit('message', `User:${socket.id} has joined the room`);
            } else {
                socket.emit('error', 'Invalid room ID');
            }
        });

        socket.on('message', (message, roomId) => {
            if (ROOM_NAMES.includes(roomId)) {
                console.log(`Received message from ${socket.id} in room ${roomId}: ${message}`);
                io.to(roomId).emit('message', message);
            } else {
                socket.emit('error', 'Invalid room ID');
            }
        });

        socket.on('file', (fileData, roomId) => {
            if (ROOM_NAMES.includes(roomId)) {
                console.log(`Received file from ${socket.id} in room ${roomId}:`, fileData);

                socket.emit('fileStatus', { success: true, message: 'File received and processed successfully.' });
            } else {
                socket.emit('error', 'Invalid room ID');
            }
        });

        socket.on('disconnect', () => {
            console.log(`User: ${socket.id} has disconnected`);
        });
    });
};

export default socketHandler;
