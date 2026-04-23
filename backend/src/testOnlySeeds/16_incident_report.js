export const seed = async function(knex) {
  await knex('incident_report').insert([
    { reported_id: 'rep_1', title: 'Challenge flag wrong', description: 'The flag for challenge X is incorrect', status: 'resolved', type: 'bug', reported_at: knex.fn.now(), resolved_at: knex.fn.now(), learner_id: 'learner_1', admin_id: 'admin_1' },
    { reported_id: 'rep_2', title: 'Offensive content', description: 'Instructor used inappropriate language', status: 'pending', type: 'harassment', reported_at: knex.fn.now(), learner_id: 'learner_2', admin_id: null },
    { reported_id: 'rep_3', title: 'Course video not loading', description: 'Video stuck at 0%', status: 'in_progress', type: 'technical', reported_at: knex.fn.now(), learner_id: 'learner_3', admin_id: 'admin_1' }
  ]).onConflict('reported_id').ignore();
};