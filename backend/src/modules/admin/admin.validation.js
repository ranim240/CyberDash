const VALID_USER_ROLES = ['learner', 'instructor', 'admin'];

// Note: Challenge validation moved to challenge.validation.js
// Note: Report validation moved to incident_report.validation.js

export const validateGetUsers = (query) => {
  const errors = [];
  
  if (query.role && !VALID_USER_ROLES.includes(query.role)) {
    errors.push(`Role must be one of: ${VALID_USER_ROLES.join(', ')}`);
  }
  
  if (query.is_active !== undefined && query.is_active !== '0' && query.is_active !== '1') {
    errors.push("is_active must be '0' or '1'");
  }
  
  if (query.page && (isNaN(query.page) || Number(query.page) < 1)) {
    errors.push("Page must be a positive integer");
  }
  
  if (query.limit && (isNaN(query.limit) || Number(query.limit) < 1 || Number(query.limit) > 100)) {
    errors.push("Limit must be between 1 and 100");
  }
  
  return errors;
};

export const validateUpdateUserStatus = (data) => {
  const errors = [];
  
  if (data.is_active === undefined) {
    errors.push("is_active is required");
  } else if (data.is_active !== '0' && data.is_active !== '1' && data.is_active !== 0 && data.is_active !== 1) {
    errors.push("is_active must be '0' or '1'");
  }
  
  return errors;
};

export const validatePagination = (query) => {
  const errors = [];
  
  if (query.page && (isNaN(query.page) || Number(query.page) < 1)) {
    errors.push("Page must be a positive integer");
  }
  
  if (query.limit && (isNaN(query.limit) || Number(query.limit) < 1 || Number(query.limit) > 100)) {
    errors.push("Limit must be between 1 and 100");
  }
  
  return errors;
};