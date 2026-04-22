import db from '../../config/db.js';

class SessionRepository {

    // ==========================
    // 📌 Get active session
    // ==========================
    getActiveSession = (learner_id, challenge_id) => {
        return db('challenge_session')
            .where({ learner_id, challenge_id })
            .whereNull('ended_at')
            .first();
    };


    // ==========================
    // 📌 Create session
    // ==========================
    createSession = (data) => {
        return db('challenge_session')
            .insert(data)
            .returning('*');
    };


    // ==========================
    // 📌 Get session by ID
    // ==========================
    getSessionById = (session_id) => {
        return db('challenge_session')
            .where({ session_id })
            .first();
    };


    // ==========================
    // 📌 Update session
    // ==========================
    updateSession = (session_id, data) => {
        return db('challenge_session')
            .where({ session_id })
            .update(data)
            .returning('*');
    };


    // ==========================
    // 📌 End session
    // ==========================
    endSession = (session_id) => {
        return db('challenge_session')
            .where({ session_id })
            .update({
                ended_at: new Date()
            })
            .returning('*');
    };
}

export default new SessionRepository();