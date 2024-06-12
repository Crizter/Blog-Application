import express from 'express' ; 
import validate from '../middleware/validation.js'
import { check } from 'express-validator';
import {register , login , logout, verify} from '../controllers/auth.js'

const router = express.Router() ; 

router.get('/', (req,res) => {
    res.render('../views/user/register', {title : 'Register', error: null, success: null});
});
router.post(
    '/register',
    [
        check('username')
            .notEmpty()
            .withMessage('Username is required')
            .trim()
            .escape(),
        check('email')
            .isEmail()
            .withMessage('Enter a valid email address')
            .normalizeEmail(),
        check('password')
            .notEmpty()
            .withMessage('Password cannot be empty')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters long')
    ],
    validate,
    register
);
router.get('/login', (req,res) => { 
    res.render('../views/user/login', {title : 'Login', error: null, success: null  });
});


router.post(
    '/login',
    [
        check('email')
            .isEmail() 
            .withMessage('Enter a valid email address')
            .normalizeEmail() , 
        check('password')
            .notEmpty()
            .withMessage('Password cannot be empty')

    ],
    validate,
    login
);
router.get('/logout', logout, (req,res) => { 
    res.redirect('/user/login');
}) ;  

router.get('/profile', verify, (req,res) => { 
    res.render('user/profile', {title : 'Profile', user : req.user });
}) ; 

export default router ; 



