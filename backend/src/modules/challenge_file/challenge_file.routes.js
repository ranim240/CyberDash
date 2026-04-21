import express from 'express';
import * as challengeFileController from './challenge_file.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = express.Router();

// ============ PUBLIC ROUTES (view files) ============
router.get('/challenge/:challenge_id', challengeFileController.getFilesByChallenge);
router.get('/:id', challengeFileController.getFileById);
router.get('/challenge/:challenge_id/stats', challengeFileController.getChallengeFileStats);

// ============ ADMIN/INSTRUCTOR ROUTES ============
router.use(isAuthenticated, authorize(['admin', 'instructor']));

router.post('/', challengeFileController.createChallengeFile);
router.post('/bulk', challengeFileController.createMultipleChallengeFiles);
router.patch('/:id', challengeFileController.updateChallengeFile);
router.delete('/:id', challengeFileController.deleteChallengeFile);
router.delete('/challenge/:challenge_id', challengeFileController.deleteFilesByChallenge);

// ============ ADMIN ONLY ROUTES ============
router.get('/storage/stats', isAuthenticated, authorize(['admin']), challengeFileController.getTotalStorageUsed);

export default router;