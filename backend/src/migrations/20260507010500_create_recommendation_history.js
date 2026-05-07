export const up = (knex) => knex.schema.createTable('recommendation_history', (t) => {
  t.string('recommendation_id').primary();
  t.string('learner_id').notNullable().references('user_id').inTable('learner').onDelete('CASCADE');
  t.string('challenge_id').notNullable().references('challenge_id').inTable('challenge').onDelete('CASCADE');
  t.float('predicted_difficulty').notNullable();
  t.boolean('clicked').defaultTo(false);
  t.string('result');
  t.timestamp('created_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('recommendation_history');
