import knex from 'knex';
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from './env.js';

const db = knex({
  client: 'pg',
  connection: {
    host:     DB_HOST,
    port:     DB_PORT,
    database: DB_NAME,
    user:     DB_USER,
    password: DB_PASSWORD,
  },
});

db.raw('SELECT 1')
  .then(() => console.log('PostgreSQL connecté'))
  .catch((err) => console.error('Erreur connexion DB :', err.message));

export default db;