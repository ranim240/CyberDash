import jwt from 'jsonwebtoken';
import { error } from '../utils/response.js';
import db from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return error(res, 'No token, authorization denied', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db('users').where({ user_id: decoded.userId }).first();
    if (!user) return error(res, 'User not found', 401);

    req.user = { userId: user.user_id, role: user.role };
    next();
  } catch (err) {
    error(res, 'Token invalid', 401);
  }
};

