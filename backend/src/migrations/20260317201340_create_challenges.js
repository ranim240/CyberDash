export const up = (knex) => knex.schema.createTable('challenges', (t) => {
  t.string('challenge_id').primary();
  t.string('title').notNullable();
  t.text('description');
  t.string('difficulty');
  t.integer('points').defaultTo(0);
  t.string('status').defaultTo('active');
  t.timestamp('created_at').defaultTo(knex.fn.now());
  t.string('flag');
  t.string('category_id').references('category_id').inTable('categories').onDelete('SET NULL');
  t.string('instructor_id').references('user_id').inTable('instructors').onDelete('SET NULL');
});

export const down = (knex) => knex.schema.dropTable('challenges');