import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { isDevAuthEnabled } from '../lib/supabaseConfig';
import { getUserById } from '../services/authProvider';

const router = Router();

router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (isDevAuthEnabled()) {
      const user = await getUserById(req.userId!);
      return res.json({
        success: true,
        data: {
          id: user.id,
          name: user.user_metadata?.name || req.userName || 'Aether User',
          email: user.email,
          avatarUrl: user.user_metadata?.avatar_url ?? null,
          preferences: {},
          emailVerified: !!user.email_confirmed_at,
          createdAt: user.email_confirmed_at || new Date().toISOString(),
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        preferences: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found', 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/me',
  authenticate,
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('preferences').optional().isObject(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      if (isDevAuthEnabled()) {
        const user = await getUserById(req.userId!);
        const { name } = req.body;
        return res.json({
          success: true,
          data: {
            id: user.id,
            name: name || user.user_metadata?.name,
            email: user.email,
            avatarUrl: user.user_metadata?.avatar_url ?? null,
            preferences: req.body.preferences || {},
            updatedAt: new Date().toISOString(),
          },
        });
      }

      const { name, preferences, avatarUrl } = req.body;
      const updateData: Record<string, unknown> = {};

      if (name) updateData.name = name;
      if (preferences) updateData.preferences = preferences;
      if (avatarUrl) updateData.avatarUrl = avatarUrl;

      const user = await prisma.user.update({
        where: { id: req.userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          preferences: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as userRoutes };
