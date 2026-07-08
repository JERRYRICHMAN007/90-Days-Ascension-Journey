import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
if (error) {
  console.error('❌ Supabase Auth API:', error.message);
  process.exit(1);
}
console.log('✅ Supabase Auth API works');
console.log(`   Users in project: ${data?.users?.length ?? 0} (first page)`);
