import api from './axios';
export const getChallenges = () => api.get('/challenges/active');
const challengesApi = {
  // ── Public / Learner ─────────────────────────────────────
  
  getAll:          ()                => api.get('/challenges'),
  getActive:       ()                => api.get('/challenges/active'),
  search:          (params)          => api.get('/challenges/search', { params }),
  getOne:          (id)              => api.get(`/challenges/${id}`),
  getFiles:        (id)              => api.get(`/challenge-files/challenge/${id}`),
  getBadges:       (id)              => api.get(`/challenges/${id}/badges`),

  // ── Instructor ────────────────────────────────────────────
  getMine:         ()                => api.get('/challenges/my'),
  create:          (data)            => api.post('/challenges/', data),
  update:          (id, data)        => api.put(`/challenges/${id}`, data),
  remove:          (id)              => api.delete(`/challenges/${id}`),
  uploadFile: (challengeId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('challenge_id', challengeId);
  
  return api.post('/challenge-files/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
},

deleteFile: (fileId) => api.delete(`/challenge-files/file/${fileId}`),

  // ── Admin ─────────────────────────────────────────────────
  getAllAdmin:      ()                => api.get('/all-challenges'),
  getPending:      ()                => api.get('/challenges/pending'),
  updateStatus:    (id, status)      => api.put(`/challenges/${id}/change-status`, { status }),
};

export default challengesApi;