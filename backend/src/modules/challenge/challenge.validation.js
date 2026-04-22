import {
  CHALLENGE_STATUS_LIST,
  CHALLENGE_DIFFICULTY
} from '../constants/challengeStatus.js';


// ==========================
// 📌 CREATE CHALLENGE
// ==========================

export const validateCreateChallenge = (data) => {
  const errors = [];

  // Title
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Title is required and must be a non-empty string');
  }

  // Description
  if (!data.description || typeof data.description !== 'string' || !data.description.trim()) {
    errors.push('Description is required and must be a non-empty string');
  }

  // Difficulty
  if (!data.difficulty || !CHALLENGE_DIFFICULTY.includes(data.difficulty)) {
    errors.push(`Difficulty must be one of: ${CHALLENGE_DIFFICULTY.join(', ')}`);
  }

  // Points (allow 0)
  if (
    data.points === undefined ||
    data.points === null ||
    isNaN(Number(data.points)) ||
    Number(data.points) < 0
  ) {
    errors.push('Points must be a non-negative number');
  }

  // Flag
  if (!data.flag || typeof data.flag !== 'string' || !data.flag.trim()) {
    errors.push('Flag is required and must be a non-empty string');
  }

  // Category
  if (!data.category_id) {
    errors.push('Category is required');
  }

  return errors;
};


// ==========================
// 📌 UPDATE CHALLENGE
// ==========================

export const validateUpdateChallenge = (data) => {
  const errors = [];

  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || !data.title.trim()) {
      errors.push('Title must be a non-empty string');
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== 'string' || !data.description.trim()) {
      errors.push('Description must be a non-empty string');
    }
  }

  if (data.difficulty !== undefined) {
    if (!CHALLENGE_DIFFICULTY.includes(data.difficulty)) {
      errors.push(`Difficulty must be one of: ${CHALLENGE_DIFFICULTY.join(', ')}`);
    }
  }

  if (data.points !== undefined) {
    if (isNaN(Number(data.points)) || Number(data.points) < 0) {
      errors.push('Points must be a non-negative number');
    }
  }

  return errors;
};


// ==========================
// 📌 STATUS UPDATE
// ==========================

export const validateUpdateChallengeStatus = (data) => {
  const errors = [];

  if (!data.status) {
    errors.push('Status is required');
  } else if (!CHALLENGE_STATUS_LIST.includes(data.status)) {
    errors.push(
      `Status must be one of: ${CHALLENGE_STATUS_LIST.join(', ')}`
    );
  }

  return errors;
};