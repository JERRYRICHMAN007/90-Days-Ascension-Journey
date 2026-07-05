/**
 * Quick check: required env vars + Supabase hostname resolves.
 * Run: node scripts/check-env.mjs
 */
import dotenv from 'dotenv';
import dns from 'node:dns/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const required = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

let ok = true;

for (const key of required) {
  if (!process.env[key]?.trim()) {
    console.error(`❌ Missing: ${key}`);
    ok = false;
  }
}

const url = process.env.SUPABASE_URL || '';
const match = url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co\/?$/i);
if (!match) {
  console.error('❌ SUPABASE_URL must be https://YOUR-PROJECT-REF.supabase.co');
  ok = false;
} else {
  const host = `${match[1]}.supabase.co`;
  try {
    await dns.lookup(host);
    console.log(`✅ DNS resolves: ${host}`);
  } catch {
    console.error(`❌ DNS failed for ${host}`);
    console.error('   → Project deleted, wrong ref, or still restoring after pause.');
    console.error('   → Open https://supabase.com/dashboard and use Settings → API for the correct URL.');
    ok = false;
  }
}

if (ok) {
  console.log('✅ Environment looks configured. Restart: npm run dev');
} else {
  console.error('\nCopy server/.env.example → server/.env and update with your Supabase project.');
  process.exit(1);
}
