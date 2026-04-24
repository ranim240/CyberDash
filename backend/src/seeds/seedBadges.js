/**
 * Seed Badges
 * Creates achievement badges
 * Run after seedUsers
 */


import { generateBadgeId } from './seedUtils.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('badge').del();

  // Reference admin IDs - update these to match seedUsers
  const ADMIN_1_ID = 'user_001_c772c1c1'; // Update this

  const badge1Id = generateBadgeId(1);
  const badge2Id = generateBadgeId(2);
  const badge3Id = generateBadgeId(3);
  const badge4Id = generateBadgeId(4);
  const badge5Id = generateBadgeId(5);
  const badge6Id = generateBadgeId(6);

  await knex('badge').insert([
    {
      badge_id: badge1Id,
      name: 'First Blood',
      description: 'Solve your first challenge',
      icon_url: 'https://api.cyberdash.com/badges/first-blood.svg',
      condition_type: 'first_challenge_solved',
      condition_value: 1,
      xp_bonus: 25,
      administrator_id: ADMIN_1_ID,
    },
    {
      badge_id: badge2Id,
      name: 'Challenge Master',
      description: 'Solve 10 challenges',
      icon_url: 'https://api.cyberdash.com/badges/challenge-master.svg',
      condition_type: 'challenges_solved',
      condition_value: 10,
      xp_bonus: 100,
      administrator_id: ADMIN_1_ID,
    },
    {
      badge_id: badge3Id,
      name: 'XP Accumulator',
      description: 'Earn 500 XP points',
      icon_url: 'https://api.cyberdash.com/badges/xp-accumulator.svg',
      condition_type: 'xp_earned',
      condition_value: 500,
      xp_bonus: 50,
      administrator_id: ADMIN_1_ID,
    },
    {
      badge_id: badge4Id,
      name: 'Level 5 Hacker',
      description: 'Reach level 5',
      icon_url: 'https://api.cyberdash.com/badges/level-5.svg',
      condition_type: 'level_reached',
      condition_value: 5,
      xp_bonus: 150,
      administrator_id: ADMIN_1_ID,
    },
    {
      badge_id: badge5Id,
      name: 'On Fire',
      description: 'Maintain a 7-day streak',
      icon_url: 'https://api.cyberdash.com/badges/on-fire.svg',
      condition_type: 'streak_days',
      condition_value: 7,
      xp_bonus: 75,
      administrator_id: ADMIN_1_ID,
    },
    {
      badge_id: badge6Id,
      name: 'Cryptography Expert',
      description: 'Solve all cryptography challenges',
      icon_url: 'https://api.cyberdash.com/badges/crypto-expert.svg',
      condition_type: 'category_mastery',
      condition_value: null,
      xp_bonus: 200,
      administrator_id: ADMIN_1_ID,
    },
  ]);
};
