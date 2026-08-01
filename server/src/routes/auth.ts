import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authRateLimiter, clearAuthViolations } from '../middleware/rateLimiter';
import { AppError } from '../middleware/errorHandler';
import {
  signUpUser,
  signInUser,
  refreshAccessToken,
  signOutUser,
  sendPasswordResetEmail,
  updateUserPassword,
} from '../services/authProvider';

const router = Router();

// Register
router.post(
  '/register',
  authRateLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { name, email, password } = req.body;

      // Create user in Supabase Auth
      const { accessToken, refreshToken, user } = await signUpUser(email, password, { name });

      // Clear rate limit violations on successful registration
      clearAuthViolations(req);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.user_metadata?.name || name,
            email: user.email,
            avatarUrl: user.user_metadata?.avatar_url,
            emailVerified: !!user.email_confirmed_at,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post(
  '/login',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { email, password } = req.body;

      // Sign in with Supabase Auth
      const { accessToken, refreshToken, user } = await signInUser(email, password);

      // Clear rate limit violations on successful login
      clearAuthViolations(req);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.user_metadata?.name,
            email: user.email,
            avatarUrl: user.user_metadata?.avatar_url,
            emailVerified: !!user.email_confirmed_at,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh token
router.post(
  '/refresh',
  [
    body('refreshToken').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { refreshToken } = req.body;

      // Refresh tokens using Supabase
      const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);

      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Logout
router.post(
  '/logout',
  authenticate,
  [
    body('refreshToken').notEmpty(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { refreshToken } = req.body;

      // Sign out from Supabase (revokes refresh token)
      await signOutUser(refreshToken);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// Forgot password
router.post(
  '/forgot-password',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { email } = req.body;

      // Send password reset email via Supabase
      // Supabase handles email sending and security (always returns success to prevent enumeration)
      await sendPasswordResetEmail(email);

      res.json({
        success: true,
        data: { status: 'ok' },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Reset password
// Note: Supabase handles password reset via email links
// This endpoint is for programmatic password updates (if needed)
router.post(
  '/reset-password',
  authRateLimiter,
  [
    body('accessToken').notEmpty(),
    body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { accessToken, newPassword } = req.body;

      // Update password via Supabase
      await updateUserPassword(accessToken, newPassword);

      res.json({
        success: true,
        data: { status: 'password_reset' },
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as authRoutes };
