import { v4 as uuid } from 'uuid';
import { success, error } from '../../utils/response.js';
import Course from './course.queries.js';

// ================= GET ALL =================
export const getAll = async (req, res, next) => {
    try {
        const courses = await Course.getAllPublished();
        return success(res, courses);
    } catch (err) {
        next(err);
    }
};

// ================= GET ONE =================
export const getOne = async (req, res, next) => {
    try {
        const course = await Course.getById(req.params.id);
        if (!course) return error(res, 'Course not found', 404);

        return success(res, course);
    } catch (err) {
        next(err);
    }
};

// ================= CREATE =================
export const createCourse = async (req, res, next) => {
    try {
        const { title, description, estimated_duration, level } = req.body;

        // 🔥 basic validation
        if (!title || typeof title !== 'string') {
            return error(res, 'Title is required', 400);
        }

        const [course] = await Course.create({
            course_id: uuid(),
            title: title.trim(),
            description: description || null,
            estimated_duration: estimated_duration || null,
            level: level || 'beginner',
            instructor_id: req.user.userId
        });

        return success(res, course, 201);
    } catch (err) {
        next(err);
    }
};

// ================= UPDATE =================
export const updateCourse = async (req, res, next) => {
    try {
        const course = await Course.getById(req.params.id);
        if (!course) return error(res, 'Course not found', 404);

        const isOwner = await Course.isOwner(req.user.userId, req.params.id);
        if (!isOwner) return error(res, 'You do not own this course', 403);

        // 🔥 only update provided fields
        const updates = {};
        if (req.body.title) updates.title = req.body.title.trim();
        if (req.body.description) updates.description = req.body.description;
        if (req.body.estimated_duration) updates.estimated_duration = req.body.estimated_duration;
        if (req.body.level) updates.level = req.body.level;

        const [updated] = await Course.update(req.params.id, updates);

        return success(res, updated);
    } catch (err) {
        next(err);
    }
};

// ================= DELETE =================
export const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.getById(req.params.id);
        if (!course) return error(res, 'Course not found', 404);

        const isOwner = await Course.isOwner(req.user.userId, req.params.id);
        if (!isOwner) return error(res, 'You do not own this course', 403);

        await Course.remove(req.params.id);

        return success(res, { message: 'Course deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// ================= PUBLISH / UNPUBLISH =================
export const togglePublish = async (req, res, next) => {
    try {
        const course = await Course.getById(req.params.id);
        if (!course) return error(res, 'Course not found', 404);

        const isOwner = await Course.isOwner(req.user.userId, req.params.id);
        if (!isOwner) return error(res, 'You do not own this course', 403);

        const { published } = req.body;

        await Course.setPublished(req.params.id, published);

        return success(res, {
            message: `Course ${published ? 'published' : 'unpublished'}`
        });
    } catch (err) {
        next(err);
    }
};

// ================= GET CONTENTS =================
export const getContents = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.userId;
        const role = req.user.role;

        if (role === 'learner') {
            const enrolled = await Course.checkEnrollment(userId, courseId);
            if (!enrolled) {
                return error(res, 'You must be enrolled to access this content', 403);
            }

            const contents = await Course.getContents(courseId, true);
            return success(res, contents);
        }

        if (role === 'instructor') {
            const isOwner = await Course.isOwner(userId, courseId);
            if (!isOwner) {
                return error(res, 'You must be the owner to access all contents', 403);
            }

            const contents = await Course.getContents(courseId);
            return success(res, contents);
        }

        return error(res, 'Unauthorized role', 403);
    } catch (err) {
        next(err);
    }
};

// ================= ADD CONTENT =================
export const addContent = async (req, res, next) => {
    try {
        const isOwner = await Course.isOwner(req.user.userId, req.params.id);
        if (!isOwner) {
            return error(res, 'You do not own this course', 403);
        }

        const { title, data, is_published } = req.body;

        if (!title) {
            return error(res, 'Content title is required', 400);
        }
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

    
// Update a specific content item : Only the course owner
export const updateContent = async (req, res, next) => {
    try {
        const isOwner = await courseRepository.isOwner(req.user.userId, req.params.id);
        if (!isOwner) {
            return error(res, 'You do not own this course', 403);
        }

        const { title, data, is_published } = req.body;
        const [content] = await courseRepository.updateContent(req.params.contentId, {
            title, data, is_published
        });

        if (!content) return error(res, 'Content not found', 404);
        return success(res, content);
    } catch (err) {
        next(err);
    }
};

// Delete a specific content item : Only the course owner
export const removeContent = async (req, res, next) => {
    try {
        const isOwner = await courseRepository.isOwner(req.user.userId, req.params.id);
        if (!isOwner) {
            return error(res, 'You do not own this course', 403);
        }

        const deleted = await courseRepository.removeContent(req.params.contentId);
        if (!deleted) return error(res, 'Content not found', 404);
        return success(res, { message: 'Content deleted successfully' });
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
    togglePublish,
    getContents,
    addContent,updateContent,removeContent
};