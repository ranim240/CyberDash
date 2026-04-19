export const validateCreateChallengeFile = (data) => {
  const errors = [];

  // Required fields
  if (!data.file_id || data.file_id.trim() === '') {
    errors.push('file_id is required');
  }

  if (!data.challenge_id || data.challenge_id.trim() === '') {
    errors.push('challenge_id is required');
  }

  // Optional but validated fields
  if (data.file_name !== undefined && data.file_name !== null && data.file_name.trim() === '') {
    errors.push('file_name cannot be empty');
  }

  if (data.file_path !== undefined && data.file_path !== null && data.file_path.trim() === '') {
    errors.push('file_path cannot be empty');
  }

  if (data.file_size !== undefined && data.file_size !== null) {
    if (isNaN(data.file_size) || Number(data.file_size) < 0) {
      errors.push('file_size must be a non-negative integer');
    }
  }

  return errors;
};

export const validateUpdateChallengeFile = (data) => {
  const errors = [];

  // All fields are optional for update, but if present, must be valid
  if (data.file_name !== undefined && data.file_name !== null && data.file_name.trim() === '') {
    errors.push('file_name cannot be empty');
  }

  if (data.file_path !== undefined && data.file_path !== null && data.file_path.trim() === '') {
    errors.push('file_path cannot be empty');
  }

  if (data.file_size !== undefined && data.file_size !== null) {
    if (isNaN(data.file_size) || Number(data.file_size) < 0) {
      errors.push('file_size must be a non-negative integer');
    }
  }

  // Prevent updating primary keys
  if (data.file_id !== undefined) {
    errors.push('file_id cannot be updated');
  }

  if (data.challenge_id !== undefined) {
    errors.push('challenge_id cannot be updated');
  }

  return errors;
};