import express from 'express';
import * as challengeFileController from './challenge_file.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';
import upload from '../../config/multer.js';
const challengeFileRoutes = express.Router();


// ==========================
// 📌 PUBLIC ROUTES
// ==========================
challengeFileRoutes.get('/challenge/:challenge_id/stats', challengeFileController.getChallengeFileStats);
challengeFileRoutes.get('/challenge/:challenge_id', challengeFileController.getFilesByChallenge);
challengeFileRoutes.get('/file/:id', challengeFileController.getFileById);


// ==========================
// 🔐 INSTRUCTOR + ADMIN ROUTES
// ==========================
challengeFileRoutes.use(isAuthenticated, authorize(['admin', 'instructor']));

challengeFileRoutes.post('/',upload.single('file'), challengeFileController.createChallengeFile);
challengeFileRoutes.post('/bulk', upload.array('files', 10), challengeFileController.createMultipleChallengeFiles);

challengeFileRoutes.patch('/file/:id', challengeFileController.updateChallengeFile);
challengeFileRoutes.delete('/file/:id', challengeFileController.deleteChallengeFile);

challengeFileRoutes.delete('/challenge/:challenge_id', challengeFileController.deleteFilesByChallenge);


// ==========================
// 📊 ADMIN ONLY ROUTES
// ==========================
challengeFileRoutes.get(
  '/storage/stats',
  isAuthenticated,
  authorize(['admin']),
  challengeFileController.getTotalStorageUsed
);

export default challengeFileRoutes;