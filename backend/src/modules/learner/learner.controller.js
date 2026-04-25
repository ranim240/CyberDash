import { success, error } from '../../utils/response.js';
import Learner from './learner.queries.js';
import { validateUpdateProgress } from './learner.validation.js';


// ==========================
// 📊 DASHBOARD
// ==========================
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const profile = await Learner.getLearnerProfile(userId);
    if (!profile) {
      return error(res, 'Learner not found', 404);
    }

    // ✅ tout en parallèle pour minimiser la latence
    const [badges, stats, enrollments, recentSessions] = await Promise.all([
      Learner.getLearnerBadges(userId),
      Learner.getStats(userId),
      Learner.getEnrollments(userId),
      Learner.getRecentSessions(userId, 5),
    ]);

    return success(res, {
      profile,
      stats,
      recentBadges   : badges.slice(0, 5),  // 5 derniers badges
      enrollments,                           // [ { course_id, title, description, enrolled_at, completion_status } ]
      recentSessions,                        // [ { session_id, challenge_id, challenge_title, difficulty, points, started_at, ended_at, attempt_count, status } ]
    });

  } catch (err) {
    next(err);
  }
};


// ==========================
// 👤 PROFILE
// ==========================
export const getProfile = async (req, res, next) => {
  try {
    const profile = await Learner.getLearnerProfile(req.user.userId);

    if (!profile) {
      return error(res, 'Learner not found', 404);
    }

    return success(res, profile);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 🏅 BADGES
// ==========================
export const getBadges = async (req, res, next) => {
  try {
    const badges = await Learner.getLearnerBadges(req.user.userId);
    return success(res, badges);
  } catch (err) {
    next(err);
  }
};


// ==========================
// 📚 ENROLLMENTS
// ==========================
export const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Learner.getEnrollments(req.user.userId);
    return success(res, enrollments);
  } catch (err) {
    next(err);
  }
};


// ==========================
// ➕ ENROLL COURSE
// ==========================
export const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const existing = await Learner.isEnrolled(userId, courseId);

    if (existing) {
      return error(res, 'Already enrolled in this course', 400);
    }

    await Learner.enroll({
      learner_id: userId,
      course_id: courseId
    });

    return success(res, { message: 'Enrollment successful' }, 201);

  } catch (err) {
    next(err);
  }
};


// ==========================
// ➖ UNENROLL COURSE
// ==========================
export const unenrollCourse = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const enrollment = await Learner.isEnrolled(userId, courseId);

    if (!enrollment) {
      return error(res, 'You are not enrolled in this course', 400);
    }

    await Learner.unenroll(userId, courseId);

    return success(res, { message: 'Successfully unenrolled' });

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📈 UPDATE PROGRESS
// ==========================
export const updateProgress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const errors = validateUpdateProgress(req.body);
    if (errors.length > 0) {
      return error(res, errors, 400);
    }

    const enrollment = await Learner.isEnrolled(userId, courseId);

    if (!enrollment) {
      return error(res, 'You are not enrolled in this course', 400);
    }

    if (enrollment.completion_status === 'completed') {
      return error(res, 'Course already completed', 400);
    }

    await Learner.updateProgress(
      userId,
      courseId,
      req.body.completion_status
    );

    return success(res, { message: 'Progress updated successfully' });

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📊 GET PROGRESS
// ==========================
export const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const progress = await Learner.getProgress(userId, courseId);

    if (!progress) {
      return error(res, 'You are not enrolled in this course', 404);
    }

    return success(res, progress);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📊 STATS
// ==========================
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const stats = await Learner.getStats(userId);

    return success(res, stats);
  } catch (err) {
    next(err);
  }
};


export default {
  getDashboard,
  getProfile,
  getBadges,
  getEnrollments,
  enrollCourse,
  unenrollCourse,
  updateProgress,
  getProgress,
  getStats,
};