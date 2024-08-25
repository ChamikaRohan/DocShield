import express from "express"
import {digitallyVerify} from "../middlewares/digitallyVerify.js"

const route = express.Router();

route.post("/upload-doc", digitallyVerify);

export default route;