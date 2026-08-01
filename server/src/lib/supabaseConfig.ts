export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
    process.env.SUPABASE_ANON_KEY?.trim()
  );
}

export function isDevAuthEnabled(): boolean {
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  return isDev && !isSupabaseConfigured();
}

export function ensureJwtSecrets(): void {
  if (!process.env.JWT_ACCESS_SECRET) {
    process.env.JWT_ACCESS_SECRET = 'dev-access-secret-change-in-production';
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    process.env.JWT_REFRESH_SECRET = 'dev-refresh-secret-change-in-production';
  }
}
