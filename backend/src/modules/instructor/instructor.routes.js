import express from 'express';
import { getDashboardStats } from './instructor.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const instructorRouter = express.Router();

// GET /api/dashboard/engaged-learners
instructorRouter.get(
  '/engaged-learners',
  isAuthenticated,authorize(['instructor']),
  getDashboardStats
);

export default instructorRouter;
 