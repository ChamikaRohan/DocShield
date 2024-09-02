import express from "express"
import { initializeApp } from "firebase/app";
import fconfig from "../firebase/firebaseConfig.js"
import multer from "multer"
import {signupUser, signinUser, updateDocToMongo, getAllUserEmails, getUser} from "../controllers/user.controller.js"
import digitallyVerify from "../middlewares/digitallyVerify.js"

initializeApp(fconfig);
const uploadFileMulter = multer({ storage: multer.memoryStorage() })

const route = express.Router();

route.post("/create-user", signupUser);
route.get("/signin-user", signinUser);

route.post("/verify-update-doc", uploadFileMulter.single('file'), digitallyVerify, updateDocToMongo);

route.get("/get-all-emails", getAllUserEmails);
route.get("/get-user", getUser);

export default route;