import express from 'express';

import learnerController from './learner.controller.js';
import { startSession, abandonSession } from '../session/session.controller.js';
import { submitFlag } from '../submission/submission.controller.js';

import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const learnerRouter = express.Router();


// ==========================
// 🔒 GLOBAL MIDDLEWARE (learner only)
// ==========================
learnerRouter.use(isAuthenticated, authorize(['learner']));


// ==========================
// 📊 DASHBOARD
// ==========================
learnerRouter.get('/dashboard', learnerController.getDashboard);
learnerRouter.get('/stats',     learnerController.getStats);


// ==========================
// 👤 PROFILE + BADGES + SKILLS
// ==========================
learnerRouter.get('/profile', learnerController.getProfile);
learnerRouter.get('/badges',  learnerController.getBadges);
learnerRouter.get('/skills',  learnerController.getSkills);


// ==========================
// 📚 COURSES
// ==========================
learnerRouter.get('/enrollments',              learnerController.getEnrollments);
learnerRouter.post('/courses/:courseId/enroll',  learnerController.enrollCourse);
learnerRouter.delete('/courses/:courseId/enroll', learnerController.unenrollCourse);


// ==========================
// 📈 PROGRESS
// ==========================
learnerRouter.get('/courses/:courseId/progress', learnerController.getProgress);
learnerRouter.put('/courses/:courseId/progress', learnerController.updateProgress);


// ==========================
// 🎯 CHALLENGE SESSIONS
// ==========================
learnerRouter.post('/challenges/:challengeId/start', startSession);
learnerRouter.post('/sessions/:sessionId/abandon',   abandonSession);


// ==========================
// 🚀 SUBMISSIONS
// ==========================
learnerRouter.post('/submissions', submitFlag);


export default learnerRouter;