import { fetchLeaderboard,fetchLeaderboardByCategory,fetchMonthlyLeaderboard,fetchWeeklyLeaderboard } from "./leaderboard.service.js";

export const getLeaderboard = async(req,res)=> {
    const leaderboard = await fetchLeaderboard();
    console.log(leaderboard);
    return res.json(leaderboard);
}

export const getMonthlyLeaderboard = async(req,res)=> {
    const leaderboard = await fetchMonthlyLeaderboard();
    console.log(leaderboard);
    return res.json(leaderboard);
}

export const getWeeklyLeaderboard = async(req,res)=> {
    const leaderboard = await fetchWeeklyLeaderboard();
    console.log(leaderboard);
    return res.json(leaderboard);
}

export const getLeaderboardByCategory = async(req,res)=> {
    const leaderboard = await fetchLeaderboardByCategory(req.params.category_id);
    console.log(leaderboard);
    return res.json(leaderboard);
}