// Validation for updating course progress
export const validateUpdateProgress = (data) => {
  const errors = [];
  const allowedStatus = ['in_progress', 'completed'];

  // Check if completion_status exists
  if (!data.completion_status) {
    errors.push('completion_status is required');
  } 
  // Check if completion_status is a valid value
  else if (!allowedStatus.includes(data.completion_status)) {
    errors.push(`completion_status must be one of: ${allowedStatus.join(', ')}`);
  }

  return  errors ;
};