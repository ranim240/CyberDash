/**
 * Seed XP History
 * Creates XP earning history for learners solving challenges
 * Run after seedUsers and seedChallenges
 */

import { generateXpHistoryId } from '../scripts/seedUtils.js';
import { learnerUser1Id, learnerUser2Id, learnerUser3Id, learnerUser4Id } from './seedUsers.js';
import { challenge1Id, challenge2Id, challenge3Id, challenge4Id } from './seedChallenges.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('xp_history').del();

  // Use imported IDs from seedUsers and seedChallenges
  const LEARNER_1_ID = learnerUser1Id;
  const LEARNER_2_ID = learnerUser2Id;
  const LEARNER_3_ID = learnerUser3Id;
  const LEARNER_4_ID = learnerUser4Id;

  const CHALLENGE_1_ID = challenge1Id; // SQL Injection (50 XP)
  const CHALLENGE_2_ID = challenge2Id; // XSS (100 XP)
  const CHALLENGE_3_ID = challenge3Id; // Caesar Cipher (30 XP)
  const CHALLENGE_4_ID = challenge4Id; // RSA (200 XP)

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
