export const up = (knex) =>
   knex.schema.createTable('xp_history', (t) => {
    t.string('id').primary();
    t.string('user_id').references('user_id').inTable('user');
    t.string('challenge_id').references('challenge_id').inTable('challenge');
    t.integer('xp').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });


export const down = (knex) =>  knex.schema.dropTableIfExists('xp_history');