export const up = (knex) => {
  return knex.schema.createTable('learner_badge', (t) => {
    t.string('learner_id')
      .notNullable()
      .references('user_id')
      .inTable('learner')
      .onDelete('CASCADE');

    t.string('badge_id')
      .notNullable()
      .references('badge_id')
      .inTable('badge')
      .onDelete('CASCADE');

    t.timestamp('awarded_at').defaultTo(knex.fn.now());

    t.primary(['learner_id', 'badge_id']); // ✅ correct PK
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('learner_badge');
};