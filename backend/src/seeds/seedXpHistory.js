/**
 * Seed XP History
 * Creates XP earning history for learners solving challenges
 * Run after seedUsers and seedChallenges
 *
 * NOTE: Update learner and challenge IDs to match those created in seedUsers and seedChallenges
 */

import { generateXpHistoryId } from './seedUtils.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('xp_history').del();

  // Reference IDs - update these to match your seeded data
  const LEARNER_1_ID = 'user_005_f955ff27'; // Update this
  const LEARNER_2_ID = 'user_006_a1879425'; // Update this
  const LEARNER_3_ID = 'user_007_d767ca36'; // Update this
  const LEARNER_4_ID = 'user_008_83666694'; // Update this

  const CHALLENGE_1_ID = 'challenge_001_0b6c79f9'; // Update this - SQL Injection (50 XP)
  const CHALLENGE_2_ID = 'challenge_002_74a1ebd1'; // Update this - XSS (100 XP)
  const CHALLENGE_3_ID = 'challenge_003_6d6c8114'; // Update this - Caesar Cipher (30 XP)
  const CHALLENGE_4_ID = 'challenge_004_d3da69e0'; // Update this - RSA (200 XP)
  const CHALLENGE_5_ID = 'challenge_005_66daf26e'; // Update this - ARP Spoofing (120 XP)

  await knex('xp_history').insert([
    // Learner 1 XP history
    {
      id: generateXpHistoryId(LEARNER_1_ID, CHALLENGE_1_ID),
      user_id: LEARNER_1_ID,
      challenge_id: CHALLENGE_1_ID,
      xp: 50,
      created_at: new Date('2026-03-02T10:30:00'),
    },
    {
      id: generateXpHistoryId(LEARNER_1_ID, CHALLENGE_2_ID),
      user_id: LEARNER_1_ID,
      challenge_id: CHALLENGE_2_ID,
      xp: 100,
      created_at: new Date('2026-03-05T14:20:00'),
    },
    {
      id: generateXpHistoryId(LEARNER_1_ID, CHALLENGE_3_ID),
      user_id: LEARNER_1_ID,
      challenge_id: CHALLENGE_3_ID,
      xp: 30,
      created_at: new Date('2026-03-08T09:15:00'),
    },

    // Learner 2 XP history
    {
      id: generateXpHistoryId(LEARNER_2_ID, CHALLENGE_1_ID),
      user_id: LEARNER_2_ID,
      challenge_id: CHALLENGE_1_ID,
      xp: 50,
      created_at: new Date('2026-03-05T11:00:00'),
    },

    // Learner 4 XP history (most active)
    {
      id: generateXpHistoryId(LEARNER_4_ID, CHALLENGE_1_ID),
      user_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_1_ID,
      xp: 50,
      created_at: new Date('2026-03-02T08:30:00'),
    },
    {
      id: generateXpHistoryId(LEARNER_4_ID, CHALLENGE_2_ID),
      user_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_2_ID,
      xp: 100,
      created_at: new Date('2026-03-06T15:45:00'),
    },
    {
      id: generateXpHistoryId(LEARNER_4_ID, CHALLENGE_3_ID),
      user_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_3_ID,
      xp: 30,
      created_at: new Date('2026-03-10T12:30:00'),
    },
    {
      id: generateXpHistoryId(LEARNER_4_ID, CHALLENGE_4_ID),
      user_id: LEARNER_4_ID,
      challenge_id: CHALLENGE_4_ID,
      xp: 200,
      created_at: new Date('2026-03-15T16:20:00'),
    },

    // Learner 3 no XP history yet (not completed challenges)
  ]);
};
