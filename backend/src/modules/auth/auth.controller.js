import * as queries from './auth.queries.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { generateToken } from '../../utils/jwt.js';
import { validateRegister, validateLogin } from './auth.validation.js';

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
