import db from '../../config/db.js';

class SubmissionRepository {

  // ==========================
  // 📌 Get submission by ID
  // ==========================
  getSubmissionById = (submission_id) => {
    return db('submission')
      .where({ submission_id })
      .first();
  };


  // ==========================
  // 📌 Get submissions by session
  // ==========================
  getBySession = (session_id) => {
    return db('submission')
      .where({ session_id })
      .orderBy('created_at', 'desc');
  };


  // ==========================
  // 📌 Create submission
  // ==========================
  createSubmission = (data) => {
    return db('submission')
      .insert(data)
      .returning('*');
  };


  // ==========================
  // 📌 Update submission
  // ==========================
  updateSubmission = (submission_id, data) => {
    return db('submission')
      .where({ submission_id })
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*');
  };


  // ==========================
  // 📌 Delete submission
  // ==========================
  deleteSubmission = (submission_id) => {
    return db('submission')
      .where({ submission_id })
      .delete();
  };


  // ==========================
  // 📌 Get correct submissions
  // ==========================
  getCorrectBySession = (session_id) => {
    return db('submission')
      .where({ session_id, is_correct: true })
      .orderBy('created_at', 'desc');
  };


  // ==========================
  // 📌 Check if already solved
  // ==========================
  hasCorrectSubmission = (session_id) => {
    return db('submission')
      .where({ session_id, is_correct: true })
      .first();
  };


  // ==========================
  // 📌 Get latest correct submission (IMPORTANT FOR XP/BADGES)
  // ==========================
  getLatestCorrect = (session_id) => {
    return db('submission')
      .where({ session_id, is_correct: true })
      .orderBy('created_at', 'desc')
      .first();
  };

}

export default new SubmissionRepository();
