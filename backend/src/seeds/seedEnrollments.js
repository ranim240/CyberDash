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
  const LEARNER_1_ID = 'user_005_f955ff27'; // Update this
  const LEARNER_2_ID = 'user_006_a1879425'; // Update this
  const LEARNER_3_ID = 'user_007_d767ca36'; // Update this
  const LEARNER_4_ID = 'user_008_83666694'; // Update this
  const LEARNER_5_ID = 'user_009_ce304e6e'; // Update this

  const COURSE_1_ID = 'course_001_6cbd9a1b'; // Update this
  const COURSE_2_ID = 'course_002_54f09a59'; // Update this
  const COURSE_3_ID = 'course_003_31329622'; // Update this
  
  await knex('enrollment').insert([
    // Learner 1 enrollments
    {
      enrollment_id: 'enroll_001',
      learner_id: LEARNER_1_ID,
      course_id: COURSE_1_ID,
      enrolled_at: new Date('2026-03-01'),
      completion_status: 'in_progress',
    },
    {
      enrollment_id: 'enroll_002',
      learner_id: LEARNER_1_ID,
      course_id: COURSE_3_ID,
      enrolled_at: new Date('2026-03-05'),
      completion_status: 'completed',
    },

    // Learner 2 enrollments
    {
      enrollment_id: 'enroll_003',
      learner_id: LEARNER_2_ID,
      course_id: COURSE_1_ID,
      enrolled_at: new Date('2026-03-02'),
      completion_status: 'in_progress',
    },
    {
      enrollment_id: 'enroll_004',
      learner_id: LEARNER_2_ID,
      course_id: COURSE_2_ID,
      enrolled_at: new Date('2026-03-10'),
      completion_status: 'not_started',
    },

    // Learner 3 enrollments
    {
      enrollment_id: 'enroll_005',
      learner_id: LEARNER_3_ID,
      course_id: COURSE_3_ID,
      enrolled_at: new Date('2026-03-03'),
      completion_status: 'in_progress',
    },

    // Learner 4 enrollments
    {
      enrollment_id: 'enroll_006',
      learner_id: LEARNER_4_ID,
      course_id: COURSE_1_ID,
      enrolled_at: new Date('2026-03-08'),
      completion_status: 'completed',
    },
    {
      enrollment_id: 'enroll_007',
      learner_id: LEARNER_4_ID,
      course_id: COURSE_2_ID,
      enrolled_at: new Date('2026-03-09'),
      completion_status: 'in_progress',
    },
    {
      enrollment_id: 'enroll_008',
      learner_id: LEARNER_4_ID,
      course_id: COURSE_3_ID,
      enrolled_at: new Date('2026-03-11'),
      completion_status: 'in_progress',
    },

    // Learner 5 enrollments
    {
      enrollment_id: 'enroll_009',
      learner_id: LEARNER_5_ID,
      course_id: COURSE_1_ID,
      enrolled_at: new Date('2026-03-12'),
      completion_status: 'not_started',
    },
  ]);
};
