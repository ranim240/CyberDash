import express from 'express';
import * as badgeController from './badge.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = express.Router();


// ==========================
// 📌 PUBLIC ROUTES
// ==========================
router.get('/', badgeController.getAllBadges);
router.get('/:id/stats', badgeController.getBadgeStats);
router.get('/:id', badgeController.getBadgeById);


// ==========================
// 🔐 ADMIN ONLY ROUTES
// ==========================
router.use(isAuthenticated, authorize(['admin']));

router.post('/', badgeController.createBadge);
router.patch('/:id', badgeController.updateBadge);
router.delete('/:id', badgeController.deleteBadge);


// ==========================
// 📌 ADMIN OWN BADGES
// ==========================
router.get('/admin/my-badges', badgeController.getMyBadges);

export default router;