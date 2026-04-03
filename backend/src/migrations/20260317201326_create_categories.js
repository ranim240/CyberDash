export const up = (knex) => knex.schema.createTable('category', (t) => {
  t.string('category_id').primary();
  t.string('name').notNullable();
  t.string('description');
  t.string('icon_url');
});

export const down = (knex) => knex.schema.dropTable('category');