import express from 'express';
import getProfile from './learner.controller.js';
import updateProfile from './learner.controller.js';
const learnerRouter = express.Router();

// to get all of learner's info from DB
learnerRouter.get("/profile",getProfile);
// to modify learner's info
learnerRouter.post("/updateProfile",updateProfile);
export default learnerRouter;
s