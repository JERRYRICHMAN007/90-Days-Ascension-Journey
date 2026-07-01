import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
});

const BUCKET = process.env.S3_BUCKET!;
const CDN_URL = process.env.CDN_URL || process.env.S3_ENDPOINT;

export interface PresignOptions {
  filename: string;
  contentType: string;
  purpose: 'avatar' | 'resource' | 'other';
  size: number;
  userId: string;
}

export async function generatePresignedUrl(options: PresignOptions): Promise<{
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
  publicUrl: string;
}> {
  const { filename, contentType, purpose, userId } = options;
  
  // Validate file size
  const maxBytes = parseInt(process.env.FILE_MAX_BYTES || '5242880'); // 5MB
  if (options.size > maxBytes) {
    throw new Error(`File size exceeds maximum of ${maxBytes} bytes`);
  }

  // Validate content type
  const allowedTypes = {
    avatar: ['image/jpeg', 'image/png', 'image/webp'],
    resource: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    other: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  };

  if (!allowedTypes[purpose].includes(contentType)) {
    throw new Error(`Content type ${contentType} not allowed for ${purpose}`);
  }

  // Generate file key
  const timestamp = Date.now();
  const extension = filename.split('.').pop();
  const fileKey = `${purpose}/${userId}/${timestamp}-${crypto.randomBytes(8).toString('hex')}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
    ContentType: contentType,
    ACL: 'public-read', // Or use bucket policy
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300, // 5 minutes
  });

  const publicUrl = `${CDN_URL}/${BUCKET}/${fileKey}`;

  return {
    uploadUrl,
    fileKey,
    expiresIn: 300,
    publicUrl,
  };
}

export async function getFileUrl(fileKey: string): Promise<string> {
  return `${CDN_URL}/${BUCKET}/${fileKey}`;
}

