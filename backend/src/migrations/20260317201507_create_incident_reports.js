export const up = (knex) => knex.schema.createTable('incident_reports', (t) => {
  t.string('reported_id').primary();
  t.string('title');
  t.text('description');
  t.string('status').defaultTo('pending');
  t.string('type');
  t.timestamp('reported_at').defaultTo(knex.fn.now());
  t.timestamp('resolved_at');
  t.string('learner_id').references('user_id').inTable('learners').onDelete('SET NULL');
  t.string('admin_id').references('user_id').inTable('users').onDelete('SET NULL');
});

export const down = (knex) => knex.schema.dropTable('incident_reports');