import db from '../../config/db.js';

class Course {

    getAllPublished = () => {
        return db('course').where({ is_published: true });
    };

    getById = (course_id) => {
        return db('course').where({ course_id }).first();
    };
    getByInstructorId = (instructor_id) => {
        
        return db('course').where({instructor_id});
    };

    getContents = (course_id, publishedOnly = false) => {
        if (publishedOnly) {
            return db('course_content')
                .where({ course_id, is_published: true })
                .select('content_id', 'title', 'data');
        }
        return db('course_content').where({ course_id });
    };

    create = (data) => {
        return db('course').insert(data).returning('*');
    };

    update = (course_id, data) => {
        return db('course').where({ course_id }).update(data).returning('*');
    };

    remove = (course_id) => {
        return db('course').where({ course_id }).delete();
    };

    // ✅ FIXED
    setPublished = (course_id, is_published) => {
        return db('course')
            .where({ course_id })
            .update({ is_published })
            .returning('*');
    };

    // 🔥 OPTIONAL (real toggle)
    togglePublish = async (course_id) => {
        const course = await db('course').where({ course_id }).first();
        if (!course) return null;

        const [updated] = await db('course')
            .where({ course_id })
            .update({ is_published: !course.is_published })
            .returning('*');

        return updated;
    };

    addContent = (data) => {
        return db('course_content').insert(data).returning('*');
    };

    updateContent = (content_id, data) => {
        return db('course_content').where({ content_id }).update(data).returning('*');
    };

    removeContent = (content_id) => {
        return db('course_content').where({ content_id }).delete();
    };

    getInstructorCourses = (instructor_id) => {
        return db('course').where({ instructor_id });
    };

    checkEnrollment = (learner_id, course_id) => {
        return db('enrollment').where({ learner_id, course_id }).first();
    };

    isOwner = (instructor_id, course_id) => {
        return db('course').where({ course_id, instructor_id }).first();
    };
}

export default new Course();