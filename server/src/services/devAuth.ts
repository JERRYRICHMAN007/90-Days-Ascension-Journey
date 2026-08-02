import fs from 'fs';
import path from 'path';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';
import { ensureJwtSecrets } from '../lib/supabaseConfig';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export interface DevAuthUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
  email_confirmed_at?: string;
}

const STORE_PATH = path.join(__dirname, '../../.dev-auth-users.json');

function toAuthUser(user: DevAuthUser): AuthUserResponse {
  return {
    id: user.id,
    email: user.email,
    user_metadata: { name: user.name },
    email_confirmed_at: user.createdAt,
  };
}

function loadUsers(): DevAuthUser[] {
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: DevAuthUser[]): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(users, null, 2), 'utf8');
}

function decodeDevAccessToken(token: string): AuthUserResponse {
  ensureJwtSecrets();
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { sub: string };
    const user = loadUsers().find((u) => u.id === payload.sub);
    if (!user) {
      throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
    }
    return toAuthUser(user);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
  }
}

export async function devSignUpUser(
  email: string,
  password: string,
  metadata?: { name?: string }
): Promise<{ accessToken: string; refreshToken: string; user: AuthUserResponse }> {
  ensureJwtSecrets();
  const normalizedEmail = email.toLowerCase().trim();
  const users = loadUsers();
  const existingIndex = users.findIndex((u) => u.email === normalizedEmail);

  // Local dev: re-signup with same email updates password (no Supabase lock-out)
  if (existingIndex >= 0) {
    const existing = users[existingIndex];
    existing.passwordHash = await argon2.hash(password);
    if (metadata?.name?.trim()) {
      existing.name = metadata.name.trim();
    }
    saveUsers(users);
    console.log(`🔐 Dev auth: updated password for ${normalizedEmail}`);
    return {
      accessToken: signAccessToken(existing.id),
      refreshToken: signRefreshToken(existing.id),
      user: toAuthUser(existing),
    };
  }

  const user: DevAuthUser = {
    id: `dev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    email: normalizedEmail,
    name: metadata?.name?.trim() || normalizedEmail.split('@')[0],
    passwordHash: await argon2.hash(password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  return {
    accessToken: signAccessToken(user.id),
    refreshToken: signRefreshToken(user.id),
    user: toAuthUser(user),
  };
}

export async function devSignInUser(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string; user: AuthUserResponse }> {
  ensureJwtSecrets();
  const normalizedEmail = email.toLowerCase().trim();
  const user = loadUsers().find((u) => u.email === normalizedEmail);

  if (!user) {
    throw new AppError(
      401,
      'No local account for this email. Sign up first, or use Sign Up again with this email to set your password.',
      'USER_NOT_FOUND'
    );
  }

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    throw new AppError(
      401,
      'Invalid credentials',
      'INVALID_CREDENTIALS'
    );
  }

  return {
    accessToken: signAccessToken(user.id),
    refreshToken: signRefreshToken(user.id),
    user: toAuthUser(user),
  };
}

export async function devRefreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  ensureJwtSecrets();
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = loadUsers().find((u) => u.id === payload.sub);
    if (!user) {
      throw new AppError(401, 'Invalid or expired refresh token', 'INVALID_TOKEN');
    }
    return {
      accessToken: signAccessToken(user.id),
      refreshToken: signRefreshToken(user.id),
    };
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token', 'INVALID_TOKEN');
  }
}

export async function devVerifyAccessToken(accessToken: string): Promise<AuthUserResponse> {
  return decodeDevAccessToken(accessToken);
}

export async function devSignOutUser(_refreshToken: string): Promise<void> {
  // Local dev tokens are stateless — nothing to revoke
}

export async function devSendPasswordResetEmail(_email: string): Promise<void> {
  console.log('📧 Dev auth: password reset emails are not sent in local mode.');
}

export async function devUpdateUserPassword(_accessToken: string, _newPassword: string): Promise<void> {
  throw new AppError(501, 'Password reset is not available in local dev auth mode.', 'NOT_IMPLEMENTED');
}

export async function devGetUserById(userId: string): Promise<AuthUserResponse> {
  const user = loadUsers().find((u) => u.id === userId);
  if (!user) {
    throw new AppError(404, 'User not found', 'NOT_FOUND');
  }
  return toAuthUser(user);
}
