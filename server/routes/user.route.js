import express from "express"
import { initializeApp } from "firebase/app";
import fconfig from "../firebase/firebaseConfig.js"
import multer from "multer"
import {signupUser, uploadDoc} from "../controllers/user.controller.js"
import {digitallyVerify} from "../middlewares/digitallyVerify.js"

initializeApp(fconfig);
const uploadFileMulter = multer({ storage: multer.memoryStorage() })

const route = express.Router();

route.post("/create-user", signupUser);
// route.post("/upload-doc", digitallyVerify);
route.post("/upload-doc",uploadFileMulter.single('file'), uploadDoc);

export default route;