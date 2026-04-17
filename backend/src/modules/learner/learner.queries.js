import db from '../../config/db.js';

class LearnerRepository {
    // Fetch a learner's basic profile information
    getLearnerProfile = (user_id) => {
        return db('learner').where({ user_id }).first();
    };

    // Fetch all badges earned by a specific learner
    getLearnerBadges = (learner_id) => {
        return db('learner_badge as lb')
            .join('badge as b', 'b.badge_id', 'lb.badge_id')
            .where('lb.learner_id', learner_id)
            .select('b.*', 'lb.awarded_at');
    };

    // Fetch all course enrollments for a specific learner
    getEnrollments = (learner_id) => {
        return db('enrollment as e')
            .join('course as c', 'c.course_id', 'e.course_id')
            .where('e.learner_id', learner_id)
            .select('c.*', 'e.enrolled_at', 'e.completion_status');
    };

    // Insert a new enrollment record
    enroll = (data) => {
        return db('enrollment').insert(data);
    };

    // Verify if a learner is enrolled in a specific course
    isEnrolled = (learner_id, course_id) => {
        return db('enrollment').where({ learner_id, course_id }).first();
    };

    // Delete an enrollment record (unenroll)
    unenroll = (learner_id, course_id) => {
        return db('enrollment')
            .where({ learner_id, course_id })
            .delete();
    };

    // Update the completion status of a course for a learner
    updateProgress = (learner_id, course_id, completion_status) => {
        return db('enrollment')
            .where({ learner_id, course_id })
            .update({ completion_status });
    };

    // Fetch progress details (enrollment date and status) for a specific course
    getProgress = (learner_id, course_id) => {
        return db('enrollment')
            .where({ learner_id, course_id })
            .select('enrolled_at', 'completion_status')
            .first();
    };
}

export default new LearnerRepository();