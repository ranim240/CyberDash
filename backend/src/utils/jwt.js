import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js";

export const generateToken = (user) =>{
    return jwt.sign(
        {
            userId : user.user_id,
            role : user.role
        },
        JWT_SECRET,
        {
            expiresIn: '24h'
        }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};