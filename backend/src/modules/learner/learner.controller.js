import { v4 as uuid } from 'uuid';
import { success, error } from '../../utils/response.js';
import learnerRepository from './learner.queries.js';
import { validateUpdateProgress } from './learner.validation.js';

class LearnerController {
    // Get learner's dashboard information : Shows profile and recent badges
    getDashboard = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const profile = await learnerRepository.getLearnerProfile(userId);
            const badges = await learnerRepository.getLearnerBadges(userId);

            return success(res, {
                profile,
                recentBadges: badges.slice(0, 5)
            });
        } catch (err) {
            next(err);
        }
    };

    // Get the full learner profile
    getProfile = async (req, res, next) => {
        try {
            const profile = await learnerRepository.getLearnerProfile(req.user.userId);
            return success(res, profile);
        } catch (err) {
            next(err);
        }
    };

    // Get all badges earned by the learner
    getBadges = async (req, res, next) => {
        try {
            const badges = await learnerRepository.getLearnerBadges(req.user.userId);
            return success(res, badges);
        } catch (err) {
            next(err);
        }
    };

    // Get all courses the learner is currently enrolled in
    getEnrollments = async (req, res, next) => {
        try {
            const enrollments = await learnerRepository.getEnrollments(req.user.userId);
            return success(res, enrollments);
        } catch (err) {
            next(err);
        }
    };

    // Enroll a learner in a course
    enrollCourse = async (req, res, next) => {
        try {
            const { courseId } = req.params;
            const userId = req.user.userId;

            // Check if already enrolled
            const already = await learnerRepository.isEnrolled(userId, courseId);
            if (already) {
                return error(res, 'Already enrolled in this course', 400);
            }

            // Perform enrollment
            await learnerRepository.enroll({
                learner_id: userId,
                course_id: courseId
            });

            return success(res, { message: 'Enrollment successful' }, 201);
        } catch (err) {
            next(err);
        }
    };

    // Unenroll from a specific course
    unenrollCourse = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const courseId = req.params.courseId;

            // Verify that the learner is actually registered before unenrolling
            const enrolled = await learnerRepository.isEnrolled(userId, courseId);
            if (!enrolled) {
                return error(res, 'You are not enrolled in this course', 400);
            }

            await learnerRepository.unenroll(userId, courseId);
            return success(res, { message: 'Successfully unenrolled' });
        } catch (err) {
            next(err);
        }
    };

    // Update the learner's progress in a specific course
    updateProgress = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const courseId = req.params.courseId;

            // 1. Validate data
            const { errors } = validateUpdateProgress(req.body);
            if (errors.length > 0) {
                return res.status(400).json({ success: false, errors });
            }

            // 2. Verify enrollment
            const enrolled = await learnerRepository.isEnrolled(userId, courseId);
            if (!enrolled) {
                return error(res, 'You are not enrolled in this course', 400);
            }

            // 3. Prevent updates if the course is already completed (prevents rolling back status)
            if (enrolled.completion_status === 'completed') {
                return error(res, 'Course is already completed', 400);
            }

            // 4. Update the progress in the database
            await learnerRepository.updateProgress(userId, courseId, req.body.completion_status);
            return success(res, { message: 'Progress updated successfully' });
        } catch (err) {
            next(err);
        }
    };

    // Get detailed progress for a specific course
    getProgress = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const courseId = req.params.courseId;

            const progress = await learnerRepository.getProgress(userId, courseId);
            if (!progress) {
                return error(res, 'You are not enrolled in this course', 404);
            }

            return success(res, progress);
        } catch (err) {
            next(err);
        }
    };
}

export default new LearnerController();