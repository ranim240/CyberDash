import { Router } from 'express';
import { startSession, sendMessage, getHistory, getSessions } from './chat.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';

const router = Router();
router.use(isAuthenticated);

router.post('/start',              startSession);
router.post('/message',            sendMessage);
router.get('/sessions',            getSessions);
router.get('/history/:sessionId',  getHistory);

export default router;
