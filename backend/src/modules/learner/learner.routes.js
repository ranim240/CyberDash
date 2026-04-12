import { Router } from 'express';
import learnerController from './learner.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = Router();

// DEFAULT MIDDLEWARE: All learner routes require authentication and learner role
router.use(isAuthenticated, authorize(['learner']));

// learner profile and dashboard
router.get('/dashboard',           learnerController.getDashboard);
router.get('/profile',             learnerController.getProfile);
router.get('/badges',              learnerController.getBadges);

// enrolment mangement
router.get('/enrollments',         learnerController.getEnrollments);
router.post('/enroll/:courseId',   learnerController.enrollCourse);
router.delete('/enroll/:courseId', learnerController.unenrollCourse);

// course progress 
router.get('/courses/:courseId/progress',      learnerController.getProgress);
router.put('/courses/:courseId/progress',      learnerController.updateProgress);

export default router;