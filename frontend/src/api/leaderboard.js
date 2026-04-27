// api/leaderboard.js
import api from "./axios";

// global
export const getLeaderboard = () =>
  api.get("/leaderboard");

// weekly
export const getWeeklyLeaderboard = () =>
  api.get("/leaderboard/weekly");

// monthly
export const getMonthlyLeaderboard = () =>
  api.get("/leaderboard/monthly");

// category
export const getCategoryLeaderboard = (categoryId) =>
  api.get(`/leaderboard/${categoryId}`);