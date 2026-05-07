export const up = (knex) => knex.schema.createTable('challenge_attempt_metrics', (t) => {
  t.string('metric_id').primary();
  t.string('submission_id').notNullable().references('submission_id').inTable('submission').onDelete('CASCADE');
  t.integer('attempt_number').notNullable();
  t.integer('time_spent_seconds').defaultTo(0);
  t.string('error_type');
  t.boolean('hint_used').defaultTo(false);
});

export const down = (knex) => knex.schema.dropTable('challenge_attempt_metrics');
