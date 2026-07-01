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

async function getDomainRecord(userId: string, domainId: string) {
  const domain = await prisma.domain.findUnique({
    where: { userId_domainId: { userId, domainId } },
  });
  if (!domain) {
    throw new AppError(404, 'Domain not found', 'NOT_FOUND');
  }
  return domain;
}

router.post(
  '/complete',
  authenticate,
  [
    body('domain').isIn([...DOMAIN_IDS]),
    body('journeyId').optional().isIn([...DOMAIN_IDS]),
    body('dayNumber').isInt({ min: 0 }),
    body('completed').optional().isBoolean(),
    body('sessionKey').optional().isString(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const domainId = req.body.domain || req.body.journeyId;
      const { dayNumber, completed = true, sessionKey } = req.body;
      const userId = req.userId!;

      let domain = await prisma.domain.findUnique({
        where: { userId_domainId: { userId, domainId } },
      });

      if (!domain) {
        throw new AppError(404, 'Domain not found. Fetch progress first.', 'NOT_FOUND');
      }

      const task = await prisma.task.upsert({
        where: {
          userId_domainId_dayNumber: {
            userId,
            domainId: domain.id,
            dayNumber,
          },
        },
        update: {
          completed,
          completedAt: completed ? new Date() : null,
          notes: sessionKey || undefined,
        },
        create: {
          userId,
          domainId: domain.id,
          dayNumber,
          completed,
          completedAt: completed ? new Date() : null,
          notes: sessionKey || null,
        },
      });

      if (sessionKey) {
        await prisma.log.create({
          data: {
            userId,
            domainId: domain.id,
            dayNumber,
            type: 'session',
            data: { sessionKey, completed },
          },
        });
      }

      const completedCount = await prisma.task.count({
        where: { userId, domainId: domain.id, completed: true },
      });

      const progress = domain.totalDays > 0
        ? Math.min(100, (completedCount / domain.totalDays) * 100)
        : 0;

      domain = await prisma.domain.update({
        where: { id: domain.id },
        data: { completedDays: completedCount, progress },
      });

      res.json({
        success: true,
        data: { task, domain },
      });
    } catch (error) {
      next(error);
    }
  }
);

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

      const domain = await getDomainRecord(req.userId!, req.params.domain);

      const tasks = await prisma.task.findMany({
        where: { userId: req.userId!, domainId: domain.id },
        orderBy: { dayNumber: 'asc' },
      });

      const sessionLogs = await prisma.log.findMany({
        where: { userId: req.userId!, domainId: domain.id, type: 'session' },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: { tasks, sessionLogs },
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as taskRoutes };
