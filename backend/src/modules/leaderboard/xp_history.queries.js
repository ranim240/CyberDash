import knex from '../../config/db.js';

class LeaderboardService {

  // Global leaderboard
  async getGlobalLeaderboard() {
    return await knex("learner")
      .join("user", "learner.user_id", "user.user_id")
      .select(
        "learner.user_id",
        "user.username",
        "learner.xp_points",
        "learner.current_level"
      )
      .orderBy("learner.xp_points", "desc")
      .limit(10);
  }

  // By Category
  async getLeaderboardByCategory(category_id) {
    return await knex('xp_history')
      .join('user', 'xp_history.user_id', 'user.user_id')
      .join('learner', 'xp_history.user_id', 'learner.user_id')
      .join('challenge', 'xp_history.challenge_id', 'challenge.challenge_id')
      .select(
        'xp_history.user_id',
        'user.username',
        'learner.current_level'
      )
      .sum('xp_history.xp as xp_points')
      .where('challenge.category_id', category_id)
      .groupBy(
        'xp_history.user_id',
        'user.username',
        'learner.current_level'
      )
      .orderBy('xp_points', 'desc')
      .limit(10);
  }

  // This Month
  async getMonthlyLeaderboard() {
    return await knex('xp_history')
      .join('user', 'xp_history.user_id', 'user.user_id')
      .join('learner', 'xp_history.user_id', 'learner.user_id')
      .select(
        'xp_history.user_id',
        'user.username',
        'learner.current_level'
      )
      .sum('xp_history.xp as xp_points')
      .where('xp_history.created_at', '>=', knex.raw("NOW() - INTERVAL '1 month'"))
      .groupBy(
        'xp_history.user_id',
        'user.username',
        'learner.current_level'
      )
      .orderBy('xp_points', 'desc')
      .limit(10);
  }

  // This Week
  async getWeeklyLeaderboard() {
    return await knex('xp_history')
      .join('user', 'xp_history.user_id', 'user.user_id')
      .join('learner', 'xp_history.user_id', 'learner.user_id')
      .select(
        'xp_history.user_id',
        'user.username',
        'learner.current_level'
      )
      .sum('xp_history.xp as xp_points')
      .where('xp_history.created_at', '>=', knex.raw("NOW() - INTERVAL '7 days'"))
      .groupBy(
        'xp_history.user_id',
        'user.username',
        'learner.current_level'
      )
      .orderBy('xp_points', 'desc')
      .limit(10);
  }
}

export default new LeaderboardService();