import db from '../../config/db.js';
export const create = (data) => db('challenge_sessions').insert(data).returning('*');
export const getById = (session_id) =>
db('challenge_sessions').where({ session_id }).first();
export const updateSession = (session_id, data) =>
db('challenge_sessions').where({ session_id }).update(data);
export const getActive = (learner_id, challenge_id) =>
db('challenge_sessions')
.where({ learner_id, challenge_id })
.whereNull('ended_at').first();
