import { useState, useEffect, useCallback, useRef } from 'react';
import { getChallengeById }  from '../api/challenges.js';
import { abandonSession }    from '../api/sessions.js';
import { submitFlag }        from '../api/submissions.js';

export function useSession(sessionId, challengeId, initialTimeLeft = null) {
  const [challenge,   setChallenge]   = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // timer
  const [timeLeft,    setTimeLeft]    = useState(initialTimeLeft); // secondes restantes
  const [duration,    setDuration]    = useState(null);            // durée totale
  const timerRef = useRef(null);

  // soumission
  const [answer,      setAnswer]      = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [result,      setResult]      = useState(null);   // { is_correct, points, badges }
  const [submitError, setSubmitError] = useState(null);
  const [attempts,    setAttempts]    = useState(0);

  // abandon
  const [abandoning,  setAbandoning]  = useState(false);
  const [abandoned,   setAbandoned]   = useState(false);
  const [expired,     setExpired]     = useState(false);

  // ── fetch challenge ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!challengeId) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await getChallengeById(challengeId);
        if (!cancelled) {
          const c = res.data?.data ?? res.data;
          setChallenge(c);
        }
      } catch (err) {
        if (!cancelled)
          setError(err?.response?.data?.message || 'Failed to load challenge');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [challengeId]);

  // ── initialiser timeLeft depuis initialTimeLeft prop ─────────────────────
  useEffect(() => {
    if (initialTimeLeft !== null) {
      setTimeLeft(initialTimeLeft);
    }
  }, [initialTimeLeft]);

  // ── timer countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    // ne démarre que si on a un timeLeft et que la session est active
    if (timeLeft === null || result?.is_correct || abandoned || expired) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // temps écoulé → abandon automatique
          setExpired(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft !== null, result?.is_correct, abandoned, expired]);

  // ── abandon automatique quand expired ────────────────────────────────────
  useEffect(() => {
    if (!expired || abandoned) return;

    abandonSession(sessionId).catch(() => {}).finally(() => {
      setAbandoned(true);
    });
  }, [expired]);

  // ── soumettre le flag ───────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!answer.trim() || submitting || result?.is_correct || expired) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const res  = await submitFlag(sessionId, answer.trim());
      const data = res.data?.data ?? res.data;

      setAttempts((a) => a + 1);
      setResult({
        is_correct : data.is_correct,
        points     : data.points,
        badges     : data.badges ?? [],   // badges éventuellement retournés
      });

      if (data.is_correct) {
        clearInterval(timerRef.current);
        setAnswer('');
      }
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [answer, sessionId, submitting, result, expired]);

  // ── abandon manuel ───────────────────────────────────────────────────────
  const handleAbandon = useCallback(async () => {
    if (abandoning || abandoned || result?.is_correct) return;

    try {
      setAbandoning(true);
      await abandonSession(sessionId);
      clearInterval(timerRef.current);
      setAbandoned(true);
    } catch {
      setAbandoned(true);
    } finally {
      setAbandoning(false);
    }
  }, [sessionId, abandoning, abandoned, result]);

  // pourcentage du timer pour la barre visuelle
  const timerPct = duration && timeLeft !== null
    ? Math.round((timeLeft / duration) * 100)
    : 100;

  return {
    challenge,
    loading,
    error,
    // timer
    timeLeft,
    setTimeLeft,
    duration,
    setDuration,
    timerPct,
    expired,
    // soumission
    answer, setAnswer,
    submitting,
    submitError,
    result,
    attempts,
    handleSubmit,
    // abandon
    abandoning,
    abandoned,
    handleAbandon,
  };
}