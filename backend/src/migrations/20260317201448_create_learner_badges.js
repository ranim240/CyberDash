export const up = (knex) => knex.schema.createTable('learner_badges', (t) => {
  t.string('learner_id').notNullable().references('user_id').inTable('learners').onDelete('CASCADE').primary();
  t.string('badge_id').notNullable().references('badge_id').inTable('badges').onDelete('CASCADE').primary();
  t.timestamp('awarded_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('learner_badges');