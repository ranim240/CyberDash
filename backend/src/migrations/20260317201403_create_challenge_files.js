export const up = (knex) => knex.schema.createTable('challenge_files', (t) => {
  t.string('file_id').primary();
  t.string('challenge_id').notNullable().references('challenge_id').inTable('challenges').onDelete('CASCADE');
  t.string('field');
  t.string('file_name');
  t.string('file_path');
  t.bigInteger('file_size');
});

export const down = (knex) => knex.schema.dropTable('challenge_files');