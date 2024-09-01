import express from "express"
import { initializeApp } from "firebase/app";
import fconfig from "../firebase/firebaseConfig.js"
import multer from "multer"
import {signupUser, uploadDocToFirebase, updateDocToMongo} from "../controllers/user.controller.js"
import digitallyVerify from "../middlewares/digitallyVerify.js"

initializeApp(fconfig);
const uploadFileMulter = multer({ storage: multer.memoryStorage() })

const route = express.Router();

route.get("/test", (req, res)=>{res.status(200).json("Working...")});
route.post("/create-user", signupUser);
route.post("/verify-upload-doc", uploadFileMulter.single('file'), digitallyVerify, uploadDocToFirebase);
route.post("/verify-update-doc", uploadFileMulter.single('file'), digitallyVerify, updateDocToMongo);
// route.post("/upload-doc",uploadFileMulter.single('file'), uploadDoc);

export default route;