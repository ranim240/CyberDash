export const up = (knex) => knex.schema.createTable('learners', (t) => {
  t.string('user_id').primary().references('user_id').inTable('users').onDelete('CASCADE');
  t.integer('xp_points').defaultTo(0);
  t.integer('current_level').defaultTo(1);
  t.integer('streak').defaultTo(0);
});

export const down = (knex) => knex.schema.dropTable('learners');