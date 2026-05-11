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

// Import level calculation
import { getLevelFromXP } from '../learner/learner.queries.js';


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

    // 🎯 8. If correct → check if challenge already solved, then add XP + end session + update stats
    if (is_correct) {
      // Check if this challenge was already solved by this learner
      const [alreadySolved] = await db('submission as s')
        .join('challenge_session as cs', 'cs.session_id', 's.session_id')
        .where({
          'cs.learner_id': userId,
          'cs.challenge_id': session.challenge_id,
          's.is_correct': true
        })
        .count('s.submission_id as count');

      const hasAlreadySolved = Number(alreadySolved.count || 0) > 1; // > 1 because current submission is already created

      if (!hasAlreadySolved) {
        pointsEarned = challenge.points;

        // Increment XP and solved_challenges
        await db('learner')
          .where({ user_id: userId })
          .increment('xp_points', pointsEarned);

        await db('learner')
          .where({ user_id: userId })
          .increment('solved_challenges', 1);

        // Add to XP history
        await db('xp_history').insert({
          id: uuid(),
          user_id: userId,
          challenge_id: session.challenge_id,
          xp: pointsEarned,
          created_at: new Date()
        });

        // Calculate new level
        const learner = await db('learner')
          .where({ user_id: userId })
          .select('xp_points', 'current_level')
          .first();

        // Calculate new level
        const newLevel = getLevelFromXP(learner.xp_points);

        // Update level if changed
        if (newLevel > learner.current_level) {
          await db('learner')
            .where({ user_id: userId })
            .update({ current_level: newLevel });
        }
      }

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