import express from 'express';
import * as reportController from './incident_report.controller.js';
// Import your auth middleware
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const incidentRouter = express.Router();

// Public routes (require authentication)
incidentRouter.use(isAuthenticated);

// Learners can create and view their own reports
incidentRouter.post('/', reportController.createReport);
incidentRouter.get('/', reportController.getReports); // Learners see only theirs, admins see all
incidentRouter.get('/:id', reportController.getReportById);

// Admin-only routes
incidentRouter.patch('/:id/status', authorize(['admin']), reportController.updateReportStatus);
incidentRouter.delete('/:id', authorize(['admin']), reportController.deleteReport);

// Uncomment when middleware is ready:
incidentRouter.patch('/:id/status', authorize(['admin']), reportController.updateReportStatus); // Add authorizeAdmin middleware
incidentRouter.delete('/:id', authorize(['admin']), reportController.deleteReport); // Add authorizeAdmin middleware

export default incidentRouter;