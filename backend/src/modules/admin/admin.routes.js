import express from 'express';
import * as adminController from './admin.controller.js';
// Import your auth middleware
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(isAuthenticated, authorize(['admin']));
// ============ STATS & ANALYTICS ============
router.get('/stats', adminController.getGlobalStats);
router.get('/analytics', adminController.getAnalytics);

// ============ USER MANAGEMENT ============
// Note: Challenge routes are in /api/challenges
// Note: Incident report routes are in /api/reports
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

export default router;