import api from './axios.js';

// POST /learner/submissions
export const submitFlag = (session_id, answer) =>
  api.post('/learner/submissions', { session_id, answer });