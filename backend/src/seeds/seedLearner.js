
const users = [
    {
      user_id: 'user_1',
      username: 'john_doe',
      email: 'john@example.com',
      password_hash: 'hashedpassword123',
      role: 'learner',
      is_active: true,
    },
    {
      user_id: 'user_2',
      username: 'jane_doe',
      email: 'jane@example.com',
      password_hash: 'hashedpassword456',
      role: 'learner',
      is_active: true,
    },
  ];

const learners = 
[
    {
      user_id: 'user_1',
      xp_points: 100,
      current_level: 2,
      streak: 5,
    },
    {
      user_id: 'user_2',
      xp_points: 50,
      current_level: 1,
      streak: 2,
    },
  ];
export const seed = async (knex) => {
  // delete learners first, then users (because learner references user)
  await knex('learner').del();
  await knex('user').del();

  // insert users first (because learner depends on user)
  await knex('user').insert(users);

  // then insert learners
  await knex('learner').insert(learners);
};