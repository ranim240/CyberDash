import express from 'express';
import {
  getAll,
  getOne,
  createChallenge,
  modifyChallenge,
  deleteChallenge,
  uploadFile,
  getFiles,
  getBadges,
  updateChallengeStatus,
  fetchPendingChallenges,
  getActiveChallenges,
  getInstructorChallenges,
  searchChallenges
} from './challenge.controller.js';

import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize }       from '../../middlewares/role.js';

const challengeRouter = express.Router();

// ============================================================
// ⚠️  Le router est monté sur /api/challenges dans app.js
//     donc ici on ne répète PAS /challenges — on part de /
// ============================================================


// ==========================
// 📌 ADMIN ROUTES
// ==========================

challengeRouter.get(
  '/pending',                          // → GET /api/challenges/pending
  isAuthenticated,
  authorize(['admin']),
  fetchPendingChallenges
);

challengeRouter.put(
  '/:id/change-status',               // → PUT /api/challenges/:id/change-status
  isAuthenticated,
  authorize(['admin']),
  updateChallengeStatus
);

challengeRouter.get(
  '/all',                              // → GET /api/challenges/all
  isAuthenticated,
  authorize(['admin']),
  getAll
);


// ==========================
// 📌 INSTRUCTOR ROUTES
// ==========================

challengeRouter.get(
  '/my',                               // → GET /api/challenges/my
  isAuthenticated,
  authorize(['instructor']),
  getInstructorChallenges
);

challengeRouter.post(
  '/',                                 // → POST /api/challenges
  isAuthenticated,
  authorize(['instructor']),
  createChallenge
);

challengeRouter.put(
  '/:id',                              // → PUT /api/challenges/:id
  isAuthenticated,
  authorize(['instructor']),
  modifyChallenge
);

challengeRouter.delete(
  '/:id',                              // → DELETE /api/challenges/:id
  isAuthenticated,
  authorize(['instructor']),
  deleteChallenge
);

challengeRouter.post(
  '/:id/files',                        // → POST /api/challenges/:id/files
  isAuthenticated,
  authorize(['instructor']),
  uploadFile
);


// ==========================
// 📌 PUBLIC / LEARNER ROUTES
// ==========================

// 🔥 IMPORTANT : routes statiques AVANT /:id pour éviter les conflits
challengeRouter.get('/search', searchChallenges);      // → GET /api/challenges/search
challengeRouter.get('/active', getActiveChallenges);   // → GET /api/challenges/active

challengeRouter.get('/:id',          getOne);          // → GET /api/challenges/:id
challengeRouter.get('/:id/files',    isAuthenticated, getFiles);   // → GET /api/challenges/:id/files
challengeRouter.get('/:id/badges',   isAuthenticated, getBadges);  // → GET /api/challenges/:id/badges

export default challengeRouter;