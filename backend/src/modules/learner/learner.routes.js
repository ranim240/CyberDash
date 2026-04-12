import { Router } from 'express';
import { getDashboard, getProfile, getBadges, getEnrollments, enrollCourse }
from './learner.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';
const router = Router();
router.use(isAuthenticated, authorize(['learner']));
router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.get('/badges', getBadges);
router.get('/enrollments', getEnrollments);
router.post('/enroll/:courseId', enrollCourse);
export default router;
