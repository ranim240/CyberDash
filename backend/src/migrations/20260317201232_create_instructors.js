export const up = (knex) => knex.schema.createTable('instructors', (t) => {
  t.string('user_id').primary().references('user_id').inTable('users').onDelete('CASCADE');
});

export const down = (knex) => knex.schema.dropTable('instructors');