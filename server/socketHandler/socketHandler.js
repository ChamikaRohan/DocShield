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

        socket.on('file', async (fileBundle, roomId) => {
            if (ROOM_NAMES.includes(roomId)) {
                console.log(`Received file from ${socket.id} in room ${roomId}`);
        
                const { pdfData, publicKeyData, signatureData, name } = fileBundle;
        
                const formData = new FormData();
        
                // Append the PDF file data to the form
                formData.append('file', new Blob([pdfData]), name);
        
                // Append the public key and signature data to the form
                formData.append('publicKeyData', publicKeyData);
                formData.append('signatureData', signatureData);
        
                try {
                    // Send the file and secret data to the server for verification
                    const response = await fetch("http://localhost:8080/api/user/verify-upload-doc", {
                        method: 'POST',
                        body: formData,
                    });
        
                    // Check if the response is OK
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
        
                    // Process the server's response
                    const data2 = await response.json();
                    console.log(data2);
        
                    // Emit status to the client
                    socket.emit('fileStatus', { success: true, message: 'File and secret data received successfully.' });
                } catch (error) {
                    console.error('Error uploading file and secret data:', error);
        
                    // Emit error status to the client
                    socket.emit('fileStatus', { success: false, message: 'Error uploading file and secret data.' });
                }
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
