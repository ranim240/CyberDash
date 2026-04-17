import db from '../../config/db.js';
export const create = (data) => db('submission').insert(data).returning('*');
export const getById = (submission_id) =>
db('submission').where({ submission_id }).first();
export const getBySession = (session_id) =>
db('submission').where({ session_id });