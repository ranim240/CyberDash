import app from './app.js';
import './src/config/db.js';
import 'dotenv/config';
import { PORT } from './src/config/env.js';
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});