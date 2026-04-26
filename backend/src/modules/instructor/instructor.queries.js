import db from '../../config/db.js';
export const getEngagedLearnersCountQuery = (instructorId) => {
  return db
    .with('enrolled_learners', (db) => {
      db.select('e.learner_id')
        .from('enrollment as e')
        .join('course as c', 'e.course_id', 'c.course_id')
        .where('c.instructor_id', instructorId);
    })
    .with('challenge_learners', (db) => {
      db.select('cs.learner_id')
        .from('challenge_session as cs')
        .join('challenge as ch', 'cs.challenge_id', 'ch.challenge_id')
        .where('ch.instructor_id', instructorId);
    })
    .from(function () {
      this.select('learner_id').from('enrolled_learners')
        .union(function () {
          this.select('learner_id').from('challenge_learners');
        })
        .as('all_learners');
    })
    .countDistinct('learner_id as total');
};