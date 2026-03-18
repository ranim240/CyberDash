export const up = (knex) => knex.schema.createTable('course', (t) => {
  t.string('course_id').primary();
  t.string('title').notNullable();
  t.string('description');
  t.integer('estimated_duration');
  t.string('level');
  t.boolean('is_published').defaultTo(false);
  t.timestamp('created_at').defaultTo(knex.fn.now());
  t.string('instructor_id').references('user_id').inTable('instructors').onDelete('SET NULL');
});

export const down = (knex) => knex.schema.dropTable('course');