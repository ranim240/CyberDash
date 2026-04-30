import api from './axios';

const enrollmentApi = {
  // Get all enrollments for the logged-in learner
  getMyEnrollments: () => api.get('/learner/enrollments'),

  // Enroll in a course
  enroll: (courseId) => api.post(`/learner/courses/${courseId}/enroll`),

  // Unenroll from a course
  unenroll: (courseId) => api.delete(`/learner/courses/${courseId}/enroll`),

  // Get progress for a specific course
  getProgress: (courseId) => api.get(`/learner/courses/${courseId}/progress`),

  // Update progress
  updateProgress: (courseId, data) => api.put(`/learner/courses/${courseId}/progress`, data),
};

export default enrollmentApi;