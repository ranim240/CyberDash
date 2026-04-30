import { useState, useEffect, useCallback } from 'react';
import { searchChallenges } from '../api/challenges.js';

const DEFAULT_FILTERS = {
  difficulty  : '',
  category_id : '',
  minPoints   : '',
  maxPoints   : '',
  sortBy      : 'created_at',
  order       : 'desc',
  page        : 1,
  limit       : 12,
  status      : 'approved',   // learners voient uniquement les challenges approuvés
};

export function useChallenges() {
  const [filters, setFilters]     = useState(DEFAULT_FILTERS);
  const [challenges, setChallenges] = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetch = useCallback(async (f) => {
    try {
      setLoading(true);
      setError(null);

      // on retire les valeurs vides pour ne pas polluer la query string
      const clean = Object.fromEntries(
        Object.entries(f).filter(([, v]) => v !== '' && v !== null)
      );

      const res = await searchChallenges(clean);
      // backend retourne { success: true, data: { data, total, page, limit } }
      const payload = res.data?.data ?? res.data ?? {};
      setChallenges(payload.data  ?? []);
      setTotal(payload.total      ?? 0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  }, []);

  // re-fetch à chaque changement de filtres
  useEffect(() => {
    fetch(filters);
  }, [filters, fetch]);

  // mise à jour d'un filtre + reset page à 1 (sauf si on change la page)
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]  : value,
      page   : key === 'page' ? value : 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const totalPages = Math.ceil(total / filters.limit);

  return {
    challenges,
    total,
    totalPages,
    filters,
    loading,
    error,
    updateFilter,
    resetFilters,
  };
}