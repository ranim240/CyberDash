export const seed = async (knex) => {
  await knex('incident_report').del();

  await knex('incident_report').insert([
    {
      reported_id: 'rep_1',
      title: 'Suspicious activity',
      description: 'Multiple failed login attempts',
      status: 'pending',
      type: 'security',
      reported_at: new Date(),
      resolved_at: null,
      learner_id: 'user_1',
      admin_id: 'user_2',
    },
    {
      reported_id: 'rep_2',
      title: 'Possible data leak',
      description: 'Sensitive data exposure detected',
      status: 'resolved',
      type: 'data',
      reported_at: new Date(),
      resolved_at: new Date(),
      learner_id: 'user_2',
      admin_id: 'user_1',
    },
  ]);
};