/**
 * Seed AI Feedback
 * Creates AI-generated feedback for submissions
 * Run after seedSubmissions
 *
 * NOTE: Update submission IDs to match those created in seedSubmissions
 */

import { generateFeedbackId } from './seedUtils.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('ai_feedback').del();

  // These submission IDs should match those created in seedSubmissions
  // For now using placeholder format - update with actual IDs
  const SUBMISSION_1_ID = 'submission_001_62e57ca3'; // Update this - incorrect SQL injection
  const SUBMISSION_2_ID = 'submission_002_d4d203f6'; // Update this - incorrect SQL injection
  const SUBMISSION_3_ID = 'submission_003_a016c741'; // Update this - correct SQL injection
  const SUBMISSION_4_ID = 'submission_004_f7800caa'; // Update this - incorrect XSS
  const SUBMISSION_5_ID = 'submission_005_d77bc788'; // Update this - incorrect XSS
  const SUBMISSION_8_ID = 'submission_008_b461df72'; // Update this - correct XSS
  const SUBMISSION_9_ID = 'submission_009_ec371cbd'; // Update this - correct Caesar cipher
  const SUBMISSION_14_ID = 'submission_014_f183cbbb'; // Update this - correct SQL injection
  const SUBMISSION_16_ID = 'submission_016_e1d977b6'; // Update this - correct XSS
  const SUBMISSION_17_ID = 'submission_017_a7f1e3a5'; // Update this - correct Caesar cipher
  const SUBMISSION_20_ID = 'submission_020_9d5569aa'; // Update this - correct RSA

  const baseDate = new Date('2026-03-01');

  await knex('ai_feedback').insert([
    // Incorrect SQL injection attempted
    {
      feedback_id: generateFeedbackId(1),
      submission_id: SUBMISSION_1_ID,
      content: JSON.stringify({
        status: 'incorrect',
        message:
          'Your SQL injection attempt is incomplete. You used a basic OR clause, but did not properly close the quote.',
        hints: [
          'Think about how to properly close the string in the SQL query',
          'Consider using comment symbols to ignore the rest of the query',
          'What characters can you use to prevent a syntax error?',
        ],
        resources: [
          { title: 'SQL Comment Syntax', url: 'https://cyberdash.com/sql-comments' },
          { title: 'OR Operator in SQL', url: 'https://cyberdash.com/sql-or' },
        ],
      }),
      generated_at: new Date(baseDate.getTime() + 1 * 60 * 60 * 1000),
    },

    // Incorrect SQL injection attempted (second try)
    {
      feedback_id: generateFeedbackId(2),
      submission_id: SUBMISSION_2_ID,
      content: JSON.stringify({
        status: 'incorrect',
        message: 'Good use of the comment symbol, but the injection point needs adjustment. Check the login form structure.',
        hints: [
          'What is the expected format of the username field?',
          'Try to think about authentication logic',
        ],
        resources: [
          { title: 'SQL Injection in Authentication', url: 'https://cyberdash.com/sql-injection-auth' },
        ],
      }),
      generated_at: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000),
    },

    // Correct SQL injection flag
    {
      feedback_id: generateFeedbackId(3),
      submission_id: SUBMISSION_3_ID,
      content: JSON.stringify({
        status: 'correct',
        message: 'Excellent! You successfully demonstrated SQL injection vulnerability.',
        achievement: '+50 XP earned',
        explanation:
          'You correctly identified the injection point and used the comment symbol to bypass authentication logic.',
        nextSteps: [
          'Learn about parameterized queries for defense',
          'Try the "XSS Attack Patterns" challenge next',
        ],
      }),
      generated_at: new Date(baseDate.getTime() + 3 * 60 * 60 * 1000),
    },

    // Incorrect XSS attempt 1
    {
      feedback_id: generateFeedbackId(4),
      submission_id: SUBMISSION_4_ID,
      content: JSON.stringify({
        status: 'incorrect',
        message: 'Your script tag attempt will be filtered by the application. Try a different vector.',
        hints: [
          'The application filters <script> tags',
          'Consider using event handlers',
          'IMG, SVG, or BODY tags with event attributes could work',
        ],
        resources: [
          { title: 'XSS Vectors', url: 'https://cyberdash.com/xss-vectors' },
          { title: 'Event Handlers', url: 'https://cyberdash.com/javascript-events' },
        ],
      }),
      generated_at: new Date(baseDate.getTime() + 5 * 60 * 60 * 1000),
    },

    // Incorrect XSS attempt 2
    {
      feedback_id: generateFeedbackId(5),
      submission_id: SUBMISSION_5_ID,
      content: JSON.stringify({
        status: 'incorrect',
        message: 'IMG tag injection failed. The input field has additional validation. Check what characters are allowed.',
        hints: [
          'Are there any character restrictions?',
          'Try encoding techniques',
          'Consider alternative XSS vectors',
        ],
        resources: [
          { title: 'XSS Encoding Bypass', url: 'https://cyberdash.com/xss-encoding' },
        ],
      }),
      generated_at: new Date(baseDate.getTime() + 6 * 60 * 60 * 1000),
    },

    // Correct XSS flag
    {
      feedback_id: generateFeedbackId(8),
      submission_id: SUBMISSION_8_ID,
      content: JSON.stringify({
        status: 'correct',
        message: 'Perfect! You successfully exploited the XSS vulnerability.',
        achievement: '+100 XP earned',
        explanation:
          'You correctly identified that SVG with onload event handler can bypass input filters and execute arbitrary JavaScript.',
        nextSteps: [
          'Learn about Content Security Policy (CSP)',
          'Explore the "Caesar Cipher Challenge" next',
        ],
      }),
      generated_at: new Date(baseDate.getTime() + 9 * 60 * 60 * 1000),
    },

    // Correct Caesar cipher
    {
      feedback_id: generateFeedbackId(9),
      submission_id: SUBMISSION_9_ID,
      content: JSON.stringify({
        status: 'correct',
        message: 'Great! You decrypted the Caesar cipher correctly.',
        achievement: '+30 XP earned',
        explanation: 'Caesar cipher with shift of 7 was cracked by analyzing frequency patterns.',
        nextSteps: [
          'Learn about frequency analysis in cryptography',
          'Try the harder encryption challenges',
          'Read about cryptanalysis techniques',
        ],
      }),
      generated_at: new Date(baseDate.getTime() + 10 * 60 * 60 * 1000),
    },

    // Correct SQL injection (Learner 4)
    {
      feedback_id: generateFeedbackId(14),
      submission_id: SUBMISSION_14_ID,
      content: JSON.stringify({
        status: 'correct',
        message: 'Excellent work! You demonstrated mastery of basic SQL injection.',
        achievement: '+50 XP earned',
        explanation: 'Direct approach - comment-based attack to bypass authentication.',
        speedBonus: 'Solved faster than average!',
      }),
      generated_at: new Date(baseDate.getTime() + 30 * 60 * 60 * 1000),
    },

    // Correct XSS (Learner 4)
    {
      feedback_id: generateFeedbackId(16),
      submission_id: SUBMISSION_16_ID,
      content: JSON.stringify({
        status: 'correct',
        message: 'Outstanding! XSS challenge defeated.',
        achievement: '+100 XP earned',
        explanation: 'Correct usage of unsafe DOM manipulation combined with user input.',
      }),
      generated_at: new Date(baseDate.getTime() + 42 * 60 * 60 * 1000),
    },

    // Correct Caesar cipher (Learner 4)
    {
      feedback_id: generateFeedbackId(17),
      submission_id: SUBMISSION_17_ID,
      content: JSON.stringify({
        status: 'correct',
        message: 'Perfect! Caesar cipher decrypted successfully.',
        achievement: '+30 XP earned',
        explanation: 'Quick solution with correct decryption.',
      }),
      generated_at: new Date(baseDate.getTime() + 50 * 60 * 60 * 1000),
    },

    // Correct RSA (Learner 4)
    {
      feedback_id: generateFeedbackId(20),
      submission_id: SUBMISSION_20_ID,
      content: JSON.stringify({
        status: 'correct',
        message: 'Fantastic! You successfully cracked RSA encryption.',
        achievement: '+200 XP earned + Level Up!',
        explanation:
          'You correctly factored the semiprime and recovered the private key, allowing decryption of the message.',
        nextSteps: [
          'You are now qualified for Advanced Cryptography course',
          'Explore elliptic curve cryptography next',
        ],
      }),
      generated_at: new Date(baseDate.getTime() + 63 * 60 * 60 * 1000),
    },
  ]);
};
