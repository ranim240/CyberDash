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
    {
      user_id: 'user_4',
      xp_points: 500,
      current_level: 7,
      streak: 23,
    },
  ];
export const seed = async (knex) => {
  // delete learners first, then users (because learner references user)
  await knex('learner').del();

  // then insert learners
  await knex('learner').insert(learners);
};