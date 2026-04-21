export const validateAwardBadge = (data) => {
  const errors = [];

  // Required fields
  if (!data.learner_id || data.learner_id.trim() === '') {
    errors.push('learner_id is required');
  }

  if (!data.badge_id || data.badge_id.trim() === '') {
    errors.push('badge_id is required');
  }

  return errors;
};

export const validateGetBadgeLearners = (query) => {
  const errors = [];

  if (query.page && (isNaN(query.page) || Number(query.page) < 1)) {
    errors.push('page must be a positive integer');
  }

  if (query.limit && (isNaN(query.limit) || Number(query.limit) < 1 || Number(query.limit) > 100)) {
    errors.push('limit must be between 1 and 100');
  }

  return errors;
};