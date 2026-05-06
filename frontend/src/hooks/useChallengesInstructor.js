import { useState, useEffect } from 'react';
import challengesApi from '../api/challenges';

const MOCK_CHALLENGES = [
  { challenge_id: 'ch-001', title: 'SQL Injection 101',       difficulty: 'easy',   points: 100, status: 'active',  created_at: '2024-11-10T08:00:00Z' },
  { challenge_id: 'ch-002', title: 'XSS Filter Bypass',       difficulty: 'medium', points: 250, status: 'active',  created_at: '2024-12-01T10:30:00Z' },
  { challenge_id: 'ch-003', title: 'Buffer Overflow Basics',  difficulty: 'hard',   points: 500, status: 'pending', created_at: '2025-01-15T14:00:00Z' },
  { challenge_id: 'ch-004', title: 'JWT Token Forgery',       difficulty: 'medium', points: 300, status: 'active',  created_at: '2025-02-20T09:00:00Z' },
  { challenge_id: 'ch-005', title: 'Blind SSRF Exploitation', difficulty: 'hard',   points: 600, status: 'pending', created_at: '2025-03-05T11:00:00Z' },
];

export function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [usingMock, setUsingMock]   = useState(false);

  useEffect(() => {
    challengesApi.getMine()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        if (data.length === 0) { setChallenges(MOCK_CHALLENGES); setUsingMock(true); }
        else setChallenges(data);
      })
      .catch(() => {
  setChallenges(MOCK_CHALLENGES);
  setUsingMock(true);
  // do NOT call setError here — mock fallback handles it
})
      .finally(() => setLoading(false));
  }, []);

  return { challenges, setChallenges, loading, usingMock };
}