export const up = (knex) => knex.schema.createTable('enrollments', (t) => {
  t.string('learner_id').notNullable().references('user_id').inTable('learners').onDelete('CASCADE').primary();
  t.string('course_id').notNullable().references('course_id').inTable('courses').onDelete('CASCADE').primary();
  t.timestamp('enrolled_at').defaultTo(knex.fn.now());
  t.string('completion_status').defaultTo('in_progress');
});

export const down = (knex) => knex.schema.dropTable('enrollments');