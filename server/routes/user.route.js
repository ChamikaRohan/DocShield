import express from "express"
import { initializeApp } from "firebase/app";
import fconfig from "../firebase/firebaseConfig.js"
import multer from "multer"
import {signupUser, signinUser, updateDocToMongo, getAllUserEmails, getUser, auth} from "../controllers/user.controller.js"
import digitallyVerify from "../middlewares/digitallyVerify.js"
import decrypt from "../middlewares/decrypt.js"
import { cookieJwtAuth } from "../middlewares/cookieJwtAuth.js"

initializeApp(fconfig);
const uploadFileMulter = multer({ storage: multer.memoryStorage() })

const route = express.Router();

route.post("/create-user", signupUser);
route.post("/signin-user", signinUser);
route.post('/auth',cookieJwtAuth, auth);

route.post("/verify-update-doc", uploadFileMulter.single('file'),decrypt ,digitallyVerify, updateDocToMongo);

route.get("/get-all-emails", getAllUserEmails);
route.post("/get-user", getUser);

export default route;