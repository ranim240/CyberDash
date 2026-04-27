import { useEffect, useState } from "react";
import {
  getLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getCategoryLeaderboard,
} from "../api/leaderboard";

export default function useLeaderboard(type, categoryId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let request;

    if (type === "weekly") request = getWeeklyLeaderboard();
    else if (type === "monthly") request = getMonthlyLeaderboard();
    else if (type === "category") request = getCategoryLeaderboard(categoryId);
    else request = getLeaderboard();

    request
      .then((res) => {
        // Handle both direct array response and nested data response
        const leaderboardData = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setData(leaderboardData);
      })
      .catch((err) => {
        console.error("Failed to fetch leaderboard:", err);
        setError(err.response?.data?.message || "Failed to load leaderboard. Please try again.");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [type, categoryId]);

  return { data, loading, error };
}