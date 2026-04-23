/**
 * Seed Courses
 * Creates courses
 * Run after seedUsers
 */

import { generateCourseId } from '../scripts/seedUtils.js';
import { instructorUser1Id, instructorUser2Id } from './seedUsers.js';

// Export course IDs for use in other seeds
export const course1Id = generateCourseId(1);
export const course2Id = generateCourseId(2);
export const course3Id = generateCourseId(3);
export const course4Id = generateCourseId(4);

export const seed = async (knex) => {
  // Delete existing data
  await knex('course').del();

  // Use imported instructor IDs
  const INSTRUCTOR_1_ID = instructorUser1Id;
  const INSTRUCTOR_2_ID = instructorUser2Id;

  await knex('course').insert([
    {
      course_id: course1Id,
      title: 'Web Security Fundamentals',
      description: 'Learn the basics of web application security including OWASP top 10 vulnerabilities.',
      estimated_duration: 40,
      level: 'beginner',
      is_published: true,
      created_at: new Date('2026-01-15'),
      instructor_id: INSTRUCTOR_1_ID,
    },
    {
      course_id: course2Id,
      title: 'Advanced Cryptography',
      description: 'Deep dive into modern cryptographic algorithms, key management, and implementations.',
      estimated_duration: 60,
      level: 'advanced',
      is_published: true,
      created_at: new Date('2026-01-20'),
      instructor_id: INSTRUCTOR_2_ID,
    },
    {
      course_id: course3Id,
      title: 'Network Security Essentials',
      description: 'Master network protocols, firewalls, intrusion detection, and attack prevention.',
      estimated_duration: 50,
      level: 'intermediate',
      is_published: true,
      created_at: new Date('2026-02-01'),
      instructor_id: INSTRUCTOR_1_ID,
    },
    {
      course_id: course4Id,
      title: 'Linux System Hardening',
      description: 'Learn to secure Linux systems through configuration, access control, and monitoring.',
      estimated_duration: 45,
      level: 'intermediate',
      is_published: false,
      created_at: new Date('2026-02-10'),
      instructor_id: INSTRUCTOR_2_ID,
    },
  ]);
};
