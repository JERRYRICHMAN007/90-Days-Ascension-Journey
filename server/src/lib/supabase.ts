import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { isSupabaseConfigured } from './supabaseConfig';

dotenv.config();

let supabaseAdminInstance: SupabaseClient | null = null;

function requireSupabaseConfig(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_ANON_KEY in server/.env — or use local dev auth (server starts automatically without Supabase in development).'
    );
  }
  if (!process.env.SUPABASE_URL!.startsWith('https://')) {
    throw new Error('SUPABASE_URL must start with https://');
  }
}

export function getSupabaseAdmin(): SupabaseClient {
  requireSupabaseConfig();
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return supabaseAdminInstance;
}

/** @deprecated Use getSupabaseAdmin() — kept for gradual migration */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop];
  },
});

export const createSupabaseClient = (accessToken?: string): SupabaseClient => {
  requireSupabaseConfig();
  const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  if (accessToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: '',
    } as any);
  }

  return client;
};

if (isSupabaseConfigured()) {
  (async () => {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
      if (error) {
        console.error('❌ Supabase connection test failed:', error.message);
      } else {
        console.log('✅ Supabase Auth connected successfully');
        console.log(`   URL: ${process.env.SUPABASE_URL}`);
      }
    } catch (err: any) {
      console.error('❌ Supabase connection error:', err.message);
    }
  })();
}

export default supabaseAdmin;
