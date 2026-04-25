export const seed = async function(knex) {
  await knex('challenge_session').insert([
    { session_id: 'sess_1', learner_id: 'learner_1', challenge_id: 'chal_web_xss1', started_at: knex.fn.now(), ended_at: null, attempt_count: 2 },
    { session_id: 'sess_2', learner_id: 'learner_1', challenge_id: 'chal_crypto_base64', started_at: knex.fn.now(), ended_at: knex.fn.now(), attempt_count: 1 },
    { session_id: 'sess_3', learner_id: 'learner_2', challenge_id: 'chal_forensics_logs', started_at: knex.fn.now(), ended_at: null, attempt_count: 0 },
    { session_id: 'sess_4', learner_id: 'learner_3', challenge_id: 'chal_rev_crackme', started_at: knex.fn.now(), ended_at: null, attempt_count: 5 },
    { session_id: 'sess_5', learner_id: 'learner_4', challenge_id: 'chal_pwn_buffer', started_at: knex.fn.now(), ended_at: null, attempt_count: 1 }
  ]).onConflict('session_id').ignore();
};