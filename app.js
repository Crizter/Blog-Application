import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import blogRoutes from './routes/blogRoutes.js';
import cors from 'cors' ; 
import cookieParser from 'cookie-parser';
import { cookie } from 'express-validator';
import userRoutes from './routes/userRoutes.js'
import { PORT } from './config/index.config.js';
import methodOverride from 'method-override';

import dotenv from 'dotenv';
dotenv.config();


// create server 
const app = express();


// CONFIGURE HEADER 
app.use(cors());
app.use(cookieParser())
app.use(express.json());  // to parse JSON data
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const __dirname = dirname(fileURLToPath(import.meta.url));

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
// Connect to DB 
const connect_database = async () => {
    try {
    const connection_instance = await mongoose.connect('mongodb://localhost:27017/Blog_Project', {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        connectTimeoutMS: 10000, // 10 seconds
        socketTimeoutMS: 45000, // 45 seconds
       
        });
        console.log('MongoDB connected:', connection_instance.connection.host);
        //  createSampleData();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

// Connect to the database
connect_database();

// Session setup
app.use(session({
    secret : 'secret' ,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // for development, set to true in production with HTTPS
}))

// Passport setup 
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
    
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// Use blog routes
app.use('/blogs', blogRoutes);
app.use('/users', userRoutes);

// 404 page
app.listen(PORT ,() => {
    console.log(`listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
