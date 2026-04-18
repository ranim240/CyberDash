import db from '../../config/db.js';

class Course {
    // Fetch all courses that are marked as published
    getAllPublished = () => {
        return db('course').where({ is_published: true });
    };

    // Fetch a specific course by its unique ID
    getById = (course_id) => {
        return db('course').where({ course_id }).first();
    };

    // Fetch contents associated with a course
    // publishedOnly - If true, only returns published modules (for learners)
    getContents = (course_id, publishedOnly = false) => {
        if (publishedOnly) {
            return db('course_content')
                .where({ course_id, is_published: true })
                .select('content_id', 'title', 'data');
        }
        return db('course_content').where({ course_id });
    };

    // Insert a new course into the database
    create = (data) => {
        return db('course').insert(data).returning('*');
    };

    // Update an existing course's metadata
    update = (course_id, data) => {
        return db('course').where({ course_id }).update(data).returning('*');
    };

    // Delete a course by ID
    remove = (course_id) => {
        return db('course').where({ course_id }).delete();
    };

    // Toggle the publication status of a course
    setPublished = (course_id, is_published) => {
        return db('course').where({ course_id }).update({ is_published });
    };

    // Add a content item (lesson) to a course
    addContent = (data) => {
        return db('course_content').insert(data).returning('*');
    };

    // Update a specific content item
    updateContent = (content_id, data) => {
        return db('course_content').where({ content_id }).update(data).returning('*');
    };

    // Remove a specific content item
    removeContent = (content_id) => {
        return db('course_content').where({ content_id }).delete();
    };

    // Fetch all courses managed by a specific instructor
    getInstructorCourses = (instructor_id) => {
        return db('course').where({ instructor_id });
    };

    // Verify if a learner is enrolled in a specific course
    checkEnrollment = (learner_id, course_id) => {
        return db('enrollment').where({ learner_id, course_id }).first();
    };

    // Verify if an instructor is the owner of a course
    isOwner = (instructor_id, course_id) => {
        return db('course').where({ course_id, instructor_id }).first();
    };
}

export default new Course();