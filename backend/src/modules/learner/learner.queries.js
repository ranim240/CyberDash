import db from '../../config/db.js';

// Fetch a learner's basic profile information
export const getLearnerProfile = (user_id) => {
    return db('learner').where({ user_id }).first();
};

// Fetch all badges earned by a specific learner
export const getLearnerBadges = (learner_id) => {
    return db('learner_badge as lb')
        .join('badge as b', 'b.badge_id', 'lb.badge_id')
        .where('lb.learner_id', learner_id)
        .select('b.*', 'lb.awarded_at');
};

// Fetch all course enrollments for a specific learner
export const getEnrollments = (learner_id) => {
    return db('enrollment as e')
        .join('course as c', 'c.course_id', 'e.course_id')
        .where('e.learner_id', learner_id)
        .select('c.*', 'e.enrolled_at', 'e.completion_status');
};

// Insert a new enrollment record
export const enroll = (data) => {
    return db('enrollment').insert(data);
};

// Verify if a learner is enrolled in a specific course
export const isEnrolled = (learner_id, course_id) => {
    return db('enrollment').where({ learner_id, course_id }).first();
};

// Delete an enrollment record (unenroll)
export const unenroll = (learner_id, course_id) => {
    return db('enrollment')
        .where({ learner_id, course_id })
        .delete();
};

// Update the completion status of a course for a learner
export const updateProgress = (learner_id, course_id, completion_status) => {
    return db('enrollment')
        .where({ learner_id, course_id })
        .update({ completion_status });
};

// Fetch progress details (enrollment date and status) for a specific course
export const getProgress = (learner_id, course_id) => {
    return db('enrollment')
        .where({ learner_id, course_id })
        .select('enrolled_at', 'completion_status')
        .first();
};