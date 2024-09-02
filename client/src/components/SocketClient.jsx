import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import digitallySign from '../digitallySign/digitallySign.js';

export default function SocketClient() {
    const serverURL = import.meta.env.VITE_SERVER_BASE_URL;

    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [publicKeyPemData, setPublicKeyPemData] = useState(null);
    const [signatureBase64Data, setSignatureBase64Data] = useState(null);
    const [fileStatus, setFileStatus] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Please select a valid PDF file.');
        }
    };

    const handleSign = async () => {
        if (selectedFile) {
            try {
                const { publicKeyPem, signatureBase64 } = await digitallySign(selectedFile);
            
                // Set state or use the values as needed
                setPublicKeyPemData(publicKeyPem);
                setSignatureBase64Data(signatureBase64);
                
                // const jsonString = JSON.stringify(secretSignatureData, null, 2); // Convert to a pretty JSON string
                // const blob = new Blob([jsonString], { type: 'application/json' });
                // const url = URL.createObjectURL(blob);
                // const a = document.createElement('a');
                // a.href = url;
                // a.download = 'signatureData.json';
                // a.click();
                // URL.revokeObjectURL(url); // Clean up the URL object
    
            } catch (error) {
                console.error('Error signing file:', error);
            }
        } else {
            alert('Please select a PDF file to sign.');
        }
    };

    useEffect(() => {
        const socketIo = io(serverURL, { transports: ['websocket'] });
        setSocket(socketIo);

        socketIo.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socketIo.on('fileStatus', (status) => {
            if (status.success) {
                setFileStatus(status.message); 
            } else {
                setFileStatus('File processing failed.');
            }
        });

        socketIo.on('error', (errorMessage) => {
            setError(errorMessage);
        });

        return () => {
            socketIo.disconnect();
        };
    }, [serverURL]);

    const joinRoom = () => {
        if (socket) {
            socket.emit('joinRoom', roomId);
        }
    };

    const sendMessage = () => {
        if (socket && message.trim() && roomId.trim()) {
            socket.emit('message', message, roomId);
            setMessage('');
        }
    };

    const sendFile = () => {
        if (!roomId.trim()) {
            alert('Please join a room first.');
            return;
        }
    
        if (!selectedFile) {
            alert('Please select a PDF file to upload.');
            return;
        }
    
        if (socket) {
            const reader = new FileReader();
        
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
                
                // Create a bundle of the original PDF file and the secret data
                const fileBundle = {
                    pdfData: arrayBuffer,   // Original PDF file data
                    publicKeyData: publicKeyPemData, 
                    signatureData: signatureBase64Data,
                    name: selectedFile.name, // Name of the original PDF file
                    email: roomId
                };
    
                // Emit the fileBundle through the socket
                socket.emit('file', fileBundle, roomId);
            };
        
            // Read the selected file as an ArrayBuffer
            reader.readAsArrayBuffer(selectedFile);
        } else {
            alert('Socket connection not established.');
        }
    };
    

    return (
        <div>
            <h1>Chat App</h1>
            <input
                type="text"
                placeholder="Enter room ID (ABC or XYZ)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
            />
            <button onClick={handleSign}>Sign Digitally</button>
            <button onClick={sendFile}>Upload file</button>
            <div id="messages">
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            {error && <div id="error" style={{ color: 'red' }}>{error}</div>}
            {fileStatus && <div id="file-status">{fileStatus}</div>}
        </div>
    );
}
