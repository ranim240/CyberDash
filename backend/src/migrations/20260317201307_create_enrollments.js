export const up = (knex) => knex.schema.createTable('enrollment', (t) => {
  t.string('learner_id').notNullable().references('user_id').inTable('learner').onDelete('CASCADE');
  t.string('course_id').notNullable().references('course_id').inTable('course').onDelete('CASCADE');
  t.timestamp('enrolled_at').defaultTo(knex.fn.now());
  t.string('completion_status').defaultTo('in_progress');
  t.primary(['learner_id', 'course_id']);
});

export const down = (knex) => knex.schema.dropTable('enrollment');