import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"

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