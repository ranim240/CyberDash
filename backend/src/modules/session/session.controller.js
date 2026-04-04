export const startSession = async (req, res) => {
try {
const { challengeId } = req.params;
const existing = await q.getActive(req.user.userId, challengeId);
if (existing) return success(res, existing); // retourne la session existante
const [session] = await q.create({
session_id: uuid(), learner_id: req.user.userId,
challenge_id: challengeId, attempt_count: 1
});
return success(res, session, 201);
} catch (err) { return error(res, err.message, 500); }
};
export const abandonSession = async (req, res) => {
try {
await q.updateSession(req.params.id, { ended_at: new Date() });
return success(res, { message: 'Session abandonnee' });
} catch (err) { return error(res, err.message, 500); }
};