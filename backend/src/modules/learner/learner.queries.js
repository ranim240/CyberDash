import db from '../../config/db.js';

// ─── helper (utilisé aussi côté frontend en fallback) ────────────────────────
export const getLevelTitle = (level) => {
  if (level >= 10) return 'Elite Hacker';
  if (level >= 7)  return 'Senior Hacker';
  if (level >= 4)  return 'Junior Hacker';
  return 'Novice';
};

class Learner {

  // ==========================
  // 👤 PROFILE
  // ==========================
  getLearnerProfile = async (user_id) => {
    const profile = await db('learner as l')
      .join('user as u', 'u.user_id', 'l.user_id')
      .where('l.user_id', user_id)
      .select(
        'l.user_id',
        'u.username',
        'l.xp_points',
        'l.current_level',
        'l.streak',
        'u.created_at'
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
  const { learner_id, course_id } = data;
  
  console.log('Attempting to enroll:', { learner_id, course_id });
  console.log('Types:', typeof learner_id, typeof course_id);
  
  // First, check what enrollments exist for this learner
  const existingEnrollments = await db('enrollment')
    .where({ learner_id: learner_id.toString() })
    .select('*');
  
  console.log('Existing enrollments:', existingEnrollments);
  
  // Check specifically for this course
  const existing = await db('enrollment')
    .where({ 
      learner_id: learner_id.toString(), 
      course_id: course_id.toString() 
    })
    .first();
  
  if (existing) {
    console.log('Already enrolled, skipping insert');
    return existing;
  }
  
  console.log('Inserting new enrollment');
  return db('enrollment').insert({
    learner_id: learner_id.toString(),
    course_id: course_id.toString(),
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
  // 🕓 RECENT SESSIONS (5 dernières)
  // ==========================
  getRecentSessions = async (learner_id, limit = 5) => {
    const sessions = await db('challenge_session as cs')
      .join('challenge as c', 'c.challenge_id', 'cs.challenge_id')
      // sous-requête : y a-t-il au moins une soumission correcte pour cette session ?
      .leftJoin(
        db('submission')
          .select('session_id')
          .where('is_correct', true)
          .groupBy('session_id')
          .as('correct_sub'),
        'correct_sub.session_id', 'cs.session_id'
      )
      .where('cs.learner_id', learner_id)
      .select(
        'cs.session_id',
        'cs.challenge_id',
        'c.title        as challenge_title',
        'c.difficulty',
        'c.points',
        'cs.started_at',
        'cs.ended_at',
        'cs.attempt_count',
        // statut dérivé :
        // - ended_at NULL            → 'active'
        // - ended_at + correct_sub   → 'completed'
        // - ended_at + pas correct   → 'abandoned'
        db.raw(`
          CASE
            WHEN cs.ended_at IS NULL                        THEN 'active'
            WHEN correct_sub.session_id IS NOT NULL         THEN 'completed'
            ELSE                                                 'abandoned'
          END as status
        `)
      )
      .orderBy('cs.started_at', 'desc')
      .limit(limit);

    return sessions;
  };


  // ==========================
  // 🔥 STATS (avec successRate + title)
  // ==========================
  getStats = async (learner_id) => {

    // nombre de soumissions correctes
    const [correct] = await db('submission as s')
      .join('challenge_session as cs', 'cs.session_id', 's.session_id')
      .where({ 'cs.learner_id': learner_id, 's.is_correct': true })
      .count('s.submission_id as count');

    // total de soumissions
    const [total] = await db('submission as s')
      .join('challenge_session as cs', 'cs.session_id', 's.session_id')
      .where('cs.learner_id', learner_id)
      .count('s.submission_id as count');

    // infos learner (xp, level, streak)
    const learner = await db('learner')
      .where({ user_id: learner_id })
      .select('xp_points', 'current_level', 'streak')
      .first();

    const solvedCount  = Number(correct.count || 0);
    const totalCount   = Number(total.count   || 0);
    const successRate  = totalCount > 0
      ? Math.round((solvedCount / totalCount) * 100)
      : 0;

    const level = learner?.current_level ?? 1;

    return {
      solved_challenges : solvedCount,
      total_submissions : totalCount,
      success_rate      : successRate,          // ✅ calculé
      xp_points         : learner?.xp_points  ?? 0,
      current_level     : level,
      streak            : learner?.streak     ?? 0,
      title             : getLevelTitle(level), // ✅ calculé
    };
  };

}

export default new Learner();