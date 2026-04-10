export const seed = async (knex) => {
  await knex('challenge_session').del();

  await knex('challenge_session').insert([
    {
      session_id: 'session_1',
      learner_id: 'user_1',
      challenge_id: 'ch_1',
      started_at: new Date(),
      attempt_count: 1,
    },
    {
      session_id: 'session_2',
      learner_id: 'user_2',
      challenge_id: 'ch_2',
      started_at: new Date(),
      attempt_count: 2,
    },
  ]);
};