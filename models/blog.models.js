// import mongoose from 'mongoose' ;
// import {Schema} from 'mongoose' ; 
import mongoose from 'mongoose';
const {Schema} = mongoose;
const blogSchema = new Schema({

    title: {
        
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        
    },
    description: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;


