export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('challenge_file').del();

  // Insert seed entries
  await knex('challenge_file').insert([
    {
      file_id: 'file_001',
      challenge_id: 'challenge_001_0b6c79f9', // Make sure this challenge exists
      file_name: 'starter_code.js',
      file_path: '/uploads/challenges/challenge_001/starter_code.js',
      file_size: 2048
    },
    {
      file_id: 'file_002',
      challenge_id: 'challenge_001_0b6c79f9',
      file_name: 'instructions.pdf',
      file_path: '/uploads/challenges/challenge_001/instructions.pdf',
      file_size: 15360
    },
    {
      file_id: 'file_003',
      challenge_id: 'challenge_002_74a1ebd1', // Make sure this challenge exists
      file_name: 'dataset.csv',
      file_path: '/uploads/challenges/challenge_002/dataset.csv',
      file_size: 51200
    },
    {
      file_id: 'file_004',
      challenge_id: 'challenge_002_74a1ebd1',
      file_name: 'example_solution.py',
      file_path: '/uploads/challenges/challenge_002/example_solution.py',
      file_size: 3072
    },
    {
      file_id: 'file_005',
      challenge_id: 'challenge_002_74a1ebd1', // Make sure this challenge exists
      file_name: 'template.html',
      file_path: '/uploads/challenges/challenge_003/template.html',
      file_size: 4096
    }
  ]);
};