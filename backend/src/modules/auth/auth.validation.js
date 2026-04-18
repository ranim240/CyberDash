const ALLOWED_ROLES = ['learner', 'instructor'];

export const validateRegister = (data) => {
  const errors = [];
  if (!data.username || data.username.length < 3)
    errors.push("Username must be at least 3 characters long");
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push("Invalid email address");
  if (!data.password || data.password.length < 8)
    errors.push("Password must be at least 8 characters long");
  if (data.role && !ALLOWED_ROLES.includes(data.role))
    errors.push(`Role must be one of: ${ALLOWED_ROLES.join(', ')}`);
  return errors;
};

export const validateLogin = (data) => {
  const errors = [];
  if (!data.email) errors.push("Email is required");
  if (!data.password) errors.push("Password is required");
  return errors;
};

export const validateForgotPassword = (data) => {
  const errors = [];
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email address");
  }
  return errors;
};

export const validateResetPassword = (data) => {
  const errors = [];
  if (!data.newPassword || data.newPassword.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  return errors;
};
