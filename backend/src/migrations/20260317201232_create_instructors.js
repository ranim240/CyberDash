export const up = (knex) => knex.schema.createTable('instructor', (t) => {
  t.string('user_id').primary().references('user_id').inTable('user').onDelete('CASCADE');
});

export const down = (knex) => knex.schema.dropTable('instructor');