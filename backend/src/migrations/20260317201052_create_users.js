export const up = (knex) => knex.schema.createTable('user', (t) => {
  t.string('user_id').primary();
  t.string('username').notNullable().unique();
  t.string('email').notNullable().unique();
  t.string('password_hash').notNullable();
  t.string('role').notNullable(); // admin, learner, instructor
  t.timestamp('created_at').defaultTo(knex.fn.now());
  t.boolean('is_active').defaultTo(true);
});

export const down = (knex) => knex.schema.dropTable('user');