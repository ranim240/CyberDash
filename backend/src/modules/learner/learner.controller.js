import { v4 as uuid } from 'uuid';
import { success, error } from '../../utils/response.js';
import * as q from './learner.queries.js';
export const getDashboard = async (req, res) => {
    try {
        const profile = await q.getLearnerProfile(req.user.userId);
        const badges = await q.getLearnerBadges(req.user.userId);
        return success(res, { profile, recentBadges: badges.slice(0, 5) });
    } catch (err) { return error(res, err.message, 500); }
};
export const getProfile = async (req, res) => {
    try { return success(res, await q.getLearnerProfile(req.user.userId)); }
    catch (err) { return error(res, err.message, 500); }
};
export const getBadges = async (req, res) => {
    try { return success(res, await q.getLearnerBadges(req.user.userId)); }
    catch (err) { return error(res, err.message, 500); }
};
export const getEnrollments = async (req, res) => {
    try { return success(res, await q.getEnrollments(req.user.userId)); }
    catch (err) { return error(res, err.message, 500); }
};
export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const already = await q.isEnrolled(req.user.userId, courseId);
        if (already) return error(res, 'Deja inscrit a ce cours');
        await q.enroll({ id: uuid(), learner_id: req.user.userId, course_id: courseId });
        return success(res, { message: 'Inscription reussie' }, 201);
    } catch (err) { return error(res, err.message, 500); }
};