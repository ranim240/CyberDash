import express from 'express';
import * as reportController from './incident_report.controller.js';
// Import your auth middleware
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = express.Router();

// Public routes (require authentication)
router.use(isAuthenticated);

// Learners can create and view their own reports
router.post('/', reportController.createReport);
router.get('/', reportController.getReports); // Learners see only theirs, admins see all
router.get('/:id', reportController.getReportById);

// Admin-only routes
router.patch('/:id/status', authorize(['admin']), reportController.updateReportStatus);
router.delete('/:id', authorize(['admin']), reportController.deleteReport);

// Uncomment when middleware is ready:
router.patch('/:id/status', authorize(['admin']), reportController.updateReportStatus); // Add authorizeAdmin middleware
router.delete('/:id', authorize(['admin']), reportController.deleteReport); // Add authorizeAdmin middleware

export default router;