export const up = (knex) => knex.schema.createTable('learner_badges', (t) => {
  t.increments('id').primary();
  t.string('learner_id').notNullable().references('user_id').inTable('learners').onDelete('CASCADE');
  t.string('badge_id').notNullable().references('badge_id').inTable('badges').onDelete('CASCADE');
  t.timestamp('awarded_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('learner_badges');