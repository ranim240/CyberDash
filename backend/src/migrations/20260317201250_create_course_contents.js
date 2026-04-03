export const up = (knex) => knex.schema.createTable('course_content', (t) => {
  t.string('content_id').primary();
  t.string('course_id').notNullable().references('course_id').inTable('course').onDelete('CASCADE');
  t.string('title').notNullable();
  t.text('data');
  t.boolean('is_published').defaultTo(false);
});

export const down = (knex) => knex.schema.dropTable('course_content');