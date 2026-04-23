export const seed = async function(knex) {
  await knex('submission').insert([
    { submission_id: 'sub_1', session_id: 'sess_1', answer: 'alert(1)', is_correct: false, submitted_at: knex.fn.now() },
    { submission_id: 'sub_2', session_id: 'sess_1', answer: '<script>alert(1)</script>', is_correct: true, submitted_at: knex.fn.now() },
    { submission_id: 'sub_3', session_id: 'sess_2', answer: 'FLAG{BASE64_EASY}', is_correct: true, submitted_at: knex.fn.now() },
    { submission_id: 'sub_4', session_id: 'sess_4', answer: 'wrong_flag', is_correct: false, submitted_at: knex.fn.now() },
    { submission_id: 'sub_5', session_id: 'sess_4', answer: 'FLAG{RE_MASTER}', is_correct: true, submitted_at: knex.fn.now() }
  ]).onConflict('submission_id').ignore();
};