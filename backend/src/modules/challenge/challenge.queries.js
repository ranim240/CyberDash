import db from '../../config/db.js';
export const getAll = () => db('challenge').where({ status: 'active' });
export const getById = (challenge_id) =>
db('challenge').where({ challenge_id }).first();
export const getFiles = (challenge_id) =>
db('challenge_files').where({ challenge_id });
export const create = (data) => db('challenge').insert(data).returning('*');
export const update = (challenge_id, data) =>
db('challenge').where({ challenge_id }).update(data).returning('*');
export const remove = (challenge_id) =>
db('challenge').where({ challenge_id }).delete();
export const setStatus = (challenge_id, status) =>
db('challenge').where({ challenge_id }).update({ status });
export const addFile = (data) => db('challenge_files').insert(data).returning('*');
export const removeFile = (file_id) =>
db('challenge_files').where({ file_id }).delete();
export const getByInstructor = (instructor_id) =>
db('challenge').where({ instructor_id });