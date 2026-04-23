/**
 * Seed Learner Badges
 * Creates badge awards for learners
 * Run after seedUsers and seedBadges
 */

import { learnerUser1Id, learnerUser2Id, learnerUser4Id } from './seedUsers.js';
import { badge1Id, badge2Id, badge3Id, badge4Id, badge5Id } from './seedBadges.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('learner_badge').del();

  // Use imported IDs from seedUsers and seedBadges
  const LEARNER_1_ID = learnerUser1Id;
  const LEARNER_2_ID = learnerUser2Id;
  const LEARNER_4_ID = learnerUser4Id;

  const BADGE_1_ID = badge1Id; // First Blood
  const BADGE_2_ID = badge2Id; // Challenge Master
  const BADGE_3_ID = badge3Id; // XP Accumulator
  const BADGE_4_ID = badge4Id; // Level 5 Hacker
  const BADGE_5_ID = badge5Id; // On Fire

  const baseDate = new Date('2026-03-01');

  await knex('learner_badge').insert([
    // Learner 1
    {
      learner_id: LEARNER_1_ID,
      badge_id: BADGE_1_ID,
      awarded_at: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days later
    },
    {
      learner_id: LEARNER_1_ID,
      badge_id: BADGE_3_ID,
      awarded_at: new Date(baseDate.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days later
    },
    {
      learner_id: LEARNER_1_ID,
      badge_id: BADGE_5_ID,
      awarded_at: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later (streak reached)
    },

    // Learner 2
    {
      learner_id: LEARNER_2_ID,
      badge_id: BADGE_1_ID,
      awarded_at: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days later
    },

    // Learner 4 (most badges)
    {
      learner_id: LEARNER_4_ID,
      badge_id: BADGE_1_ID,
      awarded_at: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day later (first to get it)
    },
    {
      learner_id: LEARNER_4_ID,
      badge_id: BADGE_2_ID,
      awarded_at: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days later
    },
    {
      learner_id: LEARNER_4_ID,
      badge_id: BADGE_3_ID,
      awarded_at: new Date(baseDate.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days later
    },
    {
      learner_id: LEARNER_4_ID,
      badge_id: BADGE_4_ID,
      awarded_at: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days later
    },
    {
      learner_id: LEARNER_4_ID,
      badge_id: BADGE_5_ID,
      awarded_at: new Date(baseDate.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days later
    },
  ]);
};
