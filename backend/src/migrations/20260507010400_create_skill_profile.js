export const up = (knex) => knex.schema.createTable('skill_profile', (t) => {
  t.string('learner_id').notNullable().references('user_id').inTable('learner').onDelete('CASCADE');
  t.string('skill_id').notNullable().references('skill_id').inTable('skill').onDelete('CASCADE');
  t.float('score').defaultTo(0.0);
  t.float('confidence').defaultTo(0.0);
  t.timestamp('updated_at').defaultTo(knex.fn.now());
  t.primary(['learner_id', 'skill_id']);
});

export const down = (knex) => knex.schema.dropTable('skill_profile');
