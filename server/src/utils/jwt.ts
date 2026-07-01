import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface TokenPayload {
  sub: string; // userId
  iat?: number;
  exp?: number;
}

export function signAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    }
  );
}

export function signRefreshToken(userId: string): string {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    }
  );
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
  } catch {
    throw new Error('Invalid refresh token');
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

