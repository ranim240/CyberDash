/**
 * Seed Challenge Sessions
 * Creates challenge attempt sessions for learners
 * Run after seedUsers and seedChallenges
 *
 * NOTE: Update learner and challenge IDs to match those created in seedUsers and seedChallenges
 */

import { generateSessionId, daysAgo, randomDate } from './seedUtils.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('challenge_session').del();

  // Reference IDs - update these to match your seeded data
  const LEARNER_1_ID = 'user_005_f955ff27'; // Update this
  const LEARNER_2_ID = 'user_006_a1879425'; // Update this
  const LEARNER_3_ID = 'user_007_d767ca36'; // Update this
  const LEARNER_4_ID = 'user_008_83666694'; // Update this

  const CHALLENGE_1_ID = 'challenge_001_0b6c79f9'; // Update this - SQL Injection
  const CHALLENGE_2_ID = 'challenge_002_74a1ebd1'; // Update this - XSS
  const CHALLENGE_3_ID = 'challenge_003_6d6c8114'; // Update this - Caesar Cipher
  const CHALLENGE_4_ID = 'challenge_004_d3da69e0'; // Update this - RSA
  const CHALLENGE_5_ID = 'challenge_005_66daf26e'; // Update this - ARP Spoofing

  const startDate = new Date('2026-03-01');
  const endDate = new Date('2026-04-10');

  await knex('challenge_session').insert([
    // Learner 1 sessions
    {
      session_id: generateSessionId(1),
      learner_id: LEARNER_1_ID,
      challenge_id: CHALLENGE_1_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-02'), endDate),
      attempt_count: 3,
    },
    {
      session_id: generateSessionId(2),
      learner_id: LEARNER_1_ID,
      challenge_id: CHALLENGE_2_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-05'), endDate),
      attempt_count: 5,
    },
    {
      session_id: generateSessionId(3),
      learner_id: LEARNER_1_ID,
      challenge_id: CHALLENGE_3_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-08'), endDate),
      attempt_count: 1,
    },

    // Learner 2 sessions
    {
      session_id: generateSessionId(4),
      learner_id: LEARNER_2_ID,
      challenge_id: CHALLENGE_1_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-05'), endDate),
      attempt_count: 2,
    },
    {
      session_id: generateSessionId(5),
      learner_id: LEARNER_2_ID,
      challenge_id: CHALLENGE_3_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: null, // Still in progress
      attempt_count: 4,
    },

    // Learner 3 sessions
    {
      session_id: generateSessionId(6),
      learner_id: LEARNER_3_ID,
      challenge_id: CHALLENGE_5_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: null, // Still in progress
      attempt_count: 1,
    },

    // Learner 4 sessions
    {
      session_id: generateSessionId(7),
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_1_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-02'), endDate),
      attempt_count: 1,
    },
    {
      session_id: generateSessionId(8),
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_2_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-06'), endDate),
      attempt_count: 2,
    },
    {
      session_id: generateSessionId(9),
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_3_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-10'), endDate),
      attempt_count: 1,
    },
    {
      session_id: generateSessionId(10),
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_4_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-15'), endDate),
      attempt_count: 3,
    },
    {
      session_id: generateSessionId(11),
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_5_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: null, // Still in progress
      attempt_count: 2,
    },
  ]);
};
