import dotenv from 'dotenv';
import {getAllUserEmails} from "../controllers/user.controller.js"
dotenv.config();

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`User:${socket.id} is connected to the socket.io server!`);

        socket.on('joinRoom', async (roomId) => {

            const emailList = await getAllUserEmails();

            if (emailList.includes(roomId)) {
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
                console.log(`Received file from ${socket.id} in room ${roomId}`);
        
                const { pdfData, publicKeyData, signatureData, name, email } = fileBundle;
        
                const formData = new FormData();
        
                // Append the PDF file data to the form
                formData.append('file', new Blob([pdfData]), name);
        
                // Append the public key and signature data to the form
                formData.append('publicKeyData', publicKeyData);
                formData.append('signatureData', signatureData);
                formData.append('email', email);
        
                try {
                    // Send the file and secret data to the server for verification
                    const response = await fetch(`${process.env.SERVER_URL}/api/user/verify-update-doc`, {
                        method: 'POST',
                        body: formData,
                    });
        
                    // Check if the response is OK
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
        
                    // Process the server's response
                    const data = await response.json();
                    console.log(data);
                    console.log(roomId);
        
                    // Emit status to the client
                    socket.emit('fileStatus', { success: true, message: 'File and secret data received successfully.' });
                } catch (error) {
                    console.error('Error uploading file and secret data:', error);
        
                    // Emit error status to the client
                    socket.emit('fileStatus', { success: false, message: 'Error uploading file and secret data.' });
                }
        });
        

        socket.on('disconnect', () => {
            console.log(`User: ${socket.id} has disconnected`);
        });
    });
};

export default socketHandler;
