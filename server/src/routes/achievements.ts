import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { userId: req.userId! },
      orderBy: { unlockedAt: 'desc' },
    });

    res.json({
      success: true,
      data: achievements.map((a) => a.achievementId),
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/unlock',
  authenticate,
  [body('achievementId').isString().trim().notEmpty()],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { achievementId } = req.body;

      const achievement = await prisma.achievement.upsert({
        where: {
          userId_achievementId: {
            userId: req.userId!,
            achievementId,
          },
        },
        update: {},
        create: {
          userId: req.userId!,
          achievementId,
        },
      });

      res.status(201).json({ success: true, data: achievement });
    } catch (error) {
      next(error);
    }
  }
);

export { router as achievementRoutes };
