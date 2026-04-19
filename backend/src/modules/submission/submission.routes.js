import { Router } from 'express';
import { submitFlag } from './submission.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = Router();

router.use(isAuthenticated, authorize('learner'));

router.post('/submit', submitFlag);

export default router;
