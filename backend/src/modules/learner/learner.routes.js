import { Router } from 'express';
import learnerController from './learner.controller.js';
import { startSession, abandonSession } from '../session/session.controller.js';
import { submitFlag } from '../submission/submission.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = Router();

router.use(isAuthenticated, authorize(['learner']));


// ==========================
// 📊 DASHBOARD
// ==========================
router.get('/dashboard', learnerController.getDashboard);
router.get('/stats', learnerController.getStats); // NEW


// ==========================
// 👤 PROFILE
// ==========================
router.get('/profile', learnerController.getProfile);
router.get('/badges', learnerController.getBadges);


// ==========================
// 📚 COURSES
// ==========================
router.get('/enrollments', learnerController.getEnrollments);
router.post('/courses/:courseId/enroll', learnerController.enrollCourse);
router.delete('/courses/:courseId/enroll', learnerController.unenrollCourse);


// ==========================
// 📈 COURSE PROGRESS
// ==========================
router.get('/courses/:courseId/progress', learnerController.getProgress);
router.put('/courses/:courseId/progress', learnerController.updateProgress);


// ==========================
// 🎯 CHALLENGE SESSIONS
// ==========================
router.post('/challenges/:challengeId/start', startSession);
router.post('/sessions/:id/abandon', abandonSession);


// ==========================
// 🚀 SUBMISSIONS
// ==========================
router.post('/submissions', submitFlag);

export default router;