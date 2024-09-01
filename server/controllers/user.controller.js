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

export const uploadDocToFirebase = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      // Generate a filename with the .pdf extension
      const currentDateTime = new Date().toISOString().replace(/:/g, '-'); // Format datetime to avoid issues
      const fileName = `${req.file.originalname.split('.pdf')[0]}_${currentDateTime}.pdf`;

      const storageRef = ref(storage, `docs/${fileName}`);
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

export const updateDocToMongo = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(404).json({ error: "User not found!" });

    // Upload document to Firebase
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Generate a filename with the .pdf extension
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
      // Handle upload progress (optional)
      },
      (error) => {
        return res.status(500).json({ error: error.message });
      },
      async () => {
        // Upload completed successfully, get the download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Update user's document array in MongoDB
        user.documents.push(downloadURL);
        await user.save();

        res.status(200).json({ message: "Document updated to Mongo successfully!", downloadURL, user });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};