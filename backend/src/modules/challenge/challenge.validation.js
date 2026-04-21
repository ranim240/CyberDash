// Challenge validation schemas
export const validateCreateChallenge = (data) => {
    const errors = [];
    
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        errors.push('Title is required and must be a non-empty string');
    }
    
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        errors.push('Description is required and must be a non-empty string');
    }
    
    if (!data.difficulty || !['easy', 'medium', 'hard'].includes(data.difficulty)) {
        errors.push('Difficulty must be one of: easy, medium, hard');
    }
    
    if (data.points && (typeof data.points !== 'number' || data.points < 0)) {
        errors.push('Points must be a non-negative number');
    }
    
    return errors;
};

export const validateUpdateChallenge = (data) => {
    const errors = [];
    
    if (data.title && (typeof data.title !== 'string' || data.title.trim().length === 0)) {
        errors.push('Title must be a non-empty string');
    }
    
    if (data.description && (typeof data.description !== 'string' || data.description.trim().length === 0)) {
        errors.push('Description must be a non-empty string');
    }
    
    if (data.difficulty && !['easy', 'medium', 'hard'].includes(data.difficulty)) {
        errors.push('Difficulty must be one of: easy, medium, hard');
    }
    
    if (data.points && (typeof data.points !== 'number' || data.points < 0)) {
        errors.push('Points must be a non-negative number');
    }
    
    return errors;
};

const VALID_CHALLENGE_STATUSES = ['pending', 'approved', 'rejected'];
export const validateUpdateChallengeStatus = (data) => {
  const errors = [];
  
  if (!data.status) {
    errors.push("Status is required");
  } else if (!VALID_CHALLENGE_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${VALID_CHALLENGE_STATUSES.join(', ')}`);
  }
  
  return errors;
};