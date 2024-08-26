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
    const [signedFile, setSignedFile] = useState(null);
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
                const signedBlob = await digitallySign(selectedFile, 'Chamika Rohan');
                setSignedFile(signedBlob);

                // Optionally trigger download
                // const url = URL.createObjectURL(signedBlob);
                // const a = document.createElement('a');
                // a.href = url;
                // a.download = 'signed_document.pdf';
                // document.body.appendChild(a);
                // a.click();
                // document.body.removeChild(a);
    
            } catch (error) {
                console.error('Error signing file:', error);
            }
        } else {
            alert('Please select a PDF file to sign.');
        }
    };

    const sendFile = () => {
        if (signedFile && socket) {
            console.log("sending...");
            const reader = new FileReader();
            
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
                console.log(arrayBuffer);
                socket.emit('file', { data: arrayBuffer, name: 'signed_document.pdf' }, roomId);
            };

            reader.readAsArrayBuffer(signedFile);
        } else {
            alert('Please sign a file and join a room first.');
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
