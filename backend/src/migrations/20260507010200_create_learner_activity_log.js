export const up = (knex) => knex.schema.createTable('learner_activity_log', (t) => {
  t.string('log_id').primary();
  t.string('user_id').notNullable().references('user_id').inTable('learner').onDelete('CASCADE');
  t.string('action_type').notNullable();
  t.string('target_type').notNullable();
  t.string('target_id').notNullable();
  t.integer('duration_seconds').defaultTo(0);
  t.timestamp('created_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('learner_activity_log');
