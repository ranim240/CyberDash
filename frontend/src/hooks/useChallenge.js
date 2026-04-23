import { useState, useEffect } from 'react';
import api from '../services/api';

export function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    api.get('/challenges/myChallenges')
      .then((res) => setChallenges(res.data.data))
      .finally(() => setLoading(false))
      .catch((err) => setError(err.message));
  }, []);

  return { challenges, loading, error };
}