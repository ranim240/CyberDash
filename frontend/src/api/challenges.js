import api from './axios.js';

// ─── Learner / Public ─────────────────────────────────────────────────────────

// GET /api/challenges/active
export const getActiveChallenges = () =>
  api.get('/challenges/active');

// GET /api/challenges/search?difficulty=&category_id=&minPoints=&maxPoints=&sortBy=&order=&page=&limit=
export const searchChallenges = (params = {}) =>
  api.get('/challenges/search', { params });

// GET /api/challenges/:id
export const getChallengeById = (id) =>
  api.get(`/challenges/${id}`);

// GET /api/challenges/:id/files
export const getChallengeFiles = (id) =>
  api.get(`/challenges/${id}/files`);

// GET /api/challenges/:id/badges
export const getChallengeBadges = (id) =>
  api.get(`/challenges/${id}/badges`);