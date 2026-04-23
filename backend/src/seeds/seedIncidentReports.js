/**
 * Seed Incident Reports
 * Creates incident/bug reports from learners
 * Run after seedUsers
 */

import { generateReportId } from '../scripts/seedUtils.js';
import { learnerUser1Id, learnerUser2Id, adminUser1Id, adminUser2Id } from './seedUsers.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('incident_report').del();

  // Use imported IDs from seedUsers
  const LEARNER_1_ID = learnerUser1Id;
  const LEARNER_2_ID = learnerUser2Id;
  const ADMIN_1_ID = adminUser1Id;
  const ADMIN_2_ID = adminUser2Id;

  const baseDate = new Date('2026-03-01');

  await knex('incident_report').insert([
    {
      reported_id: generateReportId(1),
      title: 'SQL Challenge Flag Not Validating',
      description:
        'I solved the SQL injection challenge and submitted the flag "FLAG{sql_inj3ction_basics_solved}" but it was marked as incorrect.',
      status: 'resolved',
      type: 'bug',
      reported_at: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      resolved_at: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      learner_id: LEARNER_1_ID,
      admin_id: ADMIN_1_ID,
    },
    {
      reported_id: generateReportId(2),
      title: 'Challenge File Download Error',
      description: 'The challenge file for XSS Challenge fails to download. Getting 404 error.',
      status: 'in_progress',
      type: 'bug',
      reported_at: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      resolved_at: null,
      learner_id: LEARNER_2_ID,
      admin_id: ADMIN_2_ID,
    },
    {
      reported_id: generateReportId(3),
      title: 'User Cheating Suspected',
      description: 'User submitted multiple challenges in very short timeframe, suspected of trial-and-error automated attacks.',
      status: 'pending',
      type: 'security',
      reported_at: new Date(baseDate.getTime() + 8 * 24 * 60 * 60 * 1000),
      resolved_at: null,
      learner_id: LEARNER_1_ID,
      admin_id: null,
    },
    {
      reported_id: generateReportId(4),
      title: 'Course Content Formatting Issue',
      description: 'The code examples in Module 2 of Cryptography course are not properly formatted/displayed.',
      status: 'resolved',
      type: 'feature_request',
      reported_at: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      resolved_at: new Date(baseDate.getTime() + 6 * 24 * 60 * 60 * 1000),
      learner_id: LEARNER_2_ID,
      admin_id: ADMIN_1_ID,
    },
    {
      reported_id: generateReportId(5),
      title: 'Challenge Difficulty Mismatch',
      description: 'The "Caesar Cipher" challenge is labeled as beginner but is more difficult than intermediate challenges.',
      status: 'in_progress',
      type: 'feedback',
      reported_at: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      resolved_at: null,
      learner_id: LEARNER_1_ID,
      admin_id: ADMIN_2_ID,
    },
  ]);
};
