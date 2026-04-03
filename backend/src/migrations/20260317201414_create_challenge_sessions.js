export const up = (knex) => knex.schema.createTable('challenge_session', (t) => {
  t.string('session_id').primary();
  t.string('learner_id').notNullable().references('user_id').inTable('learner').onDelete('CASCADE');
  t.string('challenge_id').notNullable().references('challenge_id').inTable('challenge').onDelete('CASCADE');
  t.timestamp('started_at').defaultTo(knex.fn.now());
  t.timestamp('ended_at');
  t.integer('attempt_count').defaultTo(0);
});

export const down = (knex) => knex.schema.dropTable('challenge_session');