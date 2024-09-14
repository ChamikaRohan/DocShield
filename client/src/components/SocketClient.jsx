import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import digitallySign from '../security/digitallySign.js';
import encrypt from '../security/encrypt.js';
import { retriveUserID } from '../middlewares/RetriveUserID.js';

export default function SocketClient() {
    const serverURL = import.meta.env.VITE_SERVER_BASE_URL;

    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [docName, setDocName] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [privateKeyPem, setPrivateKeyPem] =  useState('');
    const [signatureBase64Data, setSignatureBase64Data] = useState(null);
    const [fileStatus, setFileStatus] = useState('');
    const [senderEmail, setSenderEmail] = useState(null);
    const [recieversPublicKey, setRecieversPublicKey] = useState(''); 
    const [encryptedFile, setEncryptedFile] = useState(null);

    useEffect(() => {
        const checkUserAuth = async () => {
            try {
                const response = await retriveUserID();
                if (response.user) {
                    setSenderEmail(response.email);
                } else {
                    setError('Unauthorized or Invalid token');
                }
            } catch (err) {
                setError('An error occurred while checking the auth status.');
            }
        };

        checkUserAuth();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Please select a valid PDF file.');
        }
    };

    const handleSignAndEncrpt = async () => {
        if (selectedFile) {
            try {
                const signatureBase64 = await digitallySign(selectedFile, privateKeyPem);
                setSignatureBase64Data(signatureBase64);

                const encryptedFile = await encrypt(selectedFile, signatureBase64, recieversPublicKey);
                setEncryptedFile(encryptedFile);

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

        // Listen for publicKey along with message when joining the room
        socketIo.on('message', (msg) => {
            if (msg.publicKey) {
                setRecieversPublicKey(msg.publicKey); // Set receiver's public key
            }
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

    const sendFile = async () => {
        if (!roomId.trim()) {
            alert('Please join a room first!');
            return;
        }

        if (!selectedFile) {
            alert('Please select a PDF file to upload!');
            return;
        }

        if (socket) {
            await handleSignAndEncrpt(); 
        } else {
            alert('Socket connection not established.');
        }
    };

    useEffect(() => {
        if (encryptedFile && roomId && socket) {
            const fileBundle = {
                encryptedFile: encryptedFile,
                signatureData: signatureBase64Data,
                name: docName,
                email: roomId,
                sender: senderEmail,
            };
    
            socket.emit('file', fileBundle, roomId);
        }
    }, [encryptedFile, roomId, socket]);
    
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
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter private key..."
                value={privateKeyPem}
                onChange={(e) => setPrivateKeyPem(e.target.value)}
            />
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
            />
            <button onClick={sendFile}>Send file</button>
            <div id="messages">
            {messages.map((msg, index) => (
                <p key={index}>{typeof msg === 'object' ? JSON.stringify(msg.message) : msg}</p>
            ))}
            </div>

            {error && <div id="error" style={{ color: 'red' }}>{error}</div>}
            {fileStatus && <div id="file-status">{fileStatus}</div>}
            {recieversPublicKey && (
                <div>
                    <h4>Receiver's Public Key:</h4>
                    <p>{typeof recieversPublicKey === 'object' ? JSON.stringify(recieversPublicKey) : recieversPublicKey}</p>
                </div>
            )}

        </div>
    );
}
