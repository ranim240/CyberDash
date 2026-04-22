const VALID_CONDITION_TYPES = [
  'challenges_completed',
  'points_earned',
  'streak_days',
  'special'
];


// ==========================
// 📌 CREATE BADGE
// ==========================
export const validateCreateBadge = (data) => {
  const errors = [];

  // 🔹 name (required)
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('name is required');
  }

  // 🔹 condition_type (optional but validated)
  if (data.condition_type) {
    if (!VALID_CONDITION_TYPES.includes(data.condition_type)) {
      errors.push(
        `condition_type must be one of: ${VALID_CONDITION_TYPES.join(', ')}`
      );
    }
  }

  // 🔹 condition_value
  if (data.condition_value !== undefined) {
    const value = Number(data.condition_value);
    if (isNaN(value) || value < 0) {
      errors.push('condition_value must be a non-negative number');
    }
  }

  // 🔹 xp_bonus
  if (data.xp_bonus !== undefined) {
    const xp = Number(data.xp_bonus);
    if (isNaN(xp) || xp < 0) {
      errors.push('xp_bonus must be a non-negative number');
    }
  }

  return errors;
};


// ==========================
// 📌 UPDATE BADGE
// ==========================
export const validateUpdateBadge = (data) => {
  const errors = [];

  // ❌ never allow badge_id update
  if (data.badge_id !== undefined) {
    errors.push('badge_id cannot be updated');
  }

  // 🔹 name
  if (data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      errors.push('name cannot be empty');
    }
  }

  // 🔹 condition_type
  if (data.condition_type !== undefined) {
    if (!VALID_CONDITION_TYPES.includes(data.condition_type)) {
      errors.push(
        `condition_type must be one of: ${VALID_CONDITION_TYPES.join(', ')}`
      );
    }
  }

  // 🔹 condition_value
  if (data.condition_value !== undefined) {
    const value = Number(data.condition_value);
    if (isNaN(value) || value < 0) {
      errors.push('condition_value must be a non-negative number');
    }
  }

  // 🔹 xp_bonus
  if (data.xp_bonus !== undefined) {
    const xp = Number(data.xp_bonus);
    if (isNaN(xp) || xp < 0) {
      errors.push('xp_bonus must be a non-negative number');
    }
  }

  return errors;
};


// ==========================
// 📌 GET BADGES QUERY
// ==========================
export const validateGetBadges = (query) => {
  const errors = [];

  if (query.condition_type && !VALID_CONDITION_TYPES.includes(query.condition_type)) {
    errors.push(
      `condition_type must be one of: ${VALID_CONDITION_TYPES.join(', ')}`
    );
  }

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