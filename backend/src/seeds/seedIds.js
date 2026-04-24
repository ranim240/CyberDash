/**
 * Centralized ID generation
 * All IDs are generated once and cached by Node.js module system
 * This ensures IDs are reused across all seed files without regeneration
 */

import {
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
} from './seedUtils.js';

// ============================================
// USER IDs - Generated Once
// ============================================
export const adminUser1Id = generateUserId(1);
export const adminUser2Id = generateUserId(2);

export const instructorUser1Id = generateUserId(3);
export const instructorUser2Id = generateUserId(4);

export const learnerUser1Id = generateUserId(5);
export const learnerUser2Id = generateUserId(6);
export const learnerUser3Id = generateUserId(7);
export const learnerUser4Id = generateUserId(8);
export const learnerUser5Id = generateUserId(9);

// ============================================
// CATEGORY IDs - Generated Once
// ============================================
export const category1Id = generateCategoryId(1);
export const category2Id = generateCategoryId(2);
export const category3Id = generateCategoryId(3);
export const category4Id = generateCategoryId(4);
export const category5Id = generateCategoryId(5);

// ============================================
// COURSE IDs - Generated Once
// ============================================
export const course1Id = generateCourseId(1);
export const course2Id = generateCourseId(2);
export const course3Id = generateCourseId(3);
export const course4Id = generateCourseId(4);

// ============================================
// CHALLENGE IDs - Generated Once
// ============================================
export const challenge1Id = generateChallengeId(1);
export const challenge2Id = generateChallengeId(2);
export const challenge3Id = generateChallengeId(3);
export const challenge4Id = generateChallengeId(4);
export const challenge5Id = generateChallengeId(5);

// ============================================
// CHALLENGE FILE IDs - Generated Once
// ============================================
export const file1Id = generateFileId(1);
export const file2Id = generateFileId(2);
export const file3Id = generateFileId(3);
export const file4Id = generateFileId(4);
export const file5Id = generateFileId(5);
export const file6Id = generateFileId(6);
export const file7Id = generateFileId(7);
export const file8Id = generateFileId(8);

// ============================================
// COURSE CONTENT IDs - Generated Once
// ============================================
export const content1Id = generateContentId(1);
export const content2Id = generateContentId(2);
export const content3Id = generateContentId(3);
export const content4Id = generateContentId(4);
export const content5Id = generateContentId(5);
export const content6Id = generateContentId(6);
export const content7Id = generateContentId(7);
export const content8Id = generateContentId(8);
export const content9Id = generateContentId(9);
export const content10Id = generateContentId(10);

// ============================================
// CHALLENGE SESSION IDs - Generated Once
// ============================================
export const session1Id = generateSessionId(1);
export const session2Id = generateSessionId(2);
export const session3Id = generateSessionId(3);
export const session4Id = generateSessionId(4);
export const session5Id = generateSessionId(5);
export const session6Id = generateSessionId(6);
export const session7Id = generateSessionId(7);
export const session8Id = generateSessionId(8);
export const session9Id = generateSessionId(9);
export const session10Id = generateSessionId(10);
export const session11Id = generateSessionId(11);

// ============================================
// SUBMISSION IDs - Generated Once
// ============================================
export const submission1Id = generateSubmissionId(1);
export const submission2Id = generateSubmissionId(2);
export const submission3Id = generateSubmissionId(3);
export const submission4Id = generateSubmissionId(4);
export const submission5Id = generateSubmissionId(5);
export const submission6Id = generateSubmissionId(6);
export const submission7Id = generateSubmissionId(7);
export const submission8Id = generateSubmissionId(8);
export const submission9Id = generateSubmissionId(9);
export const submission10Id = generateSubmissionId(10);
export const submission11Id = generateSubmissionId(11);
export const submission12Id = generateSubmissionId(12);
export const submission13Id = generateSubmissionId(13);
export const submission14Id = generateSubmissionId(14);
export const submission15Id = generateSubmissionId(15);
export const submission16Id = generateSubmissionId(16);
export const submission17Id = generateSubmissionId(17);
export const submission18Id = generateSubmissionId(18);
export const submission19Id = generateSubmissionId(19);
export const submission20Id = generateSubmissionId(20);

// ============================================
// BADGE IDs - Generated Once
// ============================================
export const badge1Id = generateBadgeId(1);
export const badge2Id = generateBadgeId(2);
export const badge3Id = generateBadgeId(3);
export const badge4Id = generateBadgeId(4);
export const badge5Id = generateBadgeId(5);
export const badge6Id = generateBadgeId(6);

// ============================================
// INCIDENT REPORT IDs - Generated Once
// ============================================
export const report1Id = generateReportId(1);
export const report2Id = generateReportId(2);
export const report3Id = generateReportId(3);
export const report4Id = generateReportId(4);
export const report5Id = generateReportId(5);

// ============================================
// AI FEEDBACK IDs - Generated Once
// ============================================
export const feedback1Id = generateFeedbackId(1);
export const feedback2Id = generateFeedbackId(2);
export const feedback3Id = generateFeedbackId(3);
export const feedback4Id = generateFeedbackId(4);
export const feedback5Id = generateFeedbackId(5);
export const feedback6Id = generateFeedbackId(6);
export const feedback8Id = generateFeedbackId(8);
export const feedback9Id = generateFeedbackId(9);
export const feedback14Id = generateFeedbackId(14);
export const feedback16Id = generateFeedbackId(16);
export const feedback17Id = generateFeedbackId(17);
export const feedback20Id = generateFeedbackId(20);

// ============================================
// XP HISTORY IDs - Generated Once
// ============================================
export const xpHistory1Id = generateXpHistoryId(learnerUser1Id, challenge1Id);
export const xpHistory2Id = generateXpHistoryId(learnerUser1Id, challenge2Id);
export const xpHistory3Id = generateXpHistoryId(learnerUser1Id, challenge3Id);
export const xpHistory4Id = generateXpHistoryId(learnerUser2Id, challenge1Id);
export const xpHistory5Id = generateXpHistoryId(learnerUser4Id, challenge1Id);
export const xpHistory6Id = generateXpHistoryId(learnerUser4Id, challenge2Id);
export const xpHistory7Id = generateXpHistoryId(learnerUser4Id, challenge3Id);
export const xpHistory8Id = generateXpHistoryId(learnerUser4Id, challenge4Id);
