import express from 'express';
import {getLeaderboard,getLeaderboardByCategory,getMonthlyLeaderboard,getWeeklyLeaderboard} from './leaderboard.controller.js';

const leaderboardRouter = express.Router();

// global leaderboard 
leaderboardRouter.get("/",getLeaderboard);
// weekly 
leaderboardRouter.get("/weekly",getWeeklyLeaderboard);
// monthly 
leaderboardRouter.get("/monthly",getMonthlyLeaderboard) ;
// per category
leaderboardRouter.get("/:category_id",getLeaderboardByCategory) ;
export default leaderboardRouter;

 