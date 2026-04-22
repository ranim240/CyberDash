import api from './api';

// ── Auth Service — all auth API calls go through here ────────────
// Components should NEVER call api/fetch directly for auth.
// They import these functions instead.

/**
 * Login a user.
 * @param {string} email
 * @param {string} password
 * @returns {{ success, token, user: { id, username, role } }}
 */
export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

/**
 * Register a new user.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} role — 'learner' | 'instructor'
 * @returns {{ success, message }}
 */
export const register = async (username, email, password, role) => {
  const { data } = await api.post('/auth/register', { username, email, password, role });
  return data;
};

/**
 * Request a password reset email.
 * @param {string} email
 * @returns {{ success, message }}
 */
export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

/**
 * Reset the password using the JWT token from the email link.
 * @param {string} userId         — user ID from the URL
 * @param {string} token          — JWT reset token from the URL
 * @param {string} newPassword
 * @param {string} confirmPassword
 * @returns {{ success, message }}
 */
export const resetPassword = async (userId, token, newPassword, confirmPassword) => {
  const { data } = await api.post('/auth/reset-password', {
    userId,
    token,
    newPassword,
    confirmPassword
  });
  return data;
};
