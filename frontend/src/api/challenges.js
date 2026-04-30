import api from './axios';
export const getChallenges = () => api.get('/challenges/active');
const challengesApi = {
  // ── Public / Learner ─────────────────────────────────────
  
  getAll:          ()                => api.get('/challenges'),
  getActive:       ()                => api.get('/challenges/active'),
  search:          (params)          => api.get('/challenges/search', { params }),
  getOne:          (id)              => api.get(`/challenges/challenges/${id}`),
  getFiles:        (id)              => api.get(`/challenges/challenges/${id}/files`),
  getBadges:       (id)              => api.get(`/challenges/${id}/badges`),

  // ── Instructor ────────────────────────────────────────────
  getMine:         ()                => api.get('/challenges/my-challenges'),
  create:          (data)            => api.post('/challenges', data),
  update:          (id, data)        => api.put(`/challenges/challenges/${id}`, data),
  remove:          (id)              => api.delete(`/challenges/challenges/${id}`),
  uploadFile:      (id, file)        => api.post(`/challenges/challenges/${id}/files`, file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // ── Admin ─────────────────────────────────────────────────
  getAllAdmin:      ()                => api.get('/all-challenges'),
  getPending:      ()                => api.get('/challenges/pending'),
  updateStatus:    (id, status)      => api.put(`/challenges/${id}/change-status`, { status }),
};

export default challengesApi;