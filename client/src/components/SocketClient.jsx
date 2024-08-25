import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080'; // Change this to your server URL

export default function SocketClient() {
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const socketIo = io(SERVER_URL, { transports: ['websocket'] });
        setSocket(socketIo);

        socketIo.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socketIo.on('error', (errorMessage) => {
            setError(errorMessage);
        });

        return () => {
            socketIo.disconnect();
        };
    }, []);

    const joinRoom = () => {
            socket.emit('joinRoom', roomId);
    };

    const sendMessage = () => {
            socket.emit('message', message, roomId);
            setMessage('');
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
            <div id="messages">
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            {error && <div id="error" style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}
