import { Router } from 'express';
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
import { authorize } from '../../middlewares/role.js';

const challengeRouter = Router();


// ==========================
// 📌 ADMIN ROUTES
// ==========================

challengeRouter.get(
  '/challenges/pending',
  isAuthenticated,
  authorize(['admin']),
  fetchPendingChallenges
);

challengeRouter.put(
  '/challenges/:id/change-status',
  isAuthenticated,
  authorize(['admin']),
  updateChallengeStatus
);

challengeRouter.get(
  '/all-challenges',
  isAuthenticated,
  authorize(['admin']),
  getAll
);


// ==========================
// 📌 INSTRUCTOR ROUTES
// ==========================

challengeRouter.get(
  '/my-challenges',
  isAuthenticated,
  authorize(['instructor']),
  getInstructorChallenges
);

challengeRouter.post(
  '/challenges',
  isAuthenticated,
  authorize(['instructor']),
  createChallenge
);

challengeRouter.put(
  '/challenges/:id',
  isAuthenticated,
  authorize(['instructor']),
  modifyChallenge
);

challengeRouter.delete(
  '/challenges/:id',
  isAuthenticated,
  authorize(['instructor']),
  deleteChallenge
);

challengeRouter.post(
  '/challenges/:id/files',
  isAuthenticated,
  authorize(['instructor']),
  uploadFile
);


// ==========================
// 📌 PUBLIC / LEARNER ROUTES
// ==========================

// 🔥 IMPORTANT: keep static routes first
challengeRouter.get(
  '/challenges/search',
  searchChallenges
);

challengeRouter.get(
  '/challenges/active',
  getActiveChallenges
);

challengeRouter.get(
  '/challenges/:id',
  getOne
);

challengeRouter.get(
  '/challenges/:id/files',
  isAuthenticated,
  getFiles
);

challengeRouter.get(
  '/challenges/:id/badges',
  isAuthenticated,
  getBadges
);

export default challengeRouter;
