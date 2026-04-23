export const validateCreateChallengeFile = (data) => {
  const errors = [];

  // ==========================
  // 📌 REQUIRED FIELDS (FIXED)
  // ==========================

  if (!data.challenge_id || typeof data.challenge_id !== 'string') {
    errors.push('challenge_id is required');
  }

  // ==========================
  // 📌 OPTIONAL FIELDS SAFETY
  // ==========================

  if (data.file_name !== undefined) {
    if (typeof data.file_name !== 'string' || !data.file_name.trim()) {
      errors.push('file_name cannot be empty');
    }
  }

  if (data.file_path !== undefined) {
    if (typeof data.file_path !== 'string' || !data.file_path.trim()) {
      errors.push('file_path cannot be empty');
    }
  }

  if (data.file_size !== undefined) {
    const size = Number(data.file_size);
    if (isNaN(size) || size < 0) {
      errors.push('file_size must be a non-negative number');
    }
  }

  return errors;
};


// ==========================
// 📌 UPDATE VALIDATION
// ==========================
export const validateUpdateChallengeFile = (data) => {
  const errors = [];

  if (data.file_id !== undefined) {
    errors.push('file_id cannot be updated');
  }

  if (data.challenge_id !== undefined) {
    errors.push('challenge_id cannot be updated');
  }

  if (data.file_name !== undefined) {
    if (typeof data.file_name !== 'string' || !data.file_name.trim()) {
      errors.push('file_name cannot be empty');
    }
  }

  if (data.file_path !== undefined) {
    if (typeof data.file_path !== 'string' || !data.file_path.trim()) {
      errors.push('file_path cannot be empty');
    }
  }

  if (data.file_size !== undefined) {
    const size = Number(data.file_size);
    if (isNaN(size) || size < 0) {
      errors.push('file_size must be a non-negative number');
    }
  }

  return errors;
};