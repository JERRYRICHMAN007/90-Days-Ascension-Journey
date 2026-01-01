import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Validate required environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required in .env file');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required in .env file');
}
if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY is required in .env file');
}

// Validate Supabase URL format
if (!process.env.SUPABASE_URL.startsWith('https://')) {
  throw new Error('SUPABASE_URL must start with https://');
}

// Initialize Supabase client for server-side operations
// Uses service role key for admin operations (bypasses RLS)
export const supabaseAdmin: SupabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Test Supabase connection on startup
(async () => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
    } else {
      console.log('✅ Supabase Auth connected successfully');
      console.log(`   URL: ${process.env.SUPABASE_URL}`);
    }
  } catch (err: any) {
    console.error('❌ Supabase connection error:', err.message);
    if (err.message?.includes('ENOTFOUND')) {
      console.error('   → Cannot resolve Supabase hostname. Check your SUPABASE_URL in .env');
    } else if (err.message?.includes('ECONNREFUSED')) {
      console.error('   → Cannot connect to Supabase. Check if project is active in dashboard.');
    }
  }
})();

// Initialize Supabase client for user operations (respects RLS)
// This can be used when you need to make requests on behalf of a user
export const createSupabaseClient = (accessToken?: string): SupabaseClient => {
  const client = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  if (accessToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: '',
    } as any);
  }

  return client;
};

export default supabaseAdmin;

