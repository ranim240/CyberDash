export const up = (knex) => knex.schema.createTable('enrollments', (t) => {
  t.string('id').primary();
  t.string('learner_id').notNullable().references('user_id').inTable('learners').onDelete('CASCADE');
  t.string('course_id').notNullable().references('course_id').inTable('courses').onDelete('CASCADE');
  t.timestamp('enrolled_at').defaultTo(knex.fn.now());
  t.string('completion_status').defaultTo('in_progress');
  t.timestamp('last_accessed_at');
});

export const down = (knex) => knex.schema.dropTable('enrollments');