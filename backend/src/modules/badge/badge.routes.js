import express from 'express';
import * as badgeController from './badge.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const badgeRouter = express.Router();


// ==========================
// 📌 PUBLIC ROUTES
// ==========================
badgeRouter.get('/', badgeController.getAllBadges);
badgeRouter.get('/:id/stats', badgeController.getBadgeStats);
badgeRouter.get('/:id', badgeController.getBadgeById);


// ==========================
// 🔐 ADMIN ONLY ROUTES
// ==========================
badgeRouter.use(isAuthenticated, authorize(['admin']));

badgeRouter.post('/', badgeController.createBadge);
badgeRouter.patch('/:id', badgeController.updateBadge);
badgeRouter.delete('/:id', badgeController.deleteBadge);


// ==========================
// 📌 ADMIN OWN BADGES
// ==========================
badgeRouter.get('/admin/my-badges', badgeController.getMyBadges);

export default badgeRouter;