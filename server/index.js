import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import mongoose from "mongoose";
import socketHandler from './socketHandler/socketHandler.js';  
import documentRoute from "./routes/document.route.js"

dotenv.config();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

mongoose.connect(DB_URL)
    .then(()=>{console.log("Database connected successfully!");})
    .catch((error)=>{console.log("Database connected failed! \n",error.message);})

app.use("/api", documentRoute);