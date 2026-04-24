import express from 'express';
import * as controller from './auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', controller.register);
authRouter.post('/login', controller.login);
authRouter.post('/forgot-password', controller.forgotPassword);
authRouter.post('/reset-password/:userId/:token', controller.resetPassword);

export default authRouter;
