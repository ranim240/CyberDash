export const up = (knex) => knex.schema.alterTable('learner', (table) => {
  table.integer('solved_challenges').defaultTo(0);
});

export const down = (knex) => knex.schema.alterTable('learner', (table) => {
  table.dropColumn('solved_challenges');
});
