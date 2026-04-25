import api from './axios.js';

// POST /learner/challenges/:challengeId/start
export const startSession = (challengeId) =>
  api.post(`/learner/challenges/${challengeId}/start`);

// POST /learner/sessions/:sessionId/abandon
export const abandonSession = (sessionId) =>
  api.post(`/learner/sessions/${sessionId}/abandon`);