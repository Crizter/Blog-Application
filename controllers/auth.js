import express from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.config.js';
import dotenv from 'dotenv';

dotenv.config();

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // checking if user exists or not 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Save the user to the database
        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        console.log('User registered successfully');
        return res.status(200).json(savedUser);
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Authentication failed. User not found." });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Authentication failed. Wrong password." });
        }

        // Check if JWT_SECRET is defined
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "Internal server error. JWT secret is not defined." });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // SET THE COOKIE 
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.status(200).json({ message: "Login successful", token, redirectUrl: "/blogs"  });

        
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};


const logout = (req, res) => {
    // Clear the cookie on logout by setting its expiration date to a date in the past 
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    return res.json({ message: "Logout successful" });
};

const verify = async (req, res, next) => {
    try {
        const authHeader = req.headers['cookie'];
        if (!authHeader) {
            console.log('No auth header found');
            return res.status(401).json({ message: 'You are not authenticated' });
        }

        const cookies = authHeader.split('; ').reduce((acc, cookie) => {
            const [name, value] = cookie.split('=');
            acc[name.trim()] = value;
            return acc;
        }, {});

        const token = cookies['token'];
        if (!token) {
            console.log('No token found in cookies');
            return res.status(401).json({ message: 'You are not authenticated' });
        }

        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.log('JWT verification failed:', err);
                return res.status(401).json({ message: 'Token verification failed' });
            }

            const { id } = decoded;
            const user = await User.findById(id);
            if (!user) {
                console.log('User not found');
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.log('Error in verify middleware:', error.message);
        res.status(400).json({ message: error.message });
    }
};

export {
    register,
    login,
    logout,
    verify,
};
