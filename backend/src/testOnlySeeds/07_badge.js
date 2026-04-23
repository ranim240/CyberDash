export const seed = async function(knex) {
  await knex('badge').insert([
    { badge_id: 'badge_first_blood', name: 'First Blood', description: 'Solve your first challenge', icon_url: '/badges/first.png', condition_type: 'challenges_solved', condition_value: 1, xp_bonus: 50, administrator_id: 'admin_1' },
    { badge_id: 'badge_xp_master', name: 'XP Master', description: 'Reach 5000 XP', icon_url: '/badges/xp.png', condition_type: 'total_xp', condition_value: 5000, xp_bonus: 200, administrator_id: 'admin_1' },
    { badge_id: 'badge_streak_7', name: 'Weekly Warrior', description: '7 day streak', icon_url: '/badges/streak.png', condition_type: 'streak_days', condition_value: 7, xp_bonus: 100, administrator_id: 'admin_1' },
    { badge_id: 'badge_crypto_hunter', name: 'Crypto Hunter', description: 'Solve 5 crypto challenges', icon_url: '/badges/crypto.png', condition_type: 'category_solves', condition_value: 5, xp_bonus: 150, administrator_id: 'admin_1' },
    { badge_id: 'badge_perfect_submission', name: 'Perfect Score', description: 'Solve a challenge on first try', icon_url: '/badges/perfect.png', condition_type: 'first_try_solve', condition_value: 1, xp_bonus: 75, administrator_id: 'admin_1' }
  ]).onConflict('badge_id').ignore();
};