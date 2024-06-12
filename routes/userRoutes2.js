import express from 'express' 
import passport from '../backup/config/passport.js'
import {register,login,logout, profile } from '../backup/config/controllers/userController.js'

const router = express.Router();

// Router to render registration page 
router.get('/register', (req, res) => {
    res.render('user/register', { title: 'Register' });
});
router.post('/register', register);


// Router to render login page 
router.get('/login', (req,res) => { 
    res.render('user/login', {Title : 'Login'})
})
router.post('/login',login) ; 


// Router to render Profile page  (Protected Route)
router.get('/profile', passport.authenticate('jwt', { session: false }), (req,res) => { 
    res.render('user/profile', {title : 'Profile', user : req.user});
});
// Logout route
router.post('/logout', passport.authenticate('jwt', { session: false }), logout);



export default router ; 