import knex from '../../config/db.js';

export const getLeaderboard = () => {
  return knex("learner").join("user","learner.user_id","user.user_id")
    .select("learner.user_id", "user.username","learner.xp_points","learner.current_level")
    .orderBy("xp_points", "desc").limit(10);
    ;
};