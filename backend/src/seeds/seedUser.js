export const seed = async (knex) => {
  await knex('user').del();

  await knex('user').insert([
    {
      user_id: 'user_1',
      username: 'Learner1',
      email: 'L1@test.com',
      password_hash: 'hashed_password_12',
      role: 'learner',
    },
    {
      user_id: 'user_2',
      username: 'Learner2',
      email: 'L2@test.com',
      password_hash: 'hashed_password_13',
      role: 'learner',
    },
    {
      user_id: 'user_3',
      username: 'admin1',
      email: 'admin1@test.com',
      password_hash: 'hashed_password_1',
      role: 'admin',
    },
    {
      user_id: 'user_4',
      username: 'learner3',
      email: 'learner3@test.com',
      password_hash: 'hashed_password_2',
      role: 'learner',
    },
    {
      user_id: 'user_5',
      username: 'instructor1',
      email: 'instructor1@test.com',
      password_hash: 'hashed_password_3',
      role: 'instructor',
    },
  ]);
};