import express from 'express';
import * as learnerBadgeController from './learner_badge.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = express.Router();

// ============ AUTHENTICATED LEARNER ROUTES ============
router.use(isAuthenticated);

// Get my own badges and stats
router.get('/me', learnerBadgeController.getMyBadges);
router.get('/me/stats', learnerBadgeController.getMyBadgeStats);

// View other learners' badges (public)
router.get('/learner/:learner_id', learnerBadgeController.getLearnerBadges);
router.get('/learner/:learner_id/stats', learnerBadgeController.getLearnerBadgeStats);
router.get('/learner/:learner_id/badge/:badge_id/check', learnerBadgeController.checkLearnerHasBadge);

// View learners who have a specific badge
router.get('/badge/:badge_id/learners', learnerBadgeController.getBadgeLearners);

// Recently awarded badges (public feed)
router.get('/recent', learnerBadgeController.getRecentlyAwardedBadges);

// ============ ADMIN/INSTRUCTOR ROUTES ============
router.use(authorize(['admin', 'instructor']));

// Award and revoke badges
router.post('/award', learnerBadgeController.awardBadge);
router.delete('/learner/:learner_id/badge/:badge_id', learnerBadgeController.revokeBadge);
router.delete('/learner/:learner_id/all', learnerBadgeController.revokeAllBadgesFromLearner);
router.delete('/badge/:badge_id/all', learnerBadgeController.revokeAllLearnersFromBadge);

export default router;