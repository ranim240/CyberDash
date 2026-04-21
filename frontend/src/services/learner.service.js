// src/services/learner.service.js
import api from './api.js';

const learnerService = {

  // ── GET /api/learner/dashboard ────────────────────────────────
  // Retourne : { profile: { xp_points, current_level, streak }, recentBadges: [] }
  getDashboard: () =>
    api.get('/learner/dashboard'),

  // ── GET /api/learner/profile ──────────────────────────────────
  // Retourne : { user_id, xp_points, current_level, streak }
  getProfile: () =>
    api.get('/learner/profile'),

  // ── GET /api/learner/badges ───────────────────────────────────
  // Retourne : [ { badge_id, name, description, icon_url, awarded_at } ]
  getBadges: () =>
    api.get('/learner/badges'),

  // ── GET /api/learner/enrollments ──────────────────────────────
  // Retourne : [ { course_id, title, description, level, enrolled_at, completion_status } ]
  getEnrollments: () =>
    api.get('/learner/enrollments'),

  // ── POST /api/learner/enroll/:courseId ────────────────────────
  // Params  : courseId (string)
  // Retourne : { message: "Inscription reussie" }
  enrollCourse: (courseId) =>
    api.post(`/learner/enroll/${courseId}`),

};

export default learnerService;