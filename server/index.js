import express from "express"
import dotenv from "dotenv";
import {Server} from "socket.io"
import http from "http"

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket)=>{
    console.log("A user is connected!");
});

server.listen(PORT, ()=>{
    return console.log(`Listening from port: ${PORT}`)
})