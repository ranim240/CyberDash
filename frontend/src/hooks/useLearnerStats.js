import { useState, useEffect } from 'react';
import { getDashboard, getStats } from '../api/learner.js';

export function useLearnerStats() {
  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        const [dashRes, statsRes] = await Promise.all([
          getDashboard(),
          getStats(),
        ]);

        if (!cancelled) {
          // dashRes.data  → { profile, stats, recentBadges }
          // statsRes.data → { solved_challenges, total_submissions, success_rate,
          //                   xp_points, current_level, streak, title }
          setDashboard(dashRes.data);
          setStats(statsRes.data);
        }
      } catch (err) {
        if (!cancelled)
          setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { dashboard, stats, loading, error };
}