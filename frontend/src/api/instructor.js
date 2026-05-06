import api from './axios';

const instructorApi = {
  // ── Courses ──────────────────────────────────────────────
  getMyProfile:     ()                    => api.get('instructor/profile/profile'),
  getEngagedlearners: () => api.get('/instructor/engaged-learners'),
};

export default instructorApi;