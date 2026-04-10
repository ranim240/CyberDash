export const seed = async (knex) => {
  await knex('instructor').del();

  await knex('instructor').insert([
    { user_id: 'user_1' },
    { user_id: 'user_2' },
  ]);
};