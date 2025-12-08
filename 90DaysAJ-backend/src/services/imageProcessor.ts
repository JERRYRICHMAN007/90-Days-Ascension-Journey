import sharp from 'sharp';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET!;

export interface ProcessedImage {
  key: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

export async function processAvatarImage(
  fileKey: string,
  userId: string
): Promise<ProcessedImage[]> {
  // Download original from S3
  const getCommand = new GetObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
  });

  const response = await s3Client.send(getCommand);
  const stream = response.Body as Readable;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const originalBuffer = Buffer.concat(chunks);

  // Process images
  const sizes = [
    { size: 256, suffix: '256' },
    { size: 512, suffix: '512' },
  ];

  const processed: ProcessedImage[] = [];

  for (const { size, suffix } of sizes) {
    const processedBuffer = await sharp(originalBuffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85 })
      .toBuffer();

    const processedKey = fileKey.replace(/\.(jpg|jpeg|png)$/i, `-${suffix}.webp`);

    // Upload processed image
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET,
      Key: processedKey,
      Body: processedBuffer,
      ContentType: 'image/webp',
      ACL: 'public-read',
    });

    await s3Client.send(putCommand);

    const metadata = await sharp(processedBuffer).metadata();

    processed.push({
      key: processedKey,
      url: `${process.env.CDN_URL}/${BUCKET}/${processedKey}`,
      width: metadata.width!,
      height: metadata.height!,
      size: processedBuffer.length,
    });
  }

  return processed;
}

