import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

type UserPreferences = {
  xp?: { global?: number; domains?: Record<string, number> };
  streaks?: { current?: number; longest?: number; lastDate?: string | null };
  achievements?: string[];
};

async function getPreferences(userId: string): Promise<UserPreferences> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });
  return (user?.preferences as UserPreferences) || {};
}

async function savePreferences(userId: string, preferences: UserPreferences) {
  return prisma.user.update({
    where: { id: userId },
    data: { preferences: preferences as object },
    select: { preferences: true },
  });
}

router.get('/xp', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const preferences = await getPreferences(req.userId!);
    const xp = preferences.xp || { global: 0, domains: {} };
    res.json({ success: true, data: xp });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/xp',
  authenticate,
  [
    body('amount').optional().isInt({ min: 0 }),
    body('domain').optional().isString(),
    body('global').optional().isInt({ min: 0 }),
    body('domains').optional().isObject(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const preferences = await getPreferences(req.userId!);
      const current = preferences.xp || { global: 0, domains: {} };

      if (req.body.global !== undefined || req.body.domains) {
        current.global = req.body.global ?? current.global;
        current.domains = { ...current.domains, ...req.body.domains };
      } else if (req.body.amount !== undefined) {
        const amount = req.body.amount;
        current.global = (current.global || 0) + amount;
        if (req.body.domain) {
          current.domains = current.domains || {};
          current.domains[req.body.domain] = (current.domains[req.body.domain] || 0) + amount;
        }
      }

      preferences.xp = current;
      await savePreferences(req.userId!, preferences);

      res.json({ success: true, data: current });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/xp',
  authenticate,
  [body('global').optional().isInt({ min: 0 }), body('domains').optional().isObject()],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const preferences = await getPreferences(req.userId!);
      preferences.xp = {
        global: req.body.global ?? preferences.xp?.global ?? 0,
        domains: { ...preferences.xp?.domains, ...req.body.domains },
      };
      await savePreferences(req.userId!, preferences);

      res.json({ success: true, data: preferences.xp });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/streaks', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const preferences = await getPreferences(req.userId!);
    const streaks = preferences.streaks || { current: 0, longest: 0, lastDate: null };
    res.json({ success: true, data: streaks });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/streaks',
  authenticate,
  [
    body('current').optional().isInt({ min: 0 }),
    body('longest').optional().isInt({ min: 0 }),
    body('lastDate').optional().isString(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const preferences = await getPreferences(req.userId!);
      preferences.streaks = {
        current: req.body.current ?? preferences.streaks?.current ?? 0,
        longest: req.body.longest ?? preferences.streaks?.longest ?? 0,
        lastDate: req.body.lastDate ?? preferences.streaks?.lastDate ?? null,
      };
      await savePreferences(req.userId!, preferences);

      res.json({ success: true, data: preferences.streaks });
    } catch (error) {
      next(error);
    }
  }
);

export { router as gamificationRoutes };
