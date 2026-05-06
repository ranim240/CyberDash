import leaderboardService from "./xp_history.queries.js";


const format = async (leaderboard) => {
  console.log(leaderboard);
  if (!leaderboard) return [];

  return leaderboard.map((entry, index) => ({
    rank: index + 1,
    user_name: entry.username,
    xp_points: entry.xp_points,
    level: entry.current_level
  }));
};

export const fetchLeaderboard = async () => {
  const leaderboard = await leaderboardService.getGlobalLeaderboard();
  return format(leaderboard);
};

export const fetchMonthlyLeaderboard = async () => {
  const leaderboard = await leaderboardService.getMonthlyLeaderboard();
  return format(leaderboard);
};

export const fetchWeeklyLeaderboard = async () => {
  const leaderboard = await leaderboardService.getWeeklyLeaderboard();
  return format(leaderboard);
};

export const fetchLeaderboardByCategory = async (category_id) => {
  const leaderboard = await leaderboardService.getLeaderboardByCategory(category_id);
  return format(leaderboard);
};