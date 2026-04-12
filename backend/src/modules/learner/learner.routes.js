import { Router } from 'express';
import {
  getDashboard,
  getProfile,
  getBadges,
  getEnrollments,
  enrollCourse,
  unenrollCourse,
  updateProgress,
  getProgress
} from './learner.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = Router();

router.use(isAuthenticated, authorize(['learner']));

// learner profile and dashboard
router.get('/dashboard',           getDashboard);
router.get('/profile',             getProfile);
router.get('/badges',              getBadges);

// enrolment mangement
router.get('/enrollments',         getEnrollments);
router.post('/enroll/:courseId',   enrollCourse);
router.delete('/enroll/:courseId', unenrollCourse);

// course progress 
router.get('/courses/:courseId/progress',      getProgress);
router.put('/courses/:courseId/progress',      updateProgress);

export default router;