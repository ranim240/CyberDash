export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('badge').del();

  // Insert seed entries
  await knex('badge').insert([
    {
      badge_id: 'badge_001',
      name: 'First Steps',
      description: 'Complete your first challenge',
      icon_url: 'https://example.com/icons/first-steps.png',
      condition_type: 'challenges_completed',
      condition_value: 1,
      xp_bonus: 10,
      administrator_id: '5f20d9f8-032b-4148-9a68-ba320bdf4b41' // Make sure this admin exists in your user table
    },
    {
      badge_id: 'badge_002',
      name: 'Challenge Master',
      description: 'Complete 10 challenges',
      icon_url: 'https://example.com/icons/master.png',
      condition_type: 'challenges_completed',
      condition_value: 10,
      xp_bonus: 50,
      administrator_id: '5f20d9f8-032b-4148-9a68-ba320bdf4b41'
    },
    {
      badge_id: 'badge_003',
      name: 'Point Collector',
      description: 'Earn 100 points',
      icon_url: 'https://example.com/icons/points.png',
      condition_type: 'points_earned',
      condition_value: 100,
      xp_bonus: 25,
      administrator_id: '5f20d9f8-032b-4148-9a68-ba320bdf4b41'
    },
    {
      badge_id: 'badge_004',
      name: 'Streak Warrior',
      description: 'Maintain a 7-day streak',
      icon_url: 'https://example.com/icons/streak.png',
      condition_type: 'streak_days',
      condition_value: 7,
      xp_bonus: 30,
      administrator_id: '5f20d9f8-032b-4148-9a68-ba320bdf4b41'
    },
    {
      badge_id: 'badge_005',
      name: 'Early Adopter',
      description: 'Special badge for early users',
      icon_url: 'https://example.com/icons/special.png',
      condition_type: 'special',
      condition_value: null,
      xp_bonus: 100,
      administrator_id: '5f20d9f8-032b-4148-9a68-ba320bdf4b41'
    }
  ]);
};