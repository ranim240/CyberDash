import db from '../../config/db.js';

// ── Chat Sessions ──
export const createSession = (data) =>
  db('chat_session').insert(data).returning('*');

export const getSessionById = (sessionId) =>
  db('chat_session').where({ session_id: sessionId }).first();

export const getSessionsByLearner = (learnerId) =>
  db('chat_session').where({ learner_id: learnerId }).orderBy('started_at', 'desc');

export const endSession = (sessionId) =>
  db('chat_session').where({ session_id: sessionId }).update({ ended_at: new Date() });

// ── Chat Messages ──
export const addMessage = (data) =>
  db('chat_message').insert(data).returning('*');

export const getMessagesBySession = (sessionId) =>
  db('chat_message').where({ session_id: sessionId }).orderBy('created_at', 'asc');
