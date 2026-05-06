import express from 'express';
import { getProfile } from './user.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';


const userRouter = express.Router();

// GET /api/user/profile
userRouter.get('/profile', isAuthenticated, getProfile);

export default userRouter;