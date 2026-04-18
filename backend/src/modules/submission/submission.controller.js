// submission.controller.js — verifie le flag
export const submitFlag = async (req, res) => {
try {
const { session_id, answer } = req.body;
const session = await sessionQ.getById(session_id);
if (!session) return error(res, 'Session introuvable', 404);
const challenge = await challengeQ.getById(session.challenge_id);
const is_correct = challenge.flag === answer;
const [submission] = await q.create({
submission_id: uuid(), session_id, answer, is_correct
});
// Met a jour XP si correct
if (is_correct) {
await db('learners')
.where({ user_id: req.user.userId })
.increment('xp_points', challenge.points);
await sessionQ.updateSession(session_id, { ended_at: new Date() });
}
return success(res, { submission, is_correct, points: is_correct ? challenge.points : 0 });
} catch (err) { return error(res, err.message, 500); }
};