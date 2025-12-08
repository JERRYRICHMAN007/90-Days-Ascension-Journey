import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generatePresignedUrl } from '../services/s3';
import { processAvatarImage } from '../services/imageProcessor';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Generate presigned URL for upload
router.post(
  '/presign',
  authenticate,
  [
    body('filename').notEmpty(),
    body('contentType').notEmpty(),
    body('purpose').isIn(['avatar', 'resource', 'other']),
    body('size').isInt({ min: 1 }),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { filename, contentType, purpose, size } = req.body;

      const presigned = await generatePresignedUrl({
        filename,
        contentType,
        purpose,
        size,
        userId: req.userId!,
      });

      res.json({
        success: true,
        data: presigned,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Confirm file upload and process
router.post(
  '/confirm',
  authenticate,
  [
    body('fileKey').notEmpty(),
    body('purpose').isIn(['avatar', 'resource', 'other']),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR');
      }

      const { fileKey, purpose, meta } = req.body;

      // Process avatar images
      let processedImages: any[] = [];
      let finalUrl = `${process.env.CDN_URL}/${process.env.S3_BUCKET}/${fileKey}`;
      let width, height, size;

      if (purpose === 'avatar') {
        processedImages = await processAvatarImage(fileKey, req.userId!);
        // Use 512px version as primary
        const primary = processedImages.find(img => img.key.includes('512'));
        if (primary) {
          finalUrl = primary.url;
          width = primary.width;
          height = primary.height;
          size = primary.size;
        }
      } else {
        // For non-avatar files, get metadata from S3
        // Simplified - in production, fetch from S3
        size = meta?.size || 0;
      }

      // Create file record
      const file = await prisma.file.create({
        data: {
          userId: req.userId!,
          key: fileKey,
          url: finalUrl,
          type: purpose,
          size: size || 0,
          width,
          height,
          meta: meta || {},
        },
      });

      // If avatar, update user
      if (purpose === 'avatar') {
        await prisma.user.update({
          where: { id: req.userId! },
          data: {
            avatarUrl: finalUrl,
            avatarKey: fileKey,
          },
        });
      }

      res.json({
        success: true,
        data: {
          file: {
            id: file.id,
            url: file.url,
            type: file.type,
            width: file.width,
            height: file.height,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as fileRoutes };

