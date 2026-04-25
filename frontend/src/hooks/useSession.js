import { useState, useEffect, useCallback, useRef } from 'react';
import { getChallengeById } from '../api/challenges.js';
import { abandonSession } from '../api/sessions.js';
import { submitFlag }     from '../api/submissions.js';

export function useSession(sessionId, challengeId) {
  const [challenge,   setChallenge]   = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // soumission
  const [answer,      setAnswer]      = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [result,      setResult]      = useState(null);   // { is_correct, points }
  const [submitError, setSubmitError] = useState(null);
  const [attempts,    setAttempts]    = useState(0);

  // abandon
  const [abandoning,  setAbandoning]  = useState(false);
  const [abandoned,   setAbandoned]   = useState(false);

  // chrono (secondes écoulées depuis started_at)
  const [elapsed,     setElapsed]     = useState(0);
  const timerRef = useRef(null);

  // ── fetch challenge ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!challengeId) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await getChallengeById(challengeId);
        if (!cancelled) setChallenge(res.data?.data ?? res.data);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load challenge');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [challengeId]);

  // ── chrono ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // démarre le timer seulement si session active
    if (!sessionId || result?.is_correct || abandoned) return;

    timerRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [sessionId, result?.is_correct, abandoned]);

  // ── soumettre le flag ───────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!answer.trim() || submitting || result?.is_correct) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const res = await submitFlag(sessionId, answer.trim());
      const data = res.data?.data ?? res.data; // { submission, is_correct, points }

      setAttempts((a) => a + 1);
      setResult({ is_correct: data.is_correct, points: data.points });

      if (data.is_correct) {
        clearInterval(timerRef.current); // arrête le chrono
        setAnswer('');
      }
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [answer, sessionId, submitting, result]);

  // ── abandonner ──────────────────────────────────────────────────────────
  const handleAbandon = useCallback(async () => {
    if (abandoning || abandoned || result?.is_correct) return;

    try {
      setAbandoning(true);
      await abandonSession(sessionId);
      clearInterval(timerRef.current);
      setAbandoned(true);
    } catch (err) {
      // abandon non-bloquant
      console.error('Abandon failed', err);
      setAbandoned(true);
    } finally {
      setAbandoning(false);
    }
  }, [sessionId, abandoning, abandoned, result]);

  return {
    challenge,
    loading,
    error,
    // chrono
    elapsed,
    // soumission
    answer,
    setAnswer,
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