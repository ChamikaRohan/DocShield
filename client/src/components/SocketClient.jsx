import React, { useState } from 'react';
import { io } from 'socket.io-client';

export default function SocketClient() {
  const [socket, setSocket] = useState(null);

  const connectSocket = () => {
    if (!socket) {
      const newSocket = io('http://localhost:8080');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to the server!');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from the server.');
      });
    }
  };

  return (
    <div className="App">
      <h1>Socket.IO Client</h1>
      <button onClick={connectSocket}>Connect to Socket.IO Server</button>
    </div>
  );
}
