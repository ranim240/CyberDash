export const startSession = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.userId;

    // 🔎 1. check challenge exists
    const challenge = await q.getChallengeById(challengeId);
    if (!challenge) {
      return error(res, "Challenge not found", 404);
    }

    // 🔐 2. allow only approved challenges for learners
    if (req.user.role === "learner" && challenge.status !== "approved") {
      return error(res, "Challenge not available", 403);
    }

    // 🔄 3. check existing active session
    const existing = await q.getActiveSession(userId, challengeId);

    if (existing) {
      return success(res, existing);
    }

    // ➕ 4. create session
    const [session] = await q.createSession({
      session_id: uuid(),
      learner_id: userId,
      challenge_id: challengeId,
      attempt_count: 1,
      started_at: new Date()
    });

    return success(res, session, "Session started", null, 201);

  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const abandonSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.userId;

    // 🔎 check session belongs to user
    const session = await q.getSessionById(sessionId);

    if (!session) {
      return error(res, "Session not found", 404);
    }

    if (session.learner_id !== userId && req.user.role !== "admin") {
      return error(res, "Not allowed", 403);
    }

    // ⛔ close session
    const updated = await q.updateSession(sessionId, {
      ended_at: new Date()
    });

    return success(res, updated, "Session abandoned");

  } catch (err) {
    return error(res, err.message, 500);
  }
};