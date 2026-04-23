export const seed = async function(knex) {
  await knex('learner').insert([
    { user_id: 'learner_1', xp_points: 1250, current_level: 3, streak: 5 },
    { user_id: 'learner_2', xp_points: 540, current_level: 2, streak: 2 },
    { user_id: 'learner_3', xp_points: 2780, current_level: 5, streak: 12 },
    { user_id: 'learner_4', xp_points: 90, current_level: 1, streak: 0 },
    { user_id: 'learner_5', xp_points: 3200, current_level: 6, streak: 8 }
  ]).onConflict('user_id').ignore();
};