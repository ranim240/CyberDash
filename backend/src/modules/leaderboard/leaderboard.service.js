import { getLeaderboard } from "../learner/learner.queries.js";

export const fetchLeaderboard = async () => {
    const leaderboard = await getLeaderboard();
    const data = leaderboard.map((entry, index) => ({
        rank: index + 1,
        user_name: entry.username,
        xp_points: entry.xp_points,
        level: entry.current_level
    }));
    
    return data;
}