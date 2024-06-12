import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from "../config/index.config";
const { Schema } = mongoose;

const validateEmail = (email) => { 
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

const userSchema = new Schema ({
    username: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
    },
    email: { 
        type: String, 
        trim: true, 
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 200,
    }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    const user  = this ; 
    if(!user.isModified('password')) return next() ; 
    bcrypt.genSalt(10,(err,salt) => { 
        bcrypt.hash(user.password, salt , (err,hash) => { 
            if(err) return next(err) ; 

            user.password = hash ;
            next() ; 

        });
    });
});




const User = mongoose.model('User', userSchema);

export default User;
