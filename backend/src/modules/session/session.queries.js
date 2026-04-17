import db from '../../config/db.js';

class SessionRepository {
    // Fetch all active sessions for a specific learner and challenge
    getActiveSessions = (learner_id, challenge_id) => {
        db('challenge_session')
.where({ learner_id, challenge_id })
.whereNull('ended_at').first();
    };

    // Create a new session record
    createSession = (data) => {
        return db('challenge_session').insert(data).returning('*');
    };

    getSessionById = (session_id) => {
        return db('challenge_session').where({ session_id }).first();
    };
    // Update an existing session record
    updateSession = (session_id, data) => {
        return db('challenge_session').where({ session_id }).update(data).returning('*');
    };
    // End a session by setting the ended_at timestamp
    endSession = (session_id) => {
        return db('challenge_session')
            .where({ session_id })
            .update({ ended_at: new Date() });
    };
}

export default new SessionRepository();





