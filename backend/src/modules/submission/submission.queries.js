import db from '../../config/db.js';
class SubmissionRepository {
    // Fetch a submission by its unique ID
    getById = (submission_id) => {
        return db('submission').where({ submission_id }).first();
    };
    // Fetch all submissions associated with a specific session
    getBySession = (session_id) => {
        return db('submission').where({ session_id });
    };
    // Create a new submission record
    create = (data) => {
        return db('submission').insert(data).returning('*');
    };
    // Update an existing submission record   
    update = (submission_id, data) => {
        return db('submission').where({ submission_id }).update(data).returning('*');
    };
    // Delete a submission by ID
    remove = (submission_id) => {
        return db('submission').where({ submission_id }).delete();
    };
}
export default new SubmissionRepository();