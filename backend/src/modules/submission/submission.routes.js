import express from 'express';
import { submitFlag } from './submission.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';

const submissionRouter = express.Router();

// ==========================
// 🔐 AUTH ONLY (no global role lock)
// ==========================
submissionRouter.use(isAuthenticated);

// ==========================
// 📌 SUBMIT FLAG
// ==========================
submissionRouter.post('/submit', submitFlag);

export default submissionRouter;