require('dotenv').config();

module.exports = {
  client: 'pg',
  connection: {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    directory: './src/migrations',
  },
};
// ```

// ---

// **2. Ordre des migrations** (respecte les dépendances entre tables)
// ```
// 001_create_users.js
// 002_create_learners.js
// 003_create_instructors.js
// 004_create_courses.js
// 005_create_course_contents.js
// 006_create_enrollments.js
// 007_create_challenges.js
// 008_create_challenge_files.js
// 009_create_challenge_sessions.js
// 010_create_submissions.js
// 011_create_categories.js
// 012_create_badges.js
// 013_create_leaderboard.js
// 014_create_incident_reports.js