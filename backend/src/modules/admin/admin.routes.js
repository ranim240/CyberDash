import express from 'express';
import * as adminController from './admin.controller.js';
// Import your auth middleware
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const adminRouter = express.Router();

// Apply authentication and admin authorization to all routes
adminRouter.use(isAuthenticated, authorize(['admin']));
// ============ STATS & ANALYTICS ============
adminRouter.get('/stats', adminController.getGlobalStats);
adminRouter.get('/analytics', adminController.getAnalytics);

// ============ USER MANAGEMENT ============
// Note: Challenge routes are in /api/challenges
// Note: Incident report routes are in /api/reports
adminRouter.get('/users', adminController.getAllUsers);
adminRouter.patch('/users/:id/status', adminController.updateUserStatus);
adminRouter.delete('/users/:id', adminController.deleteUser);

export default adminRouter;