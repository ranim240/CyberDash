import api from './axios.js';

// ── Learner ───────────────────────────────────────────────────────────────────

// GET /challenges/active  → tous les challenges approuvés
export const getActiveChallenges = () =>
  api.get('/challenges/active');

// GET /challenges/search?difficulty=&category_id=&minPoints=&maxPoints=&sortBy=&order=&page=&limit=
export const searchChallenges = (params = {}) =>
  api.get('/challenges/search', { params });

// GET /challenges/:id  → détail d'un challenge
export const getChallengeById = (id) =>
  api.get(`/challenges/${id}`);

// GET /challenges/:id/files
export const getChallengeFiles = (id) =>
  api.get(`/challenges/${id}/files`);

// GET /challenges/:id/badges
export const getChallengeBadges = (id) =>
  api.get(`/challenges/${id}/badges`);