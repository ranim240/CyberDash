import express from 'express';
import {getLeaderboard,getLeaderboardByCategory,getMonthlyLeaderboard,getWeeklyLeaderboard} from './leaderboard.controller.js';

const leaderboardRouter = express.Router();

// global leaderboard 
leaderboardRouter.get("/leaderboard",getLeaderboard);
// weekly 
leaderboardRouter.get("/leaderboard/weekly",getWeeklyLeaderboard);
// monthly 
leaderboardRouter.get("/leaderboard/monthly",getMonthlyLeaderboard) ;
// per category
leaderboardRouter.get("/leaderboard/:category_id",getLeaderboardByCategory) ;
export default leaderboardRouter;



 