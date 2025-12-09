import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/supabaseAuth';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');
  }

  const token = authHeader.substring(7);

  try {
    const user = await verifyAccessToken(token);
    req.userId = user.id;
    req.userEmail = user.email;
    req.userName = user.user_metadata?.name;
    next();
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
  }
}

