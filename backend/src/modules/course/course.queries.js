import db from '../../config/db.js';

// Fetch all courses that are marked as published
export const getAllPublished = () => {
    return db('course').where({ is_published: true });
};

// Fetch a specific course by its unique ID
export const getById = (course_id) => {
    return db('course').where({ course_id }).first();
};

//Fetch contents associated with a course
//publishedOnly - If true, only returns published modules (for learners)
export const getContents = (course_id, publishedOnly = false) => {
    if (publishedOnly) {
        return db('course_content')
            .where({ course_id, is_published: true })
            .select('content_id', 'title', 'data');
    }
    return db('course_content').where({ course_id });
};

// Insert a new course into the database
export const create = (data) => {
    return db('course').insert(data).returning('*');
};

// Update an existing course's metadata
export const update = (course_id, data) => {
    return db('course').where({ course_id }).update(data).returning('*');
};

// Delete a course by ID
export const remove = (course_id) => {
    return db('course').where({ course_id }).delete();
};

// Toggle the publication status of a course
export const setPublished = (course_id, is_published) => {
    return db('course').where({ course_id }).update({ is_published });
};

// Add a content item (lesson) to a course
export const addContent = (data) => {
    return db('course_content').insert(data).returning('*');
};

// Update a specific content item
export const updateContent = (content_id, data) => {
    return db('course_content').where({ content_id }).update(data).returning('*');
};

// Remove a specific content item
export const removeContent = (content_id) => {
    return db('course_content').where({ content_id }).delete();
};

// Fetch all courses managed by a specific instructor
export const getInstructorCourses = (instructor_id) => {
    return db('course').where({ instructor_id });
};

// Verify if a learner is enrolled in a specific course
export const checkEnrollment = (learner_id, course_id) => {
    return db('enrollment').where({ learner_id, course_id }).first();
};

// Verify if an instructor is the owner of a course
export const isOwner = (instructor_id, course_id) => {
    return db('course').where({ course_id, instructor_id }).first();
};