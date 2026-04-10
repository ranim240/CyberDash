import db from '../../config/db.js';
export const getAllPublished = () => db('course').where({ is_published: true });
export const getById = (course_id) => db('course').where({ course_id }).first();
export const getContents = (course_id) => db('course_content').where({ course_id });
export const create = (data) => db('course').insert(data).returning('*');
export const update = (course_id, data) =>
db('course').where({ course_id }).update(data).returning('*');
export const remove = (course_id) => db('course').where({ course_id }).delete();
export const setPublished = (course_id, is_published) =>
db('course').where({ course_id }).update({ is_published });
export const addContent = (data) => db('course_content').insert(data).returning('*');
export const updateContent = (content_id, data) =>
db('course_content').where({ content_id }).update(data).returning('*');
export const removeContent = (content_id) =>
db('course_content').where({ content_id }).delete();
export const getInstructorCourses = (instructor_id) =>
db('course').where({ instructor_id });