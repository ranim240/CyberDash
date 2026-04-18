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
    fetchPendingChallenges,getActiveChallenges,getInstructorChallenges, fetchByDifficulty,SearchChallenges
} from './challenge.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';


const challengeRouter = Router();

//Get Pending challenges
challengeRouter.get('/challenges/pending',isAuthenticated,authorize(['admin']), fetchPendingChallenges);

// Get all challenges

challengeRouter.get('/allChallenges',isAuthenticated,authorize(['admin']), getAll);

//Get Active Challenges
challengeRouter.get('/challenges', getActiveChallenges);

// Get single challenge
challengeRouter.get('/challenges/:id', getOne);

// Create new challenge
challengeRouter.post('/challenges',isAuthenticated, authorize(['instructor']), createChallenge);

// Update challenge
challengeRouter.put('/challenges/:id',isAuthenticated, authorize(['instructor']),isAuthenticated, modifyChallenge);

// Delete challenge
challengeRouter.delete('/challenges/:id',isAuthenticated, authorize(['instructor']),isAuthenticated, deleteChallenge);

// Get challenge files
challengeRouter.get('/challenges/:id/files',isAuthenticated, getFiles);

// Upload challenge file
challengeRouter.post('/challenges/:id/files',isAuthenticated, authorize(['instructor']), uploadFile);

// Get challenge badges
challengeRouter.get('/challenges/:id/badges', getBadges);

// Update Challenge Status
challengeRouter.put('/challenges/:id/changeStatus',isAuthenticated,authorize(['admin']), updateChallengeStatus);


// challenges by instructor with all status
challengeRouter.get('/myChallenges',isAuthenticated,authorize(['instructor']), getInstructorChallenges)
// by difficulty 
challengeRouter.get('/challenges/:difficulty',fetchByDifficulty)
// To Apply filters example GET /challenges?difficulty=beginner&minPoints=50 : 
challengeRouter.get("/", SearchChallenges);
export default challengeRouter;
