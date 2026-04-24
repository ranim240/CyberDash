import api from '../api/axios';

// All authentication API calls
// These functions are used by the components to interact with the backend auth module.

// Login user and return token + user data
export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

// Register a new user (Learner or Instructor)
export const register = async (username, email, password, role) => {
  const { data } = await api.post('/auth/register', { username, email, password, role });
  return data;
};

// Request a password reset link via email
export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

// Reset password using the token received in the email
export const resetPassword = async (userId, token, newPassword, confirmPassword) => {
  const { data } = await api.post(`/auth/reset-password/${userId}/${token}`, {
    userId,
    token,
    newPassword,
    confirmPassword
  });
  return data;
};
