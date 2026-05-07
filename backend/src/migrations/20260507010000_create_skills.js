export const up = (knex) => knex.schema.createTable('skill', (t) => {
  t.string('skill_id').primary();
  t.string('name').notNullable().unique();
  t.string('category_id').references('category_id').inTable('category').onDelete('SET NULL');
  t.text('description');
});

export const down = (knex) => knex.schema.dropTable('skill');
