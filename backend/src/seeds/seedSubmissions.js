/**
 * Seed Submissions
 * Creates challenge submissions/answers
 * Run after seedChallengeSessions
 */

import { generateSubmissionId } from '../scripts/seedUtils.js';
import { session1Id, session2Id, session3Id, session4Id, session5Id, session7Id, session8Id, session9Id, session10Id } from './seedChallengeSessions.js';

// Export submission IDs for use in other seeds
export const submission1Id = generateSubmissionId(1);
export const submission2Id = generateSubmissionId(2);
export const submission3Id = generateSubmissionId(3);
export const submission4Id = generateSubmissionId(4);
export const submission5Id = generateSubmissionId(5);
export const submission8Id = generateSubmissionId(8);
export const submission9Id = generateSubmissionId(9);
export const submission14Id = generateSubmissionId(14);
export const submission16Id = generateSubmissionId(16);
export const submission17Id = generateSubmissionId(17);
export const submission20Id = generateSubmissionId(20);

export const seed = async (knex) => {
  // Delete existing data
  await knex('submission').del();

  // These session IDs should match those created in seedChallengeSessions
  // For now using placeholder format - update with actual IDs
  const SESSION_1_ID = 'session_001_f3b7b065'; // Update this
  const SESSION_2_ID = 'session_002_95785f70'; // Update this
  const SESSION_3_ID = 'session_003_0aa24155'; // Update this
  const SESSION_4_ID = 'session_004_36ea19ae'; // Update this
  const SESSION_5_ID = 'session_005_617d2dd5'; // Update this
  const SESSION_7_ID = 'session_007_d7c21d08'; // Update this
  const SESSION_8_ID = 'session_008_82a0e2eb'; // Update this
  const SESSION_9_ID = 'session_009_0a6e3d17'; // Update this
  const SESSION_10_ID = 'session_010_8c3e0bef'; // Update this

  const baseDate = new Date('2026-03-01');

  await knex('submission').insert([
    // Session 1 submissions - SQL Injection
    {
      submission_id: submission1Id,
      session_id: SESSION_1_ID,
      answer: "' OR '1'='1",
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 1 * 60 * 60 * 1000),
    },
    {
      submission_id: submission2Id,
      session_id: SESSION_1_ID,
      answer: "admin' --",
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000),
    },
    {
      submission_id: submission3Id,
      session_id: SESSION_1_ID,
      answer: "FLAG{sql_inj3ction_basics_solved}",
      is_correct: true,
      submitted_at: new Date(baseDate.getTime() + 3 * 60 * 60 * 1000),
    },

    // Session 2 submissions - XSS
    {
      submission_id: submission4Id,
      session_id: SESSION_2_ID,
      answer: '<script>alert("XSS")</script>',
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 5 * 60 * 60 * 1000),
    },
    {
      submission_id: submission5Id,
      session_id: SESSION_2_ID,
      answer: '<img src=x onerror=alert("XSS")>',
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 6 * 60 * 60 * 1000),
    },
    {
      submission_id: generateSubmissionId(6),
      session_id: SESSION_2_ID,
      answer: '<svg onload=alert("XSS")>',
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 7 * 60 * 60 * 1000),
    },
    {
      submission_id: generateSubmissionId(7),
      session_id: SESSION_2_ID,
      answer: 'javascript:alert("XSS")',
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000),
    },
    {
      submission_id: submission8Id,
      session_id: SESSION_2_ID,
      answer: 'FLAG{xss_attack_mastered}',
      is_correct: true,
      submitted_at: new Date(baseDate.getTime() + 9 * 60 * 60 * 1000),
    },

    // Session 3 submissions - Caesar Cipher
    {
      submission_id: submission9Id,
      session_id: SESSION_3_ID,
      answer: 'hello world',
      is_correct: true,
      submitted_at: new Date(baseDate.getTime() + 10 * 60 * 60 * 1000),
    },

    // Session 4 submissions - SQL Injection (Learner 2)
    {
      submission_id: generateSubmissionId(10),
      session_id: SESSION_4_ID,
      answer: "' OR '1'='1",
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 20 * 60 * 60 * 1000),
    },
    {
      submission_id: generateSubmissionId(11),
      session_id: SESSION_4_ID,
      answer: 'FLAG{sql_inj3ction_basics_solved}',
      is_correct: true,
      submitted_at: new Date(baseDate.getTime() + 21 * 60 * 60 * 1000),
    },

    // Session 5 submissions - Caesar Cipher (in progress, no correct answer)
    {
      submission_id: generateSubmissionId(12),
      session_id: SESSION_5_ID,
      answer: 'test1',
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 25 * 60 * 60 * 1000),
    },
    {
      submission_id: generateSubmissionId(13),
      session_id: SESSION_5_ID,
      answer: 'test2',
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 26 * 60 * 60 * 1000),
    },

    // Session 7 submissions - SQL Injection (Learner 4)
    {
      submission_id: submission14Id,
      session_id: SESSION_7_ID,
      answer: 'FLAG{sql_inj3ction_basics_solved}',
      is_correct: true,
      submitted_at: new Date(baseDate.getTime() + 30 * 60 * 60 * 1000),
    },

    // Session 8 submissions - XSS (Learner 4)
    {
      submission_id: generateSubmissionId(15),
      session_id: SESSION_8_ID,
      answer: '<script>alert("XSS")</script>',
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 40 * 60 * 60 * 1000),
    },
    {
      submission_id: submission16Id,
      session_id: SESSION_8_ID,
      answer: 'FLAG{xss_attack_mastered}',
      is_correct: true,
      submitted_at: new Date(baseDate.getTime() + 42 * 60 * 60 * 1000),
    },

    // Session 9 submissions - Caesar Cipher (Learner 4)
    {
      submission_id: submission17Id,
      session_id: SESSION_9_ID,
      answer: 'FLAG{caesar_cipher_broken}',
      is_correct: true,
      submitted_at: new Date(baseDate.getTime() + 50 * 60 * 60 * 1000),
    },

    // Session 10 submissions - RSA (Learner 4)
    {
      submission_id: generateSubmissionId(18),
      session_id: SESSION_10_ID,
      answer: 'attempt1',
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 60 * 60 * 60 * 1000),
    },
    {
      submission_id: generateSubmissionId(19),
      session_id: SESSION_10_ID,
      answer: 'attempt2',
      is_correct: false,
      submitted_at: new Date(baseDate.getTime() + 61 * 60 * 60 * 1000),
    },
    {
      submission_id: submission20Id,
      session_id: SESSION_10_ID,
      answer: 'FLAG{rsa_compromised}',
      is_correct: true,
      submitted_at: new Date(baseDate.getTime() + 63 * 60 * 60 * 1000),
    },
  ]);
};
