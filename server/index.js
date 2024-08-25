import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import socketHandler from './socketHandler/socketHandler.js';  

dotenv.config();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

const PORT = process.env.PORT || 3000;

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
