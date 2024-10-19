import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import { initializeApp } from "firebase/app"
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import fconfig from "../firebase/firebaseConfig.js"
import forge from 'node-forge';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

initializeApp(fconfig);
const storage = getStorage();

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); 
};



export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const otp = generateOtp();
  const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.TICKETTWIST_EMAIL, 
        pass: process.env.TICKETTWIST_EMAIL_PASSWORD
      },
    });

    await transporter.sendMail({
      from: process.env.TICKETTWIST_EMAIL,
      to: email,
      subject: 'Your DocShield OTP',
      html: `<p>Thank you for using DocShield!</p><p>Your One-Time Password (OTP) is:</p><h1 style='font-size: 24px; color: #4CAF50; text-align: center;'>${otp}</h1><p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p><p>If you did not request this OTP, please ignore this email.</p><p>Thank you,<br>The DocShield Team</p><hr><footer style='font-size: 12px; color: #999; text-align: center;'><p>This email was sent to you because you requested an OTP for your account.</p><p>© 2024 DocShield. All rights reserved.</p></footer>`,
    });

    await User.updateOne(
      { email },
      { otp, otpExpiresAt: otpExpiration }
    );

    res.status(200).json({ message: 'OTP sent successfully' }); 
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending OTP email' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};

export const signupUser = async(req, res) =>{
    try
    {
        const {email, password} = req.body;
        const userExistsMail = await User.findOne({email});
        if ( userExistsMail != null ) return res.status(400).json({error: "User already exists!"});
        
        const hashshedPassword = bcryptjs.hashSync(password, 10);

        const keypair = forge.pki.rsa.generateKeyPair(2048);
        const privateKey = keypair.privateKey;
        const publicKey = keypair.publicKey;

        const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
        const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

        const user = new User({...req.body, password: hashshedPassword, public_key: publicKeyPem});

        await user.save();
        res.status(200).json({message: "User created successfully!", private_key: privateKeyPem});
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

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found!" });
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().split('T')[0];
    const formattedTime = currentDateTime.toTimeString().split(' ')[0].replace(/:/g, '-');
    const fileName = `${req.body.name}_${formattedDate}_${formattedTime}.pdf`;
    const storageRef = ref(storage, `docs/${fileName}`);
    const metadata = {
      contentType: 'application/pdf',
      customMetadata: {
          'uploadedBy': sender, 
          'uploadTime': currentDateTime
      }
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

export const getAllUserEmails = async () => {
  const users = await User.find({}, 'email public_key first_name last_name');
  
  const emailAndKey = users.map(user => ({
    email: user.email,
    public_key: user.public_key,
    first_name: user.first_name,
    last_name: user.last_name
  }));

  return emailAndKey;
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

export const getPublicKeyByEmail = async (email) => {
      const user = await User.findOne({ email }).select('public_key');
      if (!user) {
          return null;;
      }
      return user.public_key;
};
