import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import authRouter    from './src/modules/auth/auth.routes.js';
import learnerRouter from './src/modules/learner/learner.routes.js';
import categoryRouter from './src/modules/category/category.routes.js';
//import instructorRouter  from './src/modules/instructor/instructor.routes.js';
import courseRouter      from './src/modules/course/course.routes.js';
import challengeRouter   from './src/modules/challenge/challenge.routes.js';
import submissionRouter  from './src/modules/submission/submission.routes.js';
// import aiRouter          from './src/modules/ai/ai.routes.js';
import badgeRouter       from './src/modules/badge/badge.routes.js';
import leaderboardRouter from './src/modules/leaderboard/leaderboard.routes.js';
import incidentRouter    from './src/modules/incident_report/incident_report.routes.js';
import adminRouter       from './src/modules/admin/admin.routes.js';
import challengeFileRoutes from './src/modules/challenge_file/challenge_file.routes.js';
import learnerBadgeRoutes from './src/modules/learner_badge/learner_badge.routes.js';
import sessionRouter from './src/modules/session/session.routes.js';

const app = express();

// Middlewares globaux
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',    authRouter);
app.use('/api/learner', learnerRouter);
app.use('/api/categories', categoryRouter);
//app.use('/api/instructor',  instructorRouter);
app.use('/api/courses',     courseRouter);
app.use('/api/challenges',  challengeRouter);
app.use('/api/submissions', submissionRouter);
// app.use('/api/ai',          aiRouter);
app.use('/api/badges',      badgeRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/incidents',   incidentRouter);
app.use('/api/admin',       adminRouter);
app.use('/api/challenge-files', challengeFileRoutes);
app.use('/api/learner-badges', learnerBadgeRoutes);
app.use('/api/sessions', sessionRouter);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API opérationnelle' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Route inconnue
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

export default app;