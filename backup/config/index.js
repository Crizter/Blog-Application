import * as dotenv from 'dotenv' ; 
dotenv.config() ; 

const {JWT_SECRET}  = process.env ;
export {JWT_SECRET};