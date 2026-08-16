import express from 'express';
import passport from 'passport';
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  resendVerificationEmail,
} from '../controllers/authController.js';
import { loginLimiter, emailVerificationLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';
import { authMiddleware } from '../middleware/auth.js';
import { config } from '../config/env.js';

const router = express.Router();

/**
 * Local authentication routes
 */

// Signup
router.post('/signup', signup);

// Login
router.post('/login', loginLimiter, login);

// Logout
router.post('/logout', logout);

// Verify email
router.post('/verify-email', emailVerificationLimiter, verifyEmail);

// Resend verification email
router.post('/resend-verification', emailVerificationLimiter, resendVerificationEmail);

// Forgot password
router.post('/forgot-password', passwordResetLimiter, forgotPassword);

// Reset password
router.post('/reset-password', passwordResetLimiter, resetPassword);

// Get current user
router.get('/me', authMiddleware, getCurrentUser);

/**
 * Google OAuth routes
 */

// Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
  (req, res) => {
    // Successful authentication
    const token = req.user.token;
    const user = req.user;

    // Redirect to frontend with token
    res.redirect(
      `${config.server.frontendUrl}/dashboard?token=${token}&user=${JSON.stringify(user)}`
    );
  }
);

export default router;
