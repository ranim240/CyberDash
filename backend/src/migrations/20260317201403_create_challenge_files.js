export const up = (knex) => knex.schema.createTable('challenge_file', (t) => {
  t.string('file_id').primary();
  t.string('challenge_id').notNullable().references('challenge_id').inTable('challenge').onDelete('CASCADE');
  t.string('file_name');
  t.string('file_path');
  t.bigInteger('file_size');
});

export const down = (knex) => knex.schema.dropTable('challenge_file');