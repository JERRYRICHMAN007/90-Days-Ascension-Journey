import { supabaseAdmin } from '../lib/supabase';
import { AppError } from '../middleware/errorHandler';

export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
  email_confirmed_at?: string;
}

/**
 * Create a new user in Supabase Auth
 */
export async function createSupabaseUser(
  email: string,
  password: string,
  metadata?: { name?: string }
): Promise<SupabaseUser> {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email for now
    user_metadata: metadata || {},
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new AppError(400, 'Email already registered', 'EMAIL_EXISTS');
    }
    throw new AppError(400, error.message, 'SUPABASE_ERROR');
  }

  if (!data.user) {
    throw new AppError(500, 'Failed to create user', 'SUPABASE_ERROR');
  }

  return data.user as SupabaseUser;
}

/**
 * Sign in a user and get session tokens
 * Note: We need to use anon key client for user sign-in, not service role
 */
export async function signInUser(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string; user: SupabaseUser }> {
  // Create a client with anon key for user authentication
  const { createSupabaseClient } = await import('../lib/supabase');
  const supabaseClient = createSupabaseClient();

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid')) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    throw new AppError(401, error.message, 'SUPABASE_ERROR');
  }

  if (!data.session || !data.user) {
    throw new AppError(500, 'Failed to create session', 'SUPABASE_ERROR');
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: data.user as SupabaseUser,
  };
}

/**
 * Sign up a new user
 * Uses admin API to auto-confirm email and create session
 */
export async function signUpUser(
  email: string,
  password: string,
  metadata?: { name?: string }
): Promise<{ accessToken: string; refreshToken: string; user: SupabaseUser }> {
  // Use admin API to create user with auto-confirmation
  const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
    user_metadata: metadata || {},
  });

  if (createError) {
    if (createError.message.includes('already registered') || createError.message.includes('already exists') || createError.message.includes('already been registered')) {
      throw new AppError(400, 'Email already registered', 'EMAIL_EXISTS');
    }
    throw new AppError(400, createError.message, 'SUPABASE_ERROR');
  }

  if (!createData.user) {
    throw new AppError(500, 'Failed to create user', 'SUPABASE_ERROR');
  }

  // After creating user, sign them in to get tokens
  // Use anon key client for sign-in
  const { createSupabaseClient } = await import('../lib/supabase');
  const supabaseClient = createSupabaseClient();

  const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !signInData.session || !signInData.user) {
    // If sign-in fails, user was created but we can't get tokens
    // Return the user data anyway
    return {
      accessToken: '', // Will need to login separately
      refreshToken: '',
      user: createData.user as SupabaseUser,
    };
  }

  return {
    accessToken: signInData.session.access_token,
    refreshToken: signInData.session.refresh_token,
    user: signInData.user as SupabaseUser,
  };
}

/**
 * Refresh an access token using refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const { data, error } = await supabaseAdmin.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    throw new AppError(401, 'Invalid or expired refresh token', 'INVALID_TOKEN');
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
}

/**
 * Verify an access token and get user
 */
export async function verifyAccessToken(
  accessToken: string
): Promise<SupabaseUser> {
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
  }

  return data.user as SupabaseUser;
}

/**
 * Sign out a user (revoke refresh token)
 */
export async function signOutUser(refreshToken: string): Promise<void> {
  const { error } = await supabaseAdmin.auth.signOut({ refreshToken });

  if (error) {
    // Don't throw error if token is already invalid
    console.warn('Sign out error:', error.message);
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.APP_URL}/reset-password`,
  });

  if (error) {
    // Don't reveal if email exists (security best practice)
    console.warn('Password reset error:', error.message);
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  accessToken: string,
  newPassword: string
): Promise<void> {
  const { error } = await supabaseAdmin.auth.updateUser(
    { password: newPassword },
    { accessToken }
  );

  if (error) {
    throw new AppError(400, error.message, 'SUPABASE_ERROR');
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<SupabaseUser> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error || !data.user) {
    throw new AppError(404, 'User not found', 'NOT_FOUND');
  }

  return data.user as SupabaseUser;
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(
  userId: string,
  metadata: Record<string, any>
): Promise<SupabaseUser> {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      user_metadata: metadata,
    }
  );

  if (error || !data.user) {
    throw new AppError(400, error?.message || 'Failed to update user', 'SUPABASE_ERROR');
  }

  return data.user as SupabaseUser;
}

