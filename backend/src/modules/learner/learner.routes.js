import { Router } from 'express';
import { getDashboard, getProfile, getBadges, getEnrollments, enrollCourse }
from './learner.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
const router = Router();
router.use(authenticate, authorize('learner'));
router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.get('/badges', getBadges);
router.get('/enrollments', getEnrollments);
router.post('/enroll/:courseId', enrollCourse);
export default router;