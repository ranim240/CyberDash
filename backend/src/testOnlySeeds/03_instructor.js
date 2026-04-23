export const seed = async function(knex) {
  await knex('instructor').insert([
    { user_id: 'instructor_1' },
    { user_id: 'instructor_2' },
    { user_id: 'instructor_3' },
    { user_id: 'instructor_4' },
    { user_id: 'instructor_5' }
  ]).onConflict('user_id').ignore();
};