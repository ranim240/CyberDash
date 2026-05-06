import { v4 as uuid }          from 'uuid';
import { success, error }       from '../../utils/response.js';
import db                       from '../../config/db.js';

// ✅ session.queries.js utilise export default new SessionRepository()
//    → import par défaut, PAS import *
import sessionQ                 from '../session/session.queries.js';

// ✅ challenge.queries.js utilise des named exports
//    → import * est correct
import * as challengeQ          from '../challenge/challenge.queries.js';

import submissionQ              from './submission.queries.js';


// ==========================
// 📌 SUBMIT FLAG
// ==========================
export const submitFlag = async (req, res) => {
  try {
    const { session_id, answer } = req.body;
    const userId = req.user.userId;

    // 🔎 1. Get session
    const session = await sessionQ.getSessionById(session_id);
    if (!session) {
      return error(res, 'Session introuvable', 404);
    }

    // 🔐 2. Ownership check
    if (session.learner_id !== userId) {
      return error(res, 'Not allowed', 403);
    }

    // ⛔ 3. Check session not ended
    if (session.ended_at) {
      return error(res, 'Session already ended', 400);
    }

    // 🔎 4. Get challenge
    const challenge = await challengeQ.getById(session.challenge_id);
    if (!challenge) {
      return error(res, 'Challenge introuvable', 404);
    }

    // 🧠 5. Normalize + compare flag
    const normalizedAnswer = answer.trim();
    const is_correct =
      challenge.flag.trim().toLowerCase() === normalizedAnswer.toLowerCase();

    // ➕ 6. Create submission
    const [submission] = await submissionQ.createSubmission({
      submission_id : uuid(),
      session_id,
      answer        : normalizedAnswer,
      is_correct
    });

    // 📊 7. Update attempt count
    await sessionQ.updateSession(session_id, {
      attempt_count: session.attempt_count + 1
    });

    let pointsEarned = 0;

    // 🎯 8. If correct → add XP + end session
    if (is_correct) {
      pointsEarned = challenge.points;

      await db('learner')
        .where({ user_id: userId })
        .increment('xp_points', pointsEarned);

      await sessionQ.updateSession(session_id, {
        ended_at: new Date()
      });
    }

    return success(res, {
      submission,
      is_correct,
      points: pointsEarned
    });

  } catch (err) {
    return error(res, err.message, 500);
  }
};