// ================= CREATE =================
export const validateCreateCategory = (data) => {
  const errors = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (data.name && data.name.length > 100) {
    errors.push('Name must not exceed 100 characters');
  }

  // Description (optional)
  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      errors.push('Description must be a string');
    } else if (data.description.length > 500) {
      errors.push('Description must not exceed 500 characters');
    }
  }

  // Icon URL (optional)
  if (data.icon_url !== undefined && data.icon_url !== null) {
    if (typeof data.icon_url !== 'string' || data.icon_url.trim() === '') {
      errors.push('icon_url must be a valid string');
    }

    // simple URL check
    const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
    if (!urlRegex.test(data.icon_url)) {
      errors.push('icon_url must be a valid URL');
    }
  }

  return errors;
};


// ================= UPDATE =================
export const validateUpdateCategory = (data) => {
  const errors = [];

  const hasValidField =
    (data.name && data.name.trim() !== '') ||
    (data.description && data.description.trim() !== '') ||
    (data.icon_url && data.icon_url.trim() !== '');

  if (!hasValidField) {
    errors.push('At least one valid field (name, description, icon_url) is required');
  }

  // Name validation
  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    if (data.name.length > 100) {
      errors.push('Name must not exceed 100 characters');
    }
  }

  // Description validation
  if (data.description !== undefined) {
    if (typeof data.description !== 'string') {
      errors.push('Description must be a string');
    } else if (data.description.length > 500) {
      errors.push('Description must not exceed 500 characters');
    }
  }

  // Icon URL validation
  if (data.icon_url !== undefined) {
    if (typeof data.icon_url !== 'string' || data.icon_url.trim() === '') {
      errors.push('icon_url must be a valid string');
    }

    const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
    if (!urlRegex.test(data.icon_url)) {
      errors.push('icon_url must be a valid URL');
    }
  }

  return errors;
};