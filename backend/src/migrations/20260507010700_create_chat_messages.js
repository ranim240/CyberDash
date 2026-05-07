export const up = (knex) => knex.schema.createTable('chat_message', (t) => {
  t.string('message_id').primary();
  t.string('session_id').notNullable().references('session_id').inTable('chat_session').onDelete('CASCADE');
  t.string('sender').notNullable();
  t.text('content').notNullable();
  t.timestamp('created_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('chat_message');
