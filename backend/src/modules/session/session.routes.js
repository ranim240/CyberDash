import { Router } from 'express';
import { startSession, abandonSession } from './session.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = Router();

router.use(authenticate, authorize('learner'));

router.post('/:challengeId/start', startSession);
router.post('/:id/abandon', abandonSession);

export default router;
