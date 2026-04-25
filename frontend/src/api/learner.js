import api from './axios.js';

export const getDashboard = () => api.get('/learner/dashboard');
export const getStats = () => api.get('/learner/stats');
export const getProfile = () => api.get('/learner/profile');
export const getBadges = () => api.get('/learner/badges');
export const getEnrollments = () => api.get('/learner/enrollments');
export const enrollCourse = (courseId) => api.post(`/learner/courses/${courseId}/enroll`);
export const unenrollCourse = (courseId) => api.delete(`/learner/courses/${courseId}/enroll`);
export const getProgress = (courseId) => api.get(`/learner/courses/${courseId}/progress`);
export const updateProgress = (courseId, data) => api.put(`/learner/courses/${courseId}/progress`, data);