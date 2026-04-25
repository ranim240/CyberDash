import express from 'express';
import * as controller from './auth.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
const authRouter = express.Router();

authRouter.post('/register', controller.register);
authRouter.post('/login', controller.login);
authRouter.post('/forgot-password', controller.forgotPassword);
authRouter.post('/reset-password/:userId/:token', controller.resetPassword);


// ✅ nouvelle route — protégée par isAuthenticated
authRouter.get('/me', isAuthenticated, controller.getMe);
 
export default authRouter;
