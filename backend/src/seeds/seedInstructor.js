export const seed = async (knex) => {
  await knex('instructor').del();

  await knex('instructor').insert([
    { user_id: 'user_003_4bca26cc' },
    { user_id: 'user_004_74060255' },
  ]);
};