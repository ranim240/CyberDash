import { Router } from 'express';
import { submitFlag } from './submission.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = Router();

router.use(authenticate, authorize('learner'));

router.post('/submit', submitFlag);

export default router;
