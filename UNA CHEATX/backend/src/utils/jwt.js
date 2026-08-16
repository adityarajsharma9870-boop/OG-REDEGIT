import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Generate JWT token
 */
export const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    {
      userId,
      role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expire,
    }
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
