/**
 * Seed Enrollments
 * Creates course enrollments for learners
 * Run after seedUsers and seedCourses
 *
 * NOTE: Update learner and course IDs to match those created in seedUsers and seedCourses
 */
import {course1Id,course2Id,course3Id,course4Id} from './seedCourses.js'
import {learnerUser1Id , learnerUser2Id,learnerUser3Id,learnerUser4Id,learnerUser5Id} from './seedUsers.js'
export const seed = async (knex) => {
  // Delete existing data
  await knex('enrollment').del();

  // Reference IDs - update these to match your seeded data
  const LEARNER_1_ID = learnerUser1Id; // Update this
  const LEARNER_2_ID = learnerUser2Id // Update this
  const LEARNER_3_ID = learnerUser3Id; // Update this
  const LEARNER_4_ID = learnerUser4Id; // Update this
  const LEARNER_5_ID = learnerUser5Id; // Update this

  const COURSE_1_ID = course1Id; // Update this
  const COURSE_2_ID = course2Id; // Update this
  const COURSE_3_ID = course3Id; // Update this
  const COURSE_4_ID = course4Id; // Update this

  await knex('enrollment').insert([
    // Learner 1 enrollments
    {
      learner_id: LEARNER_1_ID,
      course_id: COURSE_1_ID,
      enrolled_at: new Date('2026-03-01'),
      completion_status: 'in_progress',
    },
    {
      learner_id: LEARNER_1_ID,
      course_id: COURSE_3_ID,
      enrolled_at: new Date('2026-03-05'),
      completion_status: 'completed',
    },

    // Learner 2 enrollments
    {
      learner_id: LEARNER_2_ID,
      course_id: COURSE_1_ID,
      enrolled_at: new Date('2026-03-02'),
      completion_status: 'in_progress',
    },
    {
      learner_id: LEARNER_2_ID,
      course_id: COURSE_2_ID,
      enrolled_at: new Date('2026-03-10'),
      completion_status: 'not_started',
    },

    // Learner 3 enrollments
    {
      learner_id: LEARNER_3_ID,
      course_id: COURSE_3_ID,
      enrolled_at: new Date('2026-03-03'),
      completion_status: 'in_progress',
    },

    // Learner 4 enrollments
    {
      learner_id: LEARNER_4_ID,
      course_id: COURSE_1_ID,
      enrolled_at: new Date('2026-03-08'),
      completion_status: 'completed',
    },
    {
      learner_id: LEARNER_4_ID,
      course_id: COURSE_2_ID,
      enrolled_at: new Date('2026-03-09'),
      completion_status: 'in_progress',
    },
    {
      learner_id: LEARNER_4_ID,
      course_id: COURSE_3_ID,
      enrolled_at: new Date('2026-03-11'),
      completion_status: 'in_progress',
    },

    // Learner 5 enrollments
    {
      learner_id: LEARNER_5_ID,
      course_id: COURSE_1_ID,
      enrolled_at: new Date('2026-03-12'),
      completion_status: 'not_started',
    },
  ]);
};
