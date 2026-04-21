const VALID_REPORT_STATUSES = ['pending', 'reviewing', 'resolved', 'dismissed'];
const VALID_REPORT_TYPES = ['content', 'behavior', 'technical', 'other'];

export const validateCreateReport = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 5) {
    errors.push("Title must be at least 5 characters long");
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters long");
  }

  if (!data.type) {
    errors.push("Report type is required");
  } else if (!VALID_REPORT_TYPES.includes(data.type)) {
    errors.push(`Type must be one of: ${VALID_REPORT_TYPES.join(', ')}`);
  }

  return errors;
};

export const validateUpdateReportStatus = (data) => {
  const errors = [];

  if (!data.status) {
    errors.push("Status is required");
  } else if (!VALID_REPORT_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${VALID_REPORT_STATUSES.join(', ')}`);
  }

  return errors;
};

export const validateGetReports = (query) => {
  const errors = [];

  if (query.status && !VALID_REPORT_STATUSES.includes(query.status)) {
    errors.push(`Status must be one of: ${VALID_REPORT_STATUSES.join(', ')}`);
  }

  if (query.type && !VALID_REPORT_TYPES.includes(query.type)) {
    errors.push(`Type must be one of: ${VALID_REPORT_TYPES.join(', ')}`);
  }

  if (query.page && (isNaN(query.page) || Number(query.page) < 1)) {
    errors.push("Page must be a positive integer");
  }

  if (query.limit && (isNaN(query.limit) || Number(query.limit) < 1 || Number(query.limit) > 100)) {
    errors.push("Limit must be between 1 and 100");
  }

  return errors;
};