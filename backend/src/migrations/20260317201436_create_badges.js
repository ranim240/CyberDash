export const up = (knex) => knex.schema.createTable('badges', (t) => {
  t.string('badge_id').primary();
  t.string('name').notNullable();
  t.string('description');
  t.string('icon_url');
  t.string('condition_type');
  t.integer('condition_value');
  t.integer('xp_bonus').defaultTo(0);
  t.string('administrator_id').references('user_id').inTable('users').onDelete('SET NULL'); // ← admin qui a créé le badge
});

export const down = (knex) => knex.schema.dropTable('badges');