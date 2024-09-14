import dotenv from 'dotenv';
import { getAllUserEmails } from "../controllers/user.controller.js"
dotenv.config();

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`User:${socket.id} is connected to the socket.io server!`);

        socket.on('joinRoom', async (roomId) => {
            try {
                const userList = await getAllUserEmails();
                const user = userList.find(user => user.email === roomId);

                if (user) {
                    socket.join(roomId);
                    console.log(`User:${socket.id} joined room:${roomId}`);

                    io.to(roomId).emit('message', {
                        message: `User:${socket.id} has joined the room`,
                        publicKey: user.public_key
                    });
                } else {
                    socket.emit('error', 'Invalid room ID');
                }
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', 'Internal server error!');
            }
        });

        socket.on('file', async (fileBundle, roomId) => {
                console.log(`Received file from ${socket.id} in room ${roomId}`);
        
                const { encryptedFile, signatureData, name, email, sender } = fileBundle;
        
                const formData = new FormData();
                formData.append('encryptedFile', encryptedFile);
                formData.append('signatureData', signatureData);
                formData.append('name', name);
                formData.append('email', email);
                formData.append('sender', sender);
        
                try {
                    const response = await fetch(`${process.env.SERVER_URL}/api/user/verify-update-doc`, {
                        method: 'POST',
                        body: formData,
                    });
        
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    console.log(data);
        
                    socket.emit('fileStatus', { success: true, message: 'File and secret data received successfully.' });
                } catch (error) {
                    console.error('Error uploading file and secret data:', error);
                    socket.emit('fileStatus', { success: false, message: 'Error uploading file and secret data.' });
                }
        });
        

        socket.on('disconnect', () => {
            console.log(`User: ${socket.id} has disconnected`);
        });
    });
};

export default socketHandler;
