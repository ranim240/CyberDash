const VALID_CONDITION_TYPES = ['challenges_completed', 'points_earned', 'streak_days', 'special'];

export const validateCreateBadge = (data) => {
  const errors = [];

  // Required fields
  if (!data.badge_id || data.badge_id.trim() === '') {
    errors.push('badge_id is required');
  }

  if (!data.name || data.name.trim() === '') {
    errors.push('name is required');
  }

  // Optional but validated fields
  if (data.condition_type && !VALID_CONDITION_TYPES.includes(data.condition_type)) {
    errors.push(`condition_type must be one of: ${VALID_CONDITION_TYPES.join(', ')}`);
  }

  if (data.condition_value !== undefined && data.condition_value !== null) {
    if (isNaN(data.condition_value) || Number(data.condition_value) < 0) {
      errors.push('condition_value must be a non-negative integer');
    }
  }

  if (data.xp_bonus !== undefined && data.xp_bonus !== null) {
    if (isNaN(data.xp_bonus) || Number(data.xp_bonus) < 0) {
      errors.push('xp_bonus must be a non-negative integer');
    }
  }

  return errors;
};

export const validateUpdateBadge = (data) => {
  const errors = [];

  // All fields are optional for update, but if present, must be valid
  if (data.name !== undefined && (!data.name || data.name.trim() === '')) {
    errors.push('name cannot be empty');
  }

  if (data.condition_type && !VALID_CONDITION_TYPES.includes(data.condition_type)) {
    errors.push(`condition_type must be one of: ${VALID_CONDITION_TYPES.join(', ')}`);
  }

  if (data.condition_value !== undefined && data.condition_value !== null) {
    if (isNaN(data.condition_value) || Number(data.condition_value) < 0) {
      errors.push('condition_value must be a non-negative integer');
    }
  }

  if (data.xp_bonus !== undefined && data.xp_bonus !== null) {
    if (isNaN(data.xp_bonus) || Number(data.xp_bonus) < 0) {
      errors.push('xp_bonus must be a non-negative integer');
    }
  }

  // Prevent updating badge_id
  if (data.badge_id !== undefined) {
    errors.push('badge_id cannot be updated');
  }

  return errors;
};

export const validateGetBadges = (query) => {
  const errors = [];

  if (query.condition_type && !VALID_CONDITION_TYPES.includes(query.condition_type)) {
    errors.push(`condition_type must be one of: ${VALID_CONDITION_TYPES.join(', ')}`);
  }

  if (query.page && (isNaN(query.page) || Number(query.page) < 1)) {
    errors.push('page must be a positive integer');
  }

  if (query.limit && (isNaN(query.limit) || Number(query.limit) < 1 || Number(query.limit) > 100)) {
    errors.push('limit must be between 1 and 100');
  }

  return errors;
};