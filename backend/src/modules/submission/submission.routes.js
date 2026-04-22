import { Router } from 'express';
import { submitFlag } from './submission.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';

const router = Router();

// ==========================
// 🔐 AUTH ONLY (no global role lock)
// ==========================
router.use(isAuthenticated);

// ==========================
// 📌 SUBMIT FLAG
// ==========================
router.post('/submit', submitFlag);

export default router;