import { v4 as uuid } from 'uuid';
import { success, error } from '../../utils/response.js';
import Course from './course.queries.js';

// Get all published courses : Accessible by anyone (visitors, learners, instructors)
export const getAll = async (req, res, next) => {
    try {
        const courses = await Course.getAllPublished();
        return success(res, courses);
    } catch (err) {
        next(err);
    }
};

// Get course details by ID : Accessible by anyone
export const getOne = async (req, res, next) => {
    try {
        const course = await Course.getById(req.params.id);
        if (!course) {
            return error(res, 'Course not found', 404);
        }
        return success(res, course);
    } catch (err) {
        next(err);
    }
};

// Create a new course : Only instructors can create courses
export const createCourse = async (req, res, next) => {
    try {
        const { title, description, estimated_duration, level } = req.body;

        // Sanitize input and verify mandatory fields
        const [course] = await Course.create({
            course_id: uuid(),
            title,
            description,
            estimated_duration,
            level,
            instructor_id: req.user.userId // Linked to logged-in instructor
        });

        return success(res, course, 201);
    } catch (err) {
        next(err);
    }
};

// Update course metadata : Only the course owner can perform this action
export const updateCourse = async (req, res, next) => {
    try {
        const isOwner = await Course.isOwner(req.user.userId, req.params.id);
        if (!isOwner) {
            return error(res, 'You do not own this course', 403);
        }

        const { title, description, estimated_duration, level } = req.body;
        const [course] = await Course.update(req.params.id, { title, description, estimated_duration, level });

        if (!course) {
            return error(res, 'Course not found', 404);
        }
        return success(res, course);
    } catch (err) {
        next(err);
    }
};

// Delete a course permanently : Only the owner can delete their course
export const deleteCourse = async (req, res, next) => {
    try {
        const isOwner = await Course.isOwner(req.user.userId, req.params.id);
        if (!isOwner) {
            return error(res, 'You do not own this course', 403);
        }

        await Course.remove(req.params.id);
        return success(res, { message: 'Course deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// Mark a course as published (visible to visitors)
export const publishCourse = async (req, res, next) => {
    try {
        const isOwner = await Course.isOwner(req.user.userId, req.params.id);
        if (!isOwner) {
            return error(res, 'You do not own this course', 403);
        }

        await Course.setPublished(req.params.id, true);
        return success(res, { message: 'Course published' });
    } catch (err) {
        next(err);
    }
};

// Unpublish a course (hide from visitors)
export const unpublishCourse = async (req, res, next) => {
    try {
        const isOwner = await Course.isOwner(req.user.userId, req.params.id);
        if (!isOwner) {
            return error(res, 'You do not own this course', 403);
        }

        await Course.setPublished(req.params.id, false);
        return success(res, { message: 'Course unpublished' });
    } catch (err) {
        next(err);
    }
};

// Get internal course contents (videos, lessons, etc.)
export const getContents = async (req, res, next) => {
    try {
        // Handling for Learners
        if (req.user.role === 'learner') {
            const enrolled = await Course.checkEnrollment(req.user.userId, req.params.id);
            if (!enrolled) {
                return error(res, 'You must be enrolled to access this content', 403);
            }
            // Return only published content for learners
            return success(res, await Course.getContents(req.params.id, true));
        }

        // Handling for Instructors
        if (req.user.role === 'instructor') {
            const isOwner = await Course.isOwner(req.user.userId, req.params.id);
            if (!isOwner) {
                return error(res, 'You must be the owner to access all contents', 403);
            }
            // Return everything (including drafts) for owners
            return success(res, await Course.getContents(req.params.id));
        }

        return error(res, 'Unauthorized role', 403);
    } catch (err) {
        next(err);
    }
};

// Add content to a course :Accessible only by the owner
export const addContent = async (req, res, next) => {
    try {
        const isOwner = await Course.isOwner(req.user.userId, req.params.id);
        if (!isOwner) {
            return error(res, 'You do not own this course', 403);
        }

        const { title, data, is_published } = req.body;
        const [content] = await Course.addContent({
            content_id: uuid(),
            course_id: req.params.id,
            title,
            data,
            is_published: is_published || false
        });

        return success(res, content, 201);
    } catch (err) {
        next(err);
    }
};

export default {
    getAll,
    getOne,
    createCourse,
    updateCourse,
    deleteCourse,
    publishCourse,
    unpublishCourse,
    getContents,
    addContent
};