import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
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

export const signinUser = async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password!" });

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password!" });

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).cookie("access_token", token, {httpOnly: true, secure: true, sameSite: 'None'}).json({ message: "Signin successful!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const auth = async (req, res) =>{
  res.status(200).json({user: true, email: req.email});
}

export const uploadDocToFirebase = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const currentDateTime = new Date().toISOString().replace(/:/g, '-'); 
      const fileName = `${req.file.originalname.split('.pdf')[0]}_${currentDateTime}.pdf`;

      const storageRef = ref(storage, `docs/${fileName}`);
      const metadata = {
        contentType: req.file.mimetype,
      };

    const uploadTask = uploadBytesResumable(storageRef, req.file.buffer, metadata);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
        },
        (error) => {
          res.status(500).json({ error: error.message });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          res.status(200).json({ message: "Document uploaded successfully!", downloadURL });
        }
      );
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const updateDocToMongo = async (req, res) => {
  try {
    const { email } = req.body;
    const { sender } = req.body;
    console.log(sender);

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(404).json({ error: "User not found!" });

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().split('T')[0];
    const formattedTime = currentDateTime.toTimeString().split(' ')[0].replace(/:/g, '-');
    const fileName = `${req.file.originalname.split('.pdf')[0]}_${formattedDate}_${formattedTime}.pdf`;
    const storageRef = ref(storage, `docs/${fileName}`);
    const metadata = {
      contentType: req.file.mimetype,
    };

    const uploadTask = uploadBytesResumable(storageRef, req.file.buffer, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
      },
      (error) => {
        return res.status(500).json({ error: error.message });
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        user.documents.push(downloadURL);
        user.senders.push(sender)
        await user.save();

        res.status(200).json({ message: "Document updated to Mongo successfully!", downloadURL, user });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUserEmails = async (req, res) => {
  try {
    const users = await User.find({}, 'email');
    const emails = users.map(user => user.email);
    return emails;
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email }).select('-password -createdAt -updatedAt -__v');;
    if (!user) return res.status(400).json({ message: "User not found!"});
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};