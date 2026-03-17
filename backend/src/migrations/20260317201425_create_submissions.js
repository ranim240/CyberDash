export const up = (knex) => knex.schema.createTable('submissions', (t) => {
  t.string('submission_id').primary();
  t.string('session_id').notNullable().references('session_id').inTable('challenge_sessions').onDelete('CASCADE');
  t.text('answer');
  t.boolean('is_correct').defaultTo(false);
  t.timestamp('submitted_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('submissions');