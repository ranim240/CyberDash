export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('learner_badge').del();

  // Insert seed entries
  await knex('learner_badge').insert([
    {
      learner_id: 'a84827f2-943f-4622-be26-002d8122b027', // Make sure this learner exists
      badge_id: 'badge_001',
      awarded_at: knex.fn.now()
    },
    {
      learner_id: 'a84827f2-943f-4622-be26-002d8122b027',
      badge_id: 'badge_003',
      awarded_at: knex.fn.now()
    },
    {
      learner_id: 'user_2', // Make sure this learner exists
      badge_id: 'badge_001',
      awarded_at: knex.fn.now()
    },
    {
      learner_id: 'user_2',
      badge_id: 'badge_002',
      awarded_at: knex.fn.now()
    },
    {
      learner_id: 'user_3', // Make sure this learner exists
      badge_id: 'badge_001',
      awarded_at: knex.fn.now()
    },
    {
      learner_id: 'user_3',
      badge_id: 'badge_004',
      awarded_at: knex.fn.now()
    }
  ]);
};