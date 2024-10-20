import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import socketHandler from './socketHandler/socketHandler.js';  
import userRoute from "./routes/user.route.js"
import cookieParser from 'cookie-parser';

dotenv.config();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions)); 
app.use(bodyParser.json());

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
    .catch((error)=>{console.log("Database connected failed!\n",error.message);})

app.use("/api/user", userRoute);