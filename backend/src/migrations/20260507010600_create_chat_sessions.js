export const up = (knex) => knex.schema.createTable('chat_session', (t) => {
  t.string('session_id').primary();
  t.string('learner_id').notNullable().references('user_id').inTable('learner').onDelete('CASCADE');
  t.string('context_type');
  t.string('context_id');
  t.timestamp('started_at').defaultTo(knex.fn.now());
  t.timestamp('ended_at');
});

export const down = (knex) => knex.schema.dropTable('chat_session');
