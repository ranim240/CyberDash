import db from '../../config/db.js';

// ============ STATS & ANALYTICS ============

export const getGlobalStats = async () => {
  const [users, challenges, submissions] = await Promise.all([
    db('user').count('user_id as count').first(),
    db('challenge').count('challenge_id as count').first(),
    db('submission').count('submission_id as count').first(),
  ]);

  return {
    users: Number(users.count),
    challenges: Number(challenges.count),
    submissions: Number(submissions.count),
  };
};

export const getActiveUsers = async () => {
  const result = await db('user')
    .where({ is_active: '1' })
    .count('user_id as count')
    .first();

  return Number(result.count);
};

// Note: Challenge and Incident Report management has been moved to their respective modules
// Use /api/challenges routes for challenge operations
// Use /api/reports routes for incident report operations

// ============ USER MANAGEMENT ============

export const getAllUsers = async ({ role, is_active, page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;

  let query = db('user').select('user_id', 'username', 'email', 'role', 'is_active', 'created_at');
  
  if (role) {
    query = query.where({ role });
  }
  
  if (is_active !== undefined) {
    query = query.where({ is_active });
  }

  const data = await query
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  // Get total count
  let totalQuery = db('user').count('user_id as count').first();
  
  if (role) {
    totalQuery = totalQuery.where({ role });
  }
  
  if (is_active !== undefined) {
    totalQuery = totalQuery.where({ is_active });
  }

  const total = await totalQuery;

  return {
    data,
    total: Number(total.count),
  };
};

export const updateUserStatus = async (user_id, is_active) => {
  const updated = await db('user')
    .where({ user_id })
    .update({ is_active })
    .returning(['user_id', 'username', 'email', 'is_active']);

  return updated[0];
};

export const deleteUser = async (user_id) => {
  // This should handle cascade deletion or use a transaction
  const deleted = await db('user')
    .where({ user_id })
    .del()
    .returning(['user_id', 'username', 'email']);

  return deleted[0];
};