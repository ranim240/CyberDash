/**
 * SEED DATA EXECUTION GUIDE
 * 
 * This directory contains seed files for the CyberDash database.
 * All seed files follow the Knex.js naming convention and are in the src/seeds directory.
 * 
 * IMPORTANT: Update placeholder IDs based on your actual seeded data before running multiple seeds.
 * 
 * EXECUTION ORDER
 * ===============
 * The seeds must be run in the following order due to foreign key dependencies:
 * 
 * 1. seedUtils.js               - Helper utilities (no DB operations, just exported functions)
 * 2. seedUsers.js               - Base user data (admin, instructor, learner)
 * 3. seedCategories.js          - Challenge categories
 * 4. seedBadges.js              - Achievement badges
 * 5. seedChallenges.js          - Challenges and challenge files
 * 6. seedCourses.js             - Courses
 * 7. seedCourseContents.js      - Course lessons and content
 * 8. seedEnrollments.js         - Course enrollments for learners
 * 9. seedChallengeSessions.js   - Challenge attempt sessions
 * 10. seedSubmissions.js        - Challenge submissions/answers
 * 11. seedXpHistory.js          - XP earning history
 * 12. seedLearnerBadges.js      - Badge awards to learners
 * 13. seedIncidentReports.js    - Incident/bug reports
 * 14. seedAiFeedback.js         - AI feedback on submissions
 * 
 * HOW TO RUN SEEDS
 * ================
 * 
 * Run all seeds automatically (recommended):
 *   npx knex seed:run
 * 
 * Run a specific seed file:
 *   npx knex seed:run --specific seedUsers.js
 * 
 * Run seeds in development environment:
 *   NODE_ENV=development npx knex seed:run
 * 
 * Check seed status:
 *   npx knex migrate:status
 * 
 * UPDATING PLACEHOLDER IDs
 * =========================
 * 
 * When running multiple seeds, the generated IDs in seedUsers.js will be different 
 * each time. You need to:
 * 
 * 1. Run seedUsers.js first
 * 2. Extract the actual user IDs from the database:
 *    SELECT user_id, username, role FROM user;
 * 
 * 3. Replace placeholder IDs in these files with actual IDs:
 *    - seedChallenges.js (INSTRUCTOR_1_ID, INSTRUCTOR_2_ID, CATEGORY_*_ID)
 *    - seedCourses.js (INSTRUCTOR_1_ID, INSTRUCTOR_2_ID)
 *    - seedBadges.js (ADMIN_1_ID)
 *    - seedEnrollments.js (LEARNER_*_ID, COURSE_*_ID)
 *    - seedChallengeSessions.js (LEARNER_*_ID, CHALLENGE_*_ID)
 *    - seedSubmissions.js (SESSION_*_ID)
 *    - seedXpHistory.js (LEARNER_*_ID, CHALLENGE_*_ID)
 *    - seedLearnerBadges.js (LEARNER_*_ID, BADGE_*_ID)
 *    - seedIncidentReports.js (LEARNER_*_ID, ADMIN_*_ID)
 *    - seedAiFeedback.js (SUBMISSION_*_ID)
 * 
 * DATABASE STATE AFTER SEEDING
 * =============================
 * 
 * After running all seeds, you'll have:
 * - 2 Admin users
 * - 2 Instructor users  
 * - 5 Learner users (with XP and level progression)
 * - 5 Challenge categories
 * - 5 Challenges with 8 associated files
 * - 6 Achievement badges
 * - 4 Courses with content
 * - Multiple course enrollments
 * - Challenge sessions and submissions with results
 * - XP history tracking
 * - Learner badge achievements
 * - Incident reports
 * - AI feedback on submissions
 * 
 * REVERSING SEEDS
 * ===============
 * 
 * To rollback all seeds (delete all data):
 *   npx knex migrate:rollback
 * 
 * CUSTOM SEED RUNNER
 * ==================
 * 
 * For automated ID linking, create a master seed file:
 * 
 * // seedMaster.js
 * exports.seed = async (knex) => {
 *   // Run seedUsers first to get actual IDs
 *   // Then extract IDs and inject into other seeds
 * };
 */

module.exports = {};
