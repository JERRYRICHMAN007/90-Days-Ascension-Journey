import { supabaseAdmin } from '../lib/supabase';
import { AppError } from '../middleware/errorHandler';

// Helper to get environment-appropriate error messages
const isDevelopment = process.env.NODE_ENV === 'development';

function getSupabaseErrorMessage(type: 'dns' | 'connection' | 'timeout', url?: string): string {
  if (isDevelopment) {
    // Development: Show detailed debug info
    switch (type) {
      case 'dns':
        return `Cannot resolve Supabase hostname. URL: ${url}. Check: 1) Project is active in dashboard, 2) URL is correct, 3) Wait 1-2 min after restoring project. See FIX_SUPABASE_CONNECTION.md`;
      case 'connection':
        return `Supabase service unavailable. URL: ${url}. If you just restored: wait 1-2 minutes, then restart backend server. Check dashboard for project status.`;
      case 'timeout':
        return `Supabase request timed out. URL: ${url}. Project may still be initializing. Wait 2-3 minutes and try again.`;
      default:
        return 'Supabase service error. Check server logs for details.';
    }
  } else {
    // Production: Generic messages without exposing internal details
    switch (type) {
      case 'dns':
        return 'Authentication service is temporarily unavailable. Please try again in a few moments.';
      case 'connection':
        return 'Authentication service is temporarily unavailable. Please try again in a few moments.';
      case 'timeout':
        return 'Authentication service is taking longer than expected. Please try again in a few moments.';
      default:
        return 'Authentication service error. Please try again later.';
    }
  }
}

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
    const supabaseUrl = process.env.SUPABASE_URL || 'NOT_SET';
    
    // Handle network/DNS errors
    if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo')) {
      console.error('🔴 Supabase DNS Error (CreateUser):', {
        url: supabaseUrl,
        error: error.message,
        cause: (error as any).cause?.message
      });
      throw new AppError(
        503,
        getSupabaseErrorMessage('dns', supabaseUrl),
        'SUPABASE_CONNECTION_ERROR'
      );
    }
    // Handle fetch/network errors
    if (error.message?.includes('fetch failed') || error.message?.includes('ECONNREFUSED')) {
      console.error('🔴 Supabase Connection Error (CreateUser):', {
        url: supabaseUrl,
        error: error.message,
        cause: (error as any).cause?.message || (error as any).cause?.code
      });
      throw new AppError(
        503,
        getSupabaseErrorMessage('connection', supabaseUrl),
        'SUPABASE_UNAVAILABLE'
      );
    }
    // Handle timeout errors
    if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
      console.error('🔴 Supabase Timeout (CreateUser):', {
        url: supabaseUrl,
        error: error.message
      });
      throw new AppError(
        503,
        getSupabaseErrorMessage('timeout', supabaseUrl),
        'SUPABASE_TIMEOUT'
      );
    }
    // Handle existing user errors
    if (error.message.includes('already registered') || error.message.includes('already exists')) {
      throw new AppError(400, 'Email already registered', 'EMAIL_EXISTS');
    }
    // Generic Supabase error with details
    console.error('🔴 Supabase Error (CreateUser):', {
      url: supabaseUrl,
      error: error.message,
      status: (error as any).status,
      code: (error as any).code
    });
    const errorMessage = isDevelopment 
      ? `Supabase error: ${error.message}`
      : 'An error occurred during authentication. Please try again.';
    throw new AppError(400, errorMessage, 'SUPABASE_ERROR');
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
    const supabaseUrl = process.env.SUPABASE_URL || 'NOT_SET';
    
    // Handle network/DNS errors
    if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo')) {
      console.error('🔴 Supabase DNS Error (Login):', {
        url: supabaseUrl,
        error: error.message,
        cause: (error as any).cause?.message
      });
      throw new AppError(
        503,
        getSupabaseErrorMessage('dns', supabaseUrl),
        'SUPABASE_CONNECTION_ERROR'
      );
    }
    // Handle fetch/network errors
    if (error.message?.includes('fetch failed') || error.message?.includes('ECONNREFUSED')) {
      console.error('🔴 Supabase Connection Error (Login):', {
        url: supabaseUrl,
        error: error.message,
        cause: (error as any).cause?.message || (error as any).cause?.code
      });
      throw new AppError(
        503,
        getSupabaseErrorMessage('connection', supabaseUrl),
        'SUPABASE_UNAVAILABLE'
      );
    }
    // Handle timeout errors
    if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
      console.error('🔴 Supabase Timeout (Login):', {
        url: supabaseUrl,
        error: error.message
      });
      throw new AppError(
        503,
        getSupabaseErrorMessage('timeout', supabaseUrl),
        'SUPABASE_TIMEOUT'
      );
    }
    // Handle authentication errors
    if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid')) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    // Generic Supabase error with details
    console.error('🔴 Supabase Error (Login):', {
      url: supabaseUrl,
      error: error.message,
      status: (error as any).status,
      code: (error as any).code
    });
    const errorMessage = isDevelopment 
      ? `Supabase error: ${error.message}`
      : 'An error occurred during authentication. Please try again.';
    throw new AppError(401, errorMessage, 'SUPABASE_ERROR');
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
    const supabaseUrl = process.env.SUPABASE_URL || 'NOT_SET';
    
    // Handle network/DNS errors
    if (createError.message?.includes('ENOTFOUND') || createError.message?.includes('getaddrinfo')) {
      console.error('🔴 Supabase DNS Error (Signup):', {
        url: supabaseUrl,
        error: createError.message,
        cause: (createError as any).cause?.message
      });
      throw new AppError(
        503,
        getSupabaseErrorMessage('dns', supabaseUrl),
        'SUPABASE_CONNECTION_ERROR'
      );
    }
    // Handle fetch/network errors
    if (createError.message?.includes('fetch failed') || createError.message?.includes('ECONNREFUSED')) {
      console.error('🔴 Supabase Connection Error (Signup):', {
        url: supabaseUrl,
        error: createError.message,
        cause: (createError as any).cause?.message || (createError as any).cause?.code
      });
      throw new AppError(
        503,
        getSupabaseErrorMessage('connection', supabaseUrl),
        'SUPABASE_UNAVAILABLE'
      );
    }
    // Handle timeout errors
    if (createError.message?.includes('timeout') || createError.message?.includes('ETIMEDOUT')) {
      console.error('🔴 Supabase Timeout (Signup):', {
        url: supabaseUrl,
        error: createError.message
      });
      throw new AppError(
        503,
        getSupabaseErrorMessage('timeout', supabaseUrl),
        'SUPABASE_TIMEOUT'
      );
    }
    // Handle existing user errors
    if (createError.message.includes('already registered') || createError.message.includes('already exists') || createError.message.includes('already been registered')) {
      throw new AppError(400, 'Email already registered', 'EMAIL_EXISTS');
    }
    // Generic Supabase error with details
    console.error('🔴 Supabase Error (Signup):', {
      url: supabaseUrl,
      error: createError.message,
      status: (createError as any).status,
      code: (createError as any).code
    });
    throw new AppError(400, `Supabase error: ${createError.message}`, 'SUPABASE_ERROR');
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
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error) {
      // Handle Supabase connection errors
      if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo') || 
          error.message?.includes('fetch failed') || error.message?.includes('ECONNREFUSED')) {
        const supabaseUrl = process.env.SUPABASE_URL || 'NOT_SET';
        console.error('🔴 Supabase Connection Error (VerifyToken):', {
          url: supabaseUrl,
          error: error.message
        });
        throw new AppError(
          503,
          getSupabaseErrorMessage('connection', supabaseUrl),
          'SUPABASE_UNAVAILABLE'
        );
      }
      
      // Handle invalid/expired tokens
      throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
    }

    if (!data.user) {
      throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
    }

    return data.user as SupabaseUser;
  } catch (error) {
    // If it's already an AppError, re-throw it
    if (error instanceof AppError) {
      throw error;
    }
    // Otherwise wrap it
    throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
  }
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

