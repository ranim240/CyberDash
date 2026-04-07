import * as queries from './auth.queries.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { generateToken } from '../../utils/jwt.js';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from './auth.validation.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // 0. Validate data
    const errors = validateRegister(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // 1. Check if user already exists
    const existingUser = await queries.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // 2. Hash the password
    const password_hash = await hashPassword(password);

    // 3. Create user
    await queries.createUser({ username, email, password_hash, role });

    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 0. Validate data
    const errors = validateLogin(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // 1. Find user
    const user = await queries.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 2. Verify password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Generate JWT Token
    const token = generateToken(user);

    // 4. Response
    res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 0. Validate data
    const errors = validateForgotPassword(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // 1. Find user by email
    const user = await queries.findUserByEmail(email);
    if (!user) {
      // Always return success to prevent email enumeration
      return res.json({ success: true, message: 'If this email exists, a reset link has been sent.' });
    }

    // 2. Generate a stateless reset token
    // The secret uses the user's current password hash. If the password changes, this token becomes invalid.
    const secret = JWT_SECRET + user.password_hash;
    const payload = {
      userId: user.user_id,
      email: user.email
    };
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });

    // 3. Generate Link (you might pass the port from env)
    const resetLink = `http://localhost:${process.env.PORT || 3000}/api/auth/reset-password/${user.user_id}/${token}`;

    // 4. Simulate sending an email
    console.log('\n--- EMAIL SIMULATION ---');
    console.log(`To: ${user.email}`);
    console.log(`Subject: Password Reset Request`);
    console.log(`Body: Click here to reset your password: ${resetLink}`);
    console.log('------------------------\n');

    res.json({
      success: true,
      message: 'If this email exists, a reset link has been sent.',
      // dev tool: keep this to copy test links easily during backend development
      dev_reset_link: resetLink
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const { newPassword } = req.body;

    // 0. Validate data
    const errors = validateResetPassword(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // 1. Fetch user
    const user = await queries.findUserById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired link' });
    }

    // 2. Verify token
    const secret = JWT_SECRET + user.password_hash;
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid or expired link' });
    }

    // 3. Hash new password & update
    const password_hash = await hashPassword(newPassword);
    await queries.updateUserPassword(userId, password_hash);

    res.json({ success: true, message: 'Password has been successfully reset' });
  } catch (error) {
    next(error);
  }
};
