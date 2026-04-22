import express from 'express';
import * as learnerBadgeController from './learner_badge.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const learnerBadgeRoutes = express.Router();

// ==========================
// 🔐 ALL ROUTES REQUIRE AUTH
// ==========================
learnerBadgeRoutes.use(isAuthenticated);


// ==========================
// 👤 MY BADGES (LEARNER)
// ==========================
learnerBadgeRoutes.get('/me', learnerBadgeController.getMyBadges);
learnerBadgeRoutes.get('/me/stats', learnerBadgeController.getMyBadgeStats);


// ==========================
// 🌍 PUBLIC / VIEW OTHER LEARNERS
// ==========================
learnerBadgeRoutes.get('/learner/:learner_id', learnerBadgeController.getLearnerBadges);
learnerBadgeRoutes.get('/learner/:learner_id/stats', learnerBadgeController.getLearnerBadgeStats);
learnerBadgeRoutes.get(
  '/learner/:learner_id/badge/:badge_id/check',
  learnerBadgeController.checkLearnerHasBadge
);


// ==========================
// 🏅 BADGE INSIGHTS
// ==========================
learnerBadgeRoutes.get('/badge/:badge_id/learners', learnerBadgeController.getBadgeLearners);
learnerBadgeRoutes.get('/recent', learnerBadgeController.getRecentlyAwardedBadges);


// ==========================
// 🔐 ADMIN / INSTRUCTOR ONLY
// ==========================
learnerBadgeRoutes.use(authorize(['admin', 'instructor']));

learnerBadgeRoutes.post('/award', learnerBadgeController.awardBadge);
learnerBadgeRoutes.delete('/learner/:learner_id/badge/:badge_id', learnerBadgeController.revokeBadge);
learnerBadgeRoutes.delete('/learner/:learner_id/all', learnerBadgeController.revokeAllBadgesFromLearner);
learnerBadgeRoutes.delete('/badge/:badge_id/all', learnerBadgeController.revokeAllLearnersFromBadge);

export default learnerBadgeRoutes;