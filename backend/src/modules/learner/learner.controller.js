import { v4 as uuid } from 'uuid';
import { success, error } from '../../utils/response.js';
import Learner from './learner.queries.js';
import { validateUpdateProgress } from './learner.validation.js';

// Get learner's dashboard information : Shows profile and recent badges
export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profile = await Learner.getLearnerProfile(userId);
        const badges = await Learner.getLearnerBadges(userId);

        return success(res, {
            profile,
            recentBadges: badges.slice(0, 5)
        });
    } catch (err) {
        next(err);
    }
};

// Get the full learner profile
export const getProfile = async (req, res, next) => {
    try {
        const profile = await Learner.getLearnerProfile(req.user.userId);
        return success(res, profile);
    } catch (err) {
        next(err);
    }
};

// Get all badges earned by the learner
export const getBadges = async (req, res, next) => {
    try {
        const badges = await Learner.getLearnerBadges(req.user.userId);
        return success(res, badges);
    } catch (err) {
        next(err);
    }
};

// Get all courses the learner is currently enrolled in
export const getEnrollments = async (req, res, next) => {
    try {
        const enrollments = await Learner.getEnrollments(req.user.userId);
        return success(res, enrollments);
    } catch (err) {
        next(err);
    }
};

// Enroll a learner in a course
export const enrollCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.userId;

        // Check if already enrolled
        const already = await Learner.isEnrolled(userId, courseId);
        if (already) {
            return error(res, 'Already enrolled in this course', 400);
        }

        // Perform enrollment
        await Learner.enroll({
            learner_id: userId,
            course_id: courseId
        });

        return success(res, { message: 'Enrollment successful' }, 201);
    } catch (err) {
        next(err);
    }
};

// Unenroll from a specific course
export const unenrollCourse = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const courseId = req.params.courseId;

        // Verify that the learner is actually registered before unenrolling
        const enrolled = await Learner.isEnrolled(userId, courseId);
        if (!enrolled) {
            return error(res, 'You are not enrolled in this course', 400);
        }

        await Learner.unenroll(userId, courseId);
        return success(res, { message: 'Successfully unenrolled' });
    } catch (err) {
        next(err);
    }
};

// Update the learner's progress in a specific course
export const updateProgress = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const courseId = req.params.courseId;

        // 1. Validate data
        const { errors } = validateUpdateProgress(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        // 2. Verify enrollment
        const enrolled = await Learner.isEnrolled(userId, courseId);
        if (!enrolled) {
            return error(res, 'You are not enrolled in this course', 400);
        }

        // 3. Prevent updates if the course is already completed (prevents rolling back status)
        if (enrolled.completion_status === 'completed') {
            return error(res, 'Course is already completed', 400);
        }

        // 4. Update the progress in the database
        await Learner.updateProgress(userId, courseId, req.body.completion_status);
        return success(res, { message: 'Progress updated successfully' });
    } catch (err) {
        next(err);
    }
};

// Get detailed progress for a specific course
export const getProgress = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const courseId = req.params.courseId;

        const progress = await Learner.getProgress(userId, courseId);
        if (!progress) {
            return error(res, 'You are not enrolled in this course', 404);
        }

        return success(res, progress);
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
    getProgress
};