import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { initializeApp } from "firebase/app"
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import fconfig from "../firebase/firebaseConfig.js"

initializeApp(fconfig);
const storage = getStorage();

export const signupUser = async(req, res) =>{
    try
    {
        const {email, password} = req.body;
        const userExistsMail = await User.findOne({email});
        if ( userExistsMail != null ) return res.status(400).json({error: "User already exists!"});
        
        const hashshedPassword = bcryptjs.hashSync(password, 10);
        const user = new User({...req.body, password: hashshedPassword});
        await user.save();
        res.status(200).json({message: "User created successfully!"});
    }
    catch(error)
    {
        res.status(500).json({error: "Internal server error!"});
    }
}

export const uploadDoc = async (req, res) => {
    try {
      const currentDateTime = new Date();
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      const storageRef = ref(storage, `docs/${req.file.originalname}+${currentDateTime}`);
      const metadata = {
        contentType: req.file.mimetype,
      };
  
      const uploadTask = uploadBytesResumable(storageRef, req.file.buffer, metadata);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress
        },
        (error) => {
          res.status(500).json({ error: error.message });
        },
        async () => {
          // Upload completed successfully, get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          res.status(200).json({ message: "Document uploaded successfully!", downloadURL });
        }
      );
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}