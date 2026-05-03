import api from './axios';

const coursesApi = {
  // ── Courses ──────────────────────────────────────────────
  getAll:     ()                    => api.get('/courses'),
  getMyCourses: () => api.get('/courses/my-courses/'),
  getOne:     (courseId)            => api.get(`/courses/${courseId}`),
  create:     (data)                => api.post('/courses', data),
  update:     (courseId, data)      => api.put(`/courses/${courseId}`, data),
  remove:     (courseId)            => api.delete(`/courses/${courseId}`),
  togglePublish: (courseId)         => api.patch(`/courses/${courseId}/publish`),

  // ── Contents ─────────────────────────────────────────────
  getContents:   (courseId)                    => api.get(`/courses/${courseId}/contents`),
  addContent:    (courseId, data)              => api.post(`/courses/${courseId}/contents`, data),
  updateContent: (courseId, contentId, data)   => api.put(`/courses/${courseId}/contents/${contentId}`, data),
  removeContent: (courseId, contentId)         => api.delete(`/courses/${courseId}/contents/${contentId}`),
};

export default coursesApi;