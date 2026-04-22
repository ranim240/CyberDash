import express from 'express';
import * as challengeFileController from './challenge_file.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = express.Router();


// ==========================
// 📌 PUBLIC ROUTES
// ==========================
router.get('/challenge/:challenge_id/stats', challengeFileController.getChallengeFileStats);
router.get('/challenge/:challenge_id', challengeFileController.getFilesByChallenge);
router.get('/file/:id', challengeFileController.getFileById);


// ==========================
// 🔐 INSTRUCTOR + ADMIN ROUTES
// ==========================
router.use(isAuthenticated, authorize(['admin', 'instructor']));

router.post('/', challengeFileController.createChallengeFile);
router.post('/bulk', challengeFileController.createMultipleChallengeFiles);

router.patch('/file/:id', challengeFileController.updateChallengeFile);
router.delete('/file/:id', challengeFileController.deleteChallengeFile);

router.delete('/challenge/:challenge_id', challengeFileController.deleteFilesByChallenge);


// ==========================
// 📊 ADMIN ONLY ROUTES
// ==========================
router.get(
  '/storage/stats',
  isAuthenticated,
  authorize(['admin']),
  challengeFileController.getTotalStorageUsed
);

export default router;