import { Router } from 'express';
import { startSession, abandonSession } from './session.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

// ==========================
// 🔐 AUTH ONLY (NO ROLE LIMIT HERE)
// ==========================
router.use(authenticate);


// ==========================
// 📌 START SESSION
// ==========================
router.post('/:challengeId/start', startSession);


// ==========================
// 📌 ABANDON SESSION
// ==========================
router.post('/:id/abandon', abandonSession);

export default router;