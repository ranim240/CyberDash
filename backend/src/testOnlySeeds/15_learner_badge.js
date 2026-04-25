export const seed = async (knex) => {
  const badges = [
    { learner_id: 'learner_1', badge_id: 'badge_first_blood' },
    { learner_id: 'learner_3', badge_id: 'badge_first_blood' },
    { learner_id: 'learner_1', badge_id: 'badge_perfect_submission' },
    { learner_id: 'learner_3', badge_id: 'badge_crypto_hunter' },
    { learner_id: 'learner_5', badge_id: 'badge_streak_7' }
  ];

  for (const award of badges) {
    await knex.raw(`
      INSERT INTO learner_badge (learner_id, badge_id, awarded_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT ON CONSTRAINT learner_badge_pkey DO NOTHING
    `, [award.learner_id, award.badge_id]);
  }
};