export const up = (knex) => knex.schema.createTable('challenge_skill', (t) => {
  t.string('challenge_id').notNullable().references('challenge_id').inTable('challenge').onDelete('CASCADE');
  t.string('skill_id').notNullable().references('skill_id').inTable('skill').onDelete('CASCADE');
  t.float('weight').defaultTo(1.0);
  t.primary(['challenge_id', 'skill_id']);
});

export const down = (knex) => knex.schema.dropTable('challenge_skill');
