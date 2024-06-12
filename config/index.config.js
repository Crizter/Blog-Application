import dotenv from 'dotenv';


import express from 'express';

dotenv.config();
const {JWT_SECRET, JWT_REFRESH_SECRET, PORT } = process.env;
export {JWT_SECRET, JWT_REFRESH_SECRET, PORT};
console.log(process.env.JWT_SECRET, process.env.JWT_REFRESH_SECRET);
console.log(JWT_SECRET, JWT_REFRESH_SECRET);