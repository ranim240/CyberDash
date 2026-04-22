import db from '../../config/db.js';

class Learner {

  // ==========================
  // 👤 PROFILE
  // ==========================
  getLearnerProfile = async (user_id) => {
    const profile = await db('learner')
      .where({ user_id })
      .select(
        'user_id',
        'username',
        'xp_points',
        'created_at'
      )
      .first();

    return profile;
  };


  // ==========================
  // 🏅 BADGES (ORDERED)
  // ==========================
  getLearnerBadges = async (learner_id) => {
    return db('learner_badge as lb')
      .join('badge as b', 'b.badge_id', 'lb.badge_id')
      .where('lb.learner_id', learner_id)
      .select(
        'b.badge_id',
        'b.name',
        'b.description',
        'b.icon_url',
        'b.xp_bonus',
        'lb.awarded_at'
      )
      .orderBy('lb.awarded_at', 'desc');
  };


  // ==========================
  // 📚 ENROLLMENTS (STRUCTURED)
  // ==========================
  getEnrollments = async (learner_id) => {
    return db('enrollment as e')
      .join('course as c', 'c.course_id', 'e.course_id')
      .where('e.learner_id', learner_id)
      .select(
        'c.course_id',
        'c.title',
        'c.description',
        'e.enrolled_at',
        'e.completion_status'
      )
      .orderBy('e.enrolled_at', 'desc');
  };


  // ==========================
  // ➕ ENROLL
  // ==========================
  enroll = async (data) => {
    return db('enrollment')
      .insert({
        ...data,
        enrolled_at: new Date()
      });
  };


  // ==========================
  // 🔍 CHECK ENROLLMENT
  // ==========================
  isEnrolled = async (learner_id, course_id) => {
    return db('enrollment')
      .where({ learner_id, course_id })
      .first();
  };


  // ==========================
  // ➖ UNENROLL
  // ==========================
  unenroll = async (learner_id, course_id) => {
    return db('enrollment')
      .where({ learner_id, course_id })
      .del();
  };


  // ==========================
  // 📈 UPDATE PROGRESS
  // ==========================
  updateProgress = async (learner_id, course_id, completion_status) => {
    return db('enrollment')
      .where({ learner_id, course_id })
      .update({
        completion_status,
        updated_at: new Date()
      });
  };


  // ==========================
  // 📊 GET PROGRESS
  // ==========================
  getProgress = async (learner_id, course_id) => {
    return db('enrollment')
      .where({ learner_id, course_id })
      .select(
        'enrolled_at',
        'completion_status',
        'updated_at'
      )
      .first();
  };


  // ==========================
  // 🔥 BONUS: DASHBOARD STATS
  // ==========================
  getStats = async (learner_id) => {
    const [solved] = await db('submission as s')
      .join('challenge_session as cs', 'cs.session_id', 's.session_id')
      .where({
        'cs.learner_id': learner_id,
        's.is_correct': true
      })
      .count('s.submission_id as count');

    return {
      solved_challenges: Number(solved.count || 0)
    };
  };

}

export default new Learner();