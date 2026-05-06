import db from '../../config/db.js';

class User {
// 🔹 Get full user profile (with role detection)
 getUserProfile = async (userId) => {
  const result = await db('user as u')
    .leftJoin('learner as l', 'u.user_id', 'l.user_id')
    .leftJoin('instructor as i', 'u.user_id', 'i.user_id')
    .where('u.user_id', userId)
    .select(
      'u.user_id',
      'u.email',
      'u.username',
      'u.created_at',
      'l.user_id as learner_id',
      'i.user_id as instructor_id'
    )
    .first();

  if (!result) return null;

  return {
    user_id: result.user_id,
    username:result.username,
    email: result.email,
    created_at: result.created_at,
    role: result.learner_id
      ? 'learner'
      : result.instructor_id
      ? 'instructor'
      : 'unknown'
  };
};

// 🔹 Get basic user
 getUserById = (userId) => {
  return db('user')
    .where({ user_id: userId })
    .first();
};

// 🔹 Check if user exists
  userExists = async (userId) => {
  const user = await db('user')
    .where({ user_id: userId })
    .first();

  return !!user;
};
} 
export default new User();