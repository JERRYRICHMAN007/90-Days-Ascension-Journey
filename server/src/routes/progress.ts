import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const DOMAIN_IDS = [
  'body-transformation',
  'dual-brand',
  'reading',
  'writers',
  'software-engineering',
] as const;

const DOMAIN_NAMES: Record<string, string> = {
  'body-transformation': 'Body Transformation',
  'dual-brand': 'Dual Brand',
  reading: 'Reading Journey',
  writers: "Writer's Journey",
  'software-engineering': 'Software Engineering',
};

const DOMAIN_TOTAL_DAYS: Record<string, number> = {
  'body-transformation': 90,
  'dual-brand': 90,
  reading: 90,
  writers: 84,
  'software-engineering': 180,
};

async function ensureDomain(userId: string, domainId: string) {
  if (!DOMAIN_IDS.includes(domainId as (typeof DOMAIN_IDS)[number])) {
    throw new AppError(400, 'Invalid domain', 'INVALID_DOMAIN');
  }

  return prisma.domain.upsert({
    where: {
      userId_domainId: { userId, domainId },
    },
    update: {},
    create: {
      userId,
      domainId,
      name: DOMAIN_NAMES[domainId] || domainId,
      totalDays: DOMAIN_TOTAL_DAYS[domainId] || 90,
      completedDays: 0,
      progress: 0,
    },
  });
}

router.get(
  '/:domain',
  authenticate,
  [param('domain').isIn([...DOMAIN_IDS])],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const domainId = req.params.domain;
      const domain = await ensureDomain(req.userId!, domainId);

      const completedTasks = await prisma.task.findMany({
        where: { userId: req.userId!, domainId: domain.id, completed: true },
        select: { dayNumber: true },
        orderBy: { dayNumber: 'asc' },
      });

      const completedDayNumbers = completedTasks.map((t) => t.dayNumber);

      res.json({
        success: true,
        data: {
          domainId,
          totalDays: domain.totalDays,
          completedDays: completedDayNumbers,
          completedDaysCount: domain.completedDays,
          progress: domain.progress,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:domain',
  authenticate,
  [
    param('domain').isIn([...DOMAIN_IDS]),
    body('completedDays').optional().isInt({ min: 0 }),
    body('progress').optional().isFloat({ min: 0, max: 100 }),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const domainId = req.params.domain;
      const domain = await ensureDomain(req.userId!, domainId);

      const { completedDays, progress } = req.body;
      const updateData: { completedDays?: number; progress?: number } = {};

      if (completedDays !== undefined) updateData.completedDays = completedDays;
      if (progress !== undefined) updateData.progress = progress;

      const updated = await prisma.domain.update({
        where: { id: domain.id },
        data: updateData,
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
);

export { router as progressRoutes };
