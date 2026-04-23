
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
const challenges = [{
  
}]
const xp_history = [
  {
    challenge_id: 'challenge_001',
    created_at: new Date('2026-04-10T10:00:00'),
    id : 'user_1_challenge_001_xp',
    user_id: 'user_1',
    xp: 50
    
  },
  { 
    challenge_id: 'challenge_001',
    created_at: new Date('2026-04-01T10:00:00') ,
    id : 'user_2_challenge_001_xp',
    user_id: 'user_2',
    
    xp: 50
    // earlier (same month)
  },
  {
    challenge_id: 'challenge_002',
    created_at: new Date('2026-03-20T10:00:00'),
    id : 'user_1_challenge_002_xp',
    user_id: 'user_1',
    
    xp: 30,
     // previous month
  },
    {
      challenge_id: 'challenge_003',
      created_at: new Date(),
      id : 'user_1_challenge_003_xp',
    user_id: 'user_1',
    
    xp: 20,
     // previous month
  }
]
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
  await knex('xp_history').insert(xp_history);
  // then insert learners
  await knex('learner').insert(learners);
};