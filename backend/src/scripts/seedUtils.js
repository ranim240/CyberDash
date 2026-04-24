/**
 * Seed utilities - Helper functions for generating seed data
 * Note: In production, replace with proper UUID generation (uuid library)
 */

import crypto from 'crypto';
import bcrypt from 'bcrypt';

/**
 * Generate a deterministic ID based on prefix and index
 * @param {string} prefix - ID prefix (e.g., 'user', 'course')
 * @param {number} index - Index for uniqueness
 * @returns {string} Generated ID
 */
const generateId = (prefix, index) => {
  return `${prefix}_${String(index).padStart(3, '0')}_${crypto.randomBytes(4).toString('hex')}`;
};

/**
 * Generate user ID
 * @param {number} index
 * @returns {string}
 */
const generateUserId = (index) => generateId('user', index);

/**
 * Generate course ID
 * @param {number} index
 * @returns {string}
 */
const generateCourseId = (index) => generateId('course', index);

/**
 * Generate challenge ID
 * @param {number} index
 * @returns {string}
 */
const generateChallengeId = (index) => generateId('challenge', index);

/**
 * Generate category ID
 * @param {number} index
 * @returns {string}
 */
const generateCategoryId = (index) => generateId('category', index);

/**
 * Generate content ID
 * @param {number} index
 * @returns {string}
 */
const generateContentId = (index) => generateId('content', index);

/**
 * Generate challenge file ID
 * @param {number} index
 * @returns {string}
 */
const generateFileId = (index) => generateId('file', index);

/**
 * Generate session ID
 * @param {number} index
 * @returns {string}
 */
const generateSessionId = (index) => generateId('session', index);

/**
 * Generate submission ID
 * @param {number} index
 * @returns {string}
 */
const generateSubmissionId = (index) => generateId('submission', index);

/**
 * Generate badge ID
 * @param {number} index
 * @returns {string}
 */
const generateBadgeId = (index) => generateId('badge', index);

/**
 * Generate report ID
 * @param {number} index
 * @returns {string}
 */
const generateReportId = (index) => generateId('report', index);

/**
 * Generate feedback ID
 * @param {number} index
 * @returns {string}
 */
const generateFeedbackId = (index) => generateId('feedback', index);

/**
 * Generate XP history ID
 * @param {string} userId
 * @param {string} challengeId
 * @returns {string}
 */
const generateXpHistoryId = (userId, challengeId) => {
  return `${userId}_${challengeId}_${crypto.randomBytes(4).toString('hex')}`;
};

/**
 * Hash password using bcrypt
 * @param {string} password
 * @returns {Promise<string>}
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Generate realistic dates within range
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Date}
 */
const randomDate = (startDate, endDate) => {
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

/**
 * Generate past date (days ago)
 * @param {number} daysAgo
 * @returns {Date}
 */
const daysAgo = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

export {
  generateId,
  generateUserId,
  generateCourseId,
  generateChallengeId,
  generateCategoryId,
  generateContentId,
  generateFileId,
  generateSessionId,
  generateSubmissionId,
  generateBadgeId,
  generateReportId,
  generateFeedbackId,
  generateXpHistoryId,
  hashPassword,
  randomDate,
  daysAgo,
};
