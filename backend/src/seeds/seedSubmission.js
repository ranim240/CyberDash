export const seed = async (knex) => {
  await knex('submission').del();

  await knex('submission').insert([
    {
      submission_id: 'sub_1',
      session_id: 'session_1',
      answer: 'SELECT * FROM users;',
      is_correct: true,
      submitted_at: new Date(),
    },
    {
      submission_id: 'sub_2',
      session_id: 'session_2',
      answer: '<script>alert(1)</script>',
      is_correct: false,
      submitted_at: new Date(),
    },
  ]);
};