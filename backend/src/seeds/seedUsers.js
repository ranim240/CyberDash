/**
 * Seed Users
 * Creates all base users (admin, instructors, learners)
 * This should be run first as other entities depend on user_id
 */
import { hashPassword } from './seedUtils.js';
import {
  adminUser1Id,
  adminUser2Id,
  instructorUser1Id,
  instructorUser2Id,
  learnerUser1Id,
  learnerUser2Id,
  learnerUser3Id,
  learnerUser4Id,
  learnerUser5Id,
} from './seedIds.js';

export const seed = async (knex) => {
  // Delete existing data in the correct order (respect foreign keys)
  await knex('xp_history').del();
  await knex('learner_badge').del();
  await knex('learner').del();
  await knex('instructor').del();
  await knex('user').del();

  // Insert users
  await knex('user').insert([
    // Admin users
    {
      user_id: adminUser1Id,
      username: 'admin_sarah',
      email: 'sarah.admin@cyberdash.com',
      password_hash: await hashPassword('AdminPass123!'),
      role: 'admin',
      is_active: true,
      created_at: new Date('2026-01-15'),
    },
    {
      user_id: adminUser2Id,
      username: 'admin_michael',
      email: 'michael.admin@cyberdash.com',
      password_hash: await hashPassword('AdminPass456!'),
      role: 'admin',
      is_active: true,
      created_at: new Date('2026-01-20'),
    },

    // Instructor users
    {
      user_id: instructorUser1Id,
      username: 'instructor_alex',
      email: 'alex.instructor@cyberdash.com',
      password_hash: await hashPassword('InstructorPass123!'),
      role: 'instructor',
      is_active: true,
      created_at: new Date('2026-02-01'),
    },
    {
      user_id: instructorUser2Id,
      username: 'instructor_emily',
      email: 'emily.instructor@cyberdash.com',
      password_hash: await hashPassword('InstructorPass456!'),
      role: 'instructor',
      is_active: true,
      created_at: new Date('2026-02-05'),
    },

    // Learner users
    {
      user_id: learnerUser1Id,
      username: 'learner_john',
      email: 'john.learner@cyberdash.com',
      password_hash: await hashPassword('LearnerPass123!'),
      role: 'learner',
      is_active: true,
      created_at: new Date('2026-02-10'),
    },
    {
      user_id: learnerUser2Id,
      username: 'learner_jane',
      email: 'jane.learner@cyberdash.com',
      password_hash: await hashPassword('LearnerPass456!'),
      role: 'learner',
      is_active: true,
      created_at: new Date('2026-02-12'),
    },
    {
      user_id: learnerUser3Id,
      username: 'learner_david',
      email: 'david.learner@cyberdash.com',
      password_hash: await hashPassword('LearnerPass789!'),
      role: 'learner',
      is_active: true,
      created_at: new Date('2026-02-15'),
    },
    {
      user_id: learnerUser4Id,
      username: 'learner_sophia',
      email: 'sophia.learner@cyberdash.com',
      password_hash: await hashPassword('LearnerPass321!'),
      role: 'learner',
      is_active: true,
      created_at: new Date('2026-02-18'),
    },
    {
      user_id: learnerUser5Id,
      username: 'learner_robert',
      email: 'robert.learner@cyberdash.com',
      password_hash: await hashPassword('LearnerPass654!'),
      role: 'learner',
      is_active: true,
      created_at: new Date('2026-02-20'),
    },
  ]);

  // Insert instructor profiles
  await knex('instructor').insert([
    { user_id: instructorUser1Id },
    { user_id: instructorUser2Id },
  ]);

  // Insert learner profiles
  await knex('learner').insert([
    {
      user_id: learnerUser1Id,
      xp_points: 450,
      current_level: 4,
      streak: 7,
    },
    {
      user_id: learnerUser2Id,
      xp_points: 320,
      current_level: 3,
      streak: 3,
    },
    {
      user_id: learnerUser3Id,
      xp_points: 220,
      current_level: 2,
      streak: 0,
    },
    {
      user_id: learnerUser4Id,
      xp_points: 580,
      current_level: 5,
      streak: 12,
    },
    {
      user_id: learnerUser5Id,
      xp_points: 0,
      current_level: 1,
      streak: 0,
    },
  ]);
};
