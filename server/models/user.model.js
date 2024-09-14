import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    first_name:{
        required: true,
        type: String
    },
    last_name:{
        required: true,
        type: String
    },
    email:{
        required: true,
        type: String,
        unique: true
    },
    password:{
        required: true,
        type: String,
    },
    public_key:{
        required: true,
        type: String
    },
    documents:{
        type: [String],
        default: [],
        required: false
    }
    ,
    senders:{
        type: [String],
        default: [],
        required: false
    }
}, {timestamps: true});

export default mongoose.model("users", userSchema);