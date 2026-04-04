import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import authRouter    from './src/modules/auth/auth.routes.js';
import learnerRouter from './src/modules/learner/learner.routes.js';
// import instructorRouter  from './src/modules/instructor/instructor.routes.js';
// import courseRouter      from './src/modules/course/course.routes.js';
// import challengeRouter   from './src/modules/challenge/challenge.routes.js';
// import submissionRouter  from './src/modules/submission/submission.routes.js';
// import aiRouter          from './src/modules/ai/ai.routes.js';
// import badgeRouter       from './src/modules/badge/badge.routes.js';
// import leaderboardRouter from './src/modules/leaderboard/leaderboard.routes.js';
// import incidentRouter    from './src/modules/incident/incident.routes.js';
// import adminRouter       from './src/modules/admin/admin.routes.js';

const app = express();

// Middlewares globaux
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',    authRouter);
app.use('/api/learner', learnerRouter);
// app.use('/api/instructor',  instructorRouter);
// app.use('/api/courses',     courseRouter);
// app.use('/api/challenges',  challengeRouter);
// app.use('/api/submissions', submissionRouter);
// app.use('/api/ai',          aiRouter);
// app.use('/api/badges',      badgeRouter);
// app.use('/api/leaderboard', leaderboardRouter);
// app.use('/api/incidents',   incidentRouter);
// app.use('/api/admin',       adminRouter);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API opérationnelle' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
  });
});

// Route inconnue
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

export default app;