export const up = (knex) => knex.schema.createTable('leaderboard', (t) => {
  t.string('leaderboard_id').primary();
  t.string('period');
   t.string('category_id')
    .references('category_id')
    .inTable('categories')
    .onDelete('SET NULL');
});

export const down = (knex) => knex.schema.dropTable('leaderboard');