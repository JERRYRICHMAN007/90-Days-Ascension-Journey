import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken, generateResetToken } from '../utils/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { AppError } from '../middleware/errorHandler';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/email';

const router = Router();
const prisma = new PrismaClient();

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

      // Check if user exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError(400, 'Email already registered', 'EMAIL_EXISTS');
      }

      // Create user
      const passwordHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          createdAt: true,
        },
      });

      // Generate tokens
      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);
      const refreshTokenHash = hashToken(refreshToken);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: refreshTokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.status(201).json({
        success: true,
        data: {
          user,
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

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await verifyPassword(user.passwordHash, password))) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }

      // Generate tokens
      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);
      const refreshTokenHash = hashToken(refreshToken);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: refreshTokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
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
      const { refreshToken } = req.body;
      const decoded = verifyRefreshToken(refreshToken);
      const tokenHash = hashToken(refreshToken);

      // Find and verify refresh token
      const storedToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw new AppError(401, 'Invalid or expired refresh token', 'INVALID_TOKEN');
      }

      // Rotate refresh token
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });

      const newAccessToken = signAccessToken(decoded.sub);
      const newRefreshToken = signRefreshToken(decoded.sub);
      const newTokenHash = hashToken(newRefreshToken);

      await prisma.refreshToken.create({
        data: {
          userId: decoded.sub,
          tokenHash: newTokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken,
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
      const { refreshToken } = req.body;
      const tokenHash = hashToken(refreshToken);

      // Revoke refresh token
      await prisma.refreshToken.updateMany({
        where: {
          tokenHash,
          userId: req.userId,
        },
        data: {
          revoked: true,
        },
      });

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
      const { email } = req.body;

      // Always return 200 to prevent email enumeration
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        const token = generateResetToken();
        const tokenHash = hashToken(token);

        // Delete old reset tokens
        await prisma.passwordReset.deleteMany({
          where: { userId: user.id },
        });

        // Create new reset token
        await prisma.passwordReset.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          },
        });

        // Send email
        await sendPasswordResetEmail(user.email, user.name, token, user.id);
      }

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
router.post(
  '/reset-password',
  authRateLimiter,
  [
    body('token').notEmpty(),
    body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { token, newPassword } = req.body;
      const tokenHash = hashToken(token);

      // Find reset token
      const resetToken = await prisma.passwordReset.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
        throw new AppError(400, 'Invalid or expired token', 'INVALID_TOKEN');
      }

      // Update password and mark token as used in transaction
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: resetToken.userId },
          data: {
            passwordHash: await hashPassword(newPassword),
          },
        });

        await tx.passwordReset.update({
          where: { id: resetToken.id },
          data: { used: true },
        });

        // Revoke all refresh tokens
        await tx.refreshToken.updateMany({
          where: { userId: resetToken.userId },
          data: { revoked: true },
        });
      });

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

