import bcrypt from 'bcrypt';

export const seed = async function(knex) {
  // Use a simple test password known to the whole team
  const testPasswordHash = await bcrypt.hash('test123', 10);

  const users = [
    // Admin
    { user_id: 'admin_1', username: 'admin', email: 'admin@example.com', password_hash: testPasswordHash, role: 'admin', is_active: true },
    
    // 5 Learners
    { user_id: 'learner_1', username: 'alice', email: 'alice@test.com', password_hash: testPasswordHash, role: 'learner', is_active: true },
    { user_id: 'learner_2', username: 'bob', email: 'bob@test.com', password_hash: testPasswordHash, role: 'learner', is_active: true },
    { user_id: 'learner_3', username: 'carol', email: 'carol@test.com', password_hash: testPasswordHash, role: 'learner', is_active: true },
    { user_id: 'learner_4', username: 'dave', email: 'dave@test.com', password_hash: testPasswordHash, role: 'learner', is_active: true },
    { user_id: 'learner_5', username: 'eve', email: 'eve@test.com', password_hash: testPasswordHash, role: 'learner', is_active: true },
    
    // 5 Instructors
    { user_id: 'instructor_1', username: 'dr_smith', email: 'smith@example.com', password_hash: testPasswordHash, role: 'instructor', is_active: true },
    { user_id: 'instructor_2', username: 'prof_jones', email: 'jones@example.com', password_hash: testPasswordHash, role: 'instructor', is_active: true },
    { user_id: 'instructor_3', username: 'ms_white', email: 'white@example.com', password_hash: testPasswordHash, role: 'instructor', is_active: true },
    { user_id: 'instructor_4', username: 'mr_green', email: 'green@example.com', password_hash: testPasswordHash, role: 'instructor', is_active: true },
    { user_id: 'instructor_5', username: 'dr_brown', email: 'brown@example.com', password_hash: testPasswordHash, role: 'instructor', is_active: true }
  ];

  await knex('user')
    .insert(users)
    .onConflict('user_id')
    .merge(['password_hash']); // Updates only the password_hash if user already exists
};