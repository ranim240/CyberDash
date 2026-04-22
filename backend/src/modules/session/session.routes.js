import express from 'express';
import { startSession, abandonSession } from './session.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';

const sessionRouter = express.Router();

// ==========================
// 🔐 AUTH ONLY (NO ROLE LIMIT HERE)
// ==========================
sessionRouter.use(isAuthenticated);


// ==========================
// 📌 START SESSION
// ==========================
sessionRouter.post('/:challengeId/start', startSession);


// ==========================
// 📌 ABANDON SESSION
// ==========================
sessionRouter.post('/:id/abandon', abandonSession);

export default sessionRouter;