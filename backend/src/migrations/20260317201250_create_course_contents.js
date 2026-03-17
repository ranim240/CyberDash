export const up = (knex) => knex.schema.createTable('course_contents', (t) => {
  t.string('content_id').primary();
  t.string('course_id').notNullable().references('course_id').inTable('courses').onDelete('CASCADE');
  t.string('title').notNullable();
  t.text('data');
  t.boolean('is_published').defaultTo(false);
});

export const down = (knex) => knex.schema.dropTable('course_contents');