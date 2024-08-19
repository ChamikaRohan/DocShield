import express from "express"
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    return console.log(`Listening from port: ${PORT}`)
})