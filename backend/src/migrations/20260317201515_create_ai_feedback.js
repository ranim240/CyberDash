export const up = (knex) => knex.schema.createTable('ai_feedback', (t) => {
  t.string('feedback_id').primary();
  t.string('submission_id').references('submission_id').inTable('submissions').onDelete('CASCADE');
  t.text('content');
  t.string('feedback_type');
  t.float('confidence_score');
  t.timestamp('generated_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('ai_feedback');