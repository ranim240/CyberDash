export const seed = async function(knex) {
  await knex('xp_history').insert([
    { id: 'xp_1', user_id: 'learner_1', challenge_id: 'chal_web_xss1', xp: 100, created_at: knex.fn.now() },
    { id: 'xp_2', user_id: 'learner_1', challenge_id: 'chal_crypto_base64', xp: 50, created_at: knex.fn.now() },
    { id: 'xp_3', user_id: 'learner_2', challenge_id: 'chal_web_xss1', xp: 100, created_at: knex.fn.now() },
    { id: 'xp_4', user_id: 'learner_3', challenge_id: 'chal_rev_crackme', xp: 350, created_at: knex.fn.now() },
    { id: 'xp_5', user_id: 'learner_5', challenge_id: 'chal_forensics_logs', xp: 0, created_at: knex.fn.now() }
  ]).onConflict('id').ignore();
};