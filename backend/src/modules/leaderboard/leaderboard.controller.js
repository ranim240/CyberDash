import { fetchLeaderboard } from "./leaderboard.service.js";

const getLeaderboard = async(req,res)=> {
    const leaderboard = await fetchLeaderboard();
    console.log(leaderboard);
    return res.json(leaderboard);
}
export default getLeaderboard;
