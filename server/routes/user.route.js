import express from "express"

import {signupUser} from "../controllers/user.controller.js"

import {digitallyVerify} from "../middlewares/digitallyVerify.js"

const route = express.Router();

route.post("/create-user", signupUser);
route.post("/upload-doc", digitallyVerify);

export default route;