export const up = (knex) => knex.schema.createTable('ai_feedback', (t) => {
  t.string('feedback_id').primary();
  t.string('submission_id').references('submission_id').inTable('submission').onDelete('CASCADE');
  t.text('content');
  t.timestamp('generated_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('ai_feedback');