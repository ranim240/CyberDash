import db from '../../config/db.js';
export const getAllPublished = () => db('courses').where({ is_published: true });
export const getById = (course_id) => db('courses').where({ course_id }).first();
export const getContents = (course_id) => db('course_contents').where({ course_id });
export const create = (data) => db('courses').insert(data).returning('*');
export const update = (course_id, data) =>
db('courses').where({ course_id }).update(data).returning('*');
export const remove = (course_id) => db('courses').where({ course_id }).delete();
export const setPublished = (course_id, is_published) =>
db('courses').where({ course_id }).update({ is_published });
export const addContent = (data) => db('course_contents').insert(data).returning('*');
export const updateContent = (content_id, data) =>
db('course_contents').where({ content_id }).update(data).returning('*');
export const removeContent = (content_id) =>
db('course_contents').where({ content_id }).delete();
export const getInstructorCourses = (instructor_id) =>
db('courses').where({ instructor_id });