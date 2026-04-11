import db from '../../config/db.js';
export const getLearnerProfile = (user_id) =>
db('learner').where({ user_id }).first();
export const getLearnerBadges = (learner_id) =>
db('learner_badge as lb')
.join('badge as b', 'b.badge_id', 'lb.badge_id')
.where('lb.learner_id', learner_id)
.select('b.*', 'lb.awarded_at');
export const getEnrollments = (learner_id) =>
db('enrollment as e')
.join('courses as c', 'c.course_id', 'e.course_id')
.where('e.learner_id', learner_id)
.select('c.*', 'e.enrolled_at', 'e.completion_status');
export const enroll = (data) => db('enrollment').insert(data);
export const isEnrolled = (learner_id, course_id) =>
db('enrollment').where({ learner_id, course_id }).first();