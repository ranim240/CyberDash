export const seed = async (knex) => {
  await knex('challenge').del();

  await knex('challenge').insert([
    {
      challenge_id: 'ch_1',
      title: 'SQL Injection Basics',
      description: 'Learn SQL injection',
      difficulty: 'easy',
      points: 50,
      status: 'active',
      flag: 'flag{sql_injection}',
      category_id: 'cat_1',
      instructor_id: 'user_1',
    },
    {
      challenge_id: 'ch_2',
      title: 'XSS Challenge',
      description: 'Cross-site scripting',
      difficulty: 'medium',
      points: 100,
      status: 'active',
      flag: 'flag{xss}',
      category_id: 'cat_1',
      instructor_id: 'user_2',
    },
  ]);
};