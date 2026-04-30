import { v4 as uuid }        from 'uuid';
import { success, error }     from '../../utils/response.js';
import * as challengeQ        from '../challenge/challenge.queries.js';
import sessionQ               from './session.queries.js';

// ── durée max par difficulté (en secondes) ────────────────────────────────────
const DURATION_BY_DIFFICULTY = {
  easy   : 30 * 60,   // 30 min
  medium : 60 * 60,   // 60 min
  hard   : 90 * 60,   // 90 min
};

const DEFAULT_DURATION = 60 * 60; // fallback 60 min


export const startSession = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId          = req.user.userId;

    // 🔎 1. check challenge exists
    const challenge = await challengeQ.getById(challengeId);
    if (!challenge) {
      return error(res, 'Challenge not found', 404);
    }

    // 🔐 2. learners voient uniquement les challenges approuvés
    if (req.user.role === 'learner' && challenge.status !== 'approved') {
      return error(res, 'Challenge not available', 403);
    }

    // 🔄 3. session active existante → la renvoyer avec le temps restant
    const existing = await sessionQ.getActiveSession(userId, challengeId);
    if (existing) {
      const duration    = DURATION_BY_DIFFICULTY[challenge.difficulty] ?? DEFAULT_DURATION;
      const elapsed     = Math.floor((Date.now() - new Date(existing.started_at).getTime()) / 1000);
      const timeLeft    = Math.max(0, duration - elapsed);

      // si le temps est déjà écoulé → on clôture automatiquement
      if (timeLeft === 0) {
        await sessionQ.updateSession(existing.session_id, { ended_at: new Date() });
        return error(res, 'Session expired', 410);
      }

      return success(res, {
        ...existing,
        duration,
        time_left : timeLeft,
      });
    }

    // ➕ 4. créer une nouvelle session
    const duration  = DURATION_BY_DIFFICULTY[challenge.difficulty] ?? DEFAULT_DURATION;
    const startedAt = new Date();

    const [session] = await sessionQ.createSession({
      session_id   : uuid(),
      learner_id   : userId,
      challenge_id : challengeId,
      attempt_count: 0,
      started_at   : startedAt,
    });

    return success(res, {
      ...session,
      duration,                        // durée totale en secondes
      time_left : duration,            // temps restant (= durée au départ)
    }, 201);

  } catch (err) {
    return error(res, err.message, 500);
  }
};


export const abandonSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId ?? req.params.id;
    const userId    = req.user.userId;

    const session = await sessionQ.getSessionById(sessionId);
    if (!session) {
      return error(res, 'Session not found', 404);
    }

    if (session.learner_id !== userId && req.user.role !== 'admin') {
      return error(res, 'Not allowed', 403);
    }

    if (session.ended_at) {
      return error(res, 'Session already ended', 400);
    }

    const [updated] = await sessionQ.updateSession(sessionId, {
      ended_at: new Date()
    });

    return success(res, updated);

  } catch (err) {
    return error(res, err.message, 500);
  }
};