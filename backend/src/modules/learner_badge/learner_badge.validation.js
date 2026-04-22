// ==========================
// 🎯 VALIDATE AWARD BADGE
// ==========================
export const validateAwardBadge = (data) => {
  const errors = [];

  // learner_id
  if (!data.learner_id || typeof data.learner_id !== 'string') {
    errors.push('learner_id is required and must be a string');
  } else if (data.learner_id.trim() === '') {
    errors.push('learner_id cannot be empty');
  }

  // badge_id
  if (!data.badge_id || typeof data.badge_id !== 'string') {
    errors.push('badge_id is required and must be a string');
  } else if (data.badge_id.trim() === '') {
    errors.push('badge_id cannot be empty');
  }

  return errors;
};


// ==========================
// 📊 VALIDATE GET BADGE LEARNERS
// ==========================
export const validateGetBadgeLearners = (query) => {
  const errors = [];

  if (query.page !== undefined) {
    const page = Number(query.page);
    if (isNaN(page) || page < 1) {
      errors.push('page must be a positive integer');
    }
  }

  if (query.limit !== undefined) {
    const limit = Number(query.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push('limit must be between 1 and 100');
    }
  }

  return errors;
};