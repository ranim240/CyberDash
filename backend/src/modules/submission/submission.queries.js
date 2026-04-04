import db from '../../config/db.js';
export const create = (data) => db('submissions').insert(data).returning('*');
export const getById = (submission_id) =>
db('submissions').where({ submission_id }).first();
export const getBySession = (session_id) =>
db('submissions').where({ session_id });