/**
 * Seed Challenge Sessions
 * Creates challenge attempt sessions for learners
 * Run after seedUsers and seedChallenges
 */

import { generateSessionId, daysAgo, randomDate } from '../scripts/seedUtils.js';
import { learnerUser1Id, learnerUser2Id, learnerUser3Id, learnerUser4Id, learnerUser5Id } from './seedUsers.js';
import { challenge1Id, challenge2Id, challenge3Id, challenge4Id, challenge5Id } from './seedChallenges.js';

// Export session IDs for use in other seeds
export const session1Id = generateSessionId(1);
export const session2Id = generateSessionId(2);
export const session3Id = generateSessionId(3);
export const session4Id = generateSessionId(4);
export const session5Id = generateSessionId(5);
export const session6Id = generateSessionId(6);
export const session7Id = generateSessionId(7);
export const session8Id = generateSessionId(8);
export const session9Id = generateSessionId(9);
export const session10Id = generateSessionId(10);
export const session11Id = generateSessionId(11);

export const seed = async (knex) => {
  // Delete existing data
  await knex('challenge_session').del();

  // Use imported IDs from seedUsers and seedChallenges
  const LEARNER_1_ID = learnerUser1Id;
  const LEARNER_2_ID = learnerUser2Id;
  const LEARNER_3_ID = learnerUser3Id;
  const LEARNER_4_ID = learnerUser4Id;

  const CHALLENGE_1_ID = challenge1Id; // SQL Injection
  const CHALLENGE_2_ID = challenge2Id; // XSS
  const CHALLENGE_3_ID = challenge3Id; // Caesar Cipher
  const CHALLENGE_4_ID = challenge4Id; // RSA
  const CHALLENGE_5_ID = challenge5Id; // ARP Spoofing

  const startDate = new Date('2026-03-01');
  const endDate = new Date('2026-04-10');

  await knex('challenge_session').insert([
    // Learner 1 sessions
    {
      session_id: session1Id,
      learner_id: LEARNER_1_ID,
      challenge_id: CHALLENGE_1_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-02'), endDate),
      attempt_count: 3,
    },
    {
      session_id: session2Id,
      learner_id: LEARNER_1_ID,
      challenge_id: CHALLENGE_2_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-05'), endDate),
      attempt_count: 5,
    },
    {
      session_id: session3Id,
      learner_id: LEARNER_1_ID,
      challenge_id: CHALLENGE_3_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-08'), endDate),
      attempt_count: 1,
    },

    // Learner 2 sessions
    {
      session_id: session4Id,
      learner_id: LEARNER_2_ID,
      challenge_id: CHALLENGE_1_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-05'), endDate),
      attempt_count: 2,
    },
    {
      session_id: session5Id,
      learner_id: LEARNER_2_ID,
      challenge_id: CHALLENGE_3_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: null, // Still in progress
      attempt_count: 4,
    },

    // Learner 3 sessions
    {
      session_id: session6Id,
      learner_id: LEARNER_3_ID,
      challenge_id: CHALLENGE_5_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: null, // Still in progress
      attempt_count: 1,
    },

    // Learner 4 sessions
    {
      session_id: session7Id,
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_1_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-02'), endDate),
      attempt_count: 1,
    },
    {
      session_id: session8Id,
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_2_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-06'), endDate),
      attempt_count: 2,
    },
    {
      session_id: session9Id,
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_3_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-10'), endDate),
      attempt_count: 1,
    },
    {
      session_id: session10Id,
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_4_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: randomDate(new Date('2026-03-15'), endDate),
      attempt_count: 3,
    },
    {
      session_id: session11Id,
      learner_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_5_ID,
      started_at: randomDate(startDate, endDate),
      ended_at: null, // Still in progress
      attempt_count: 2,
    },
  ]);
};
