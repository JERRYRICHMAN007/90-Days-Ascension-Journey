/**
 * Production startup for Render / Docker.
 * 1. Validates Supabase env (required for auth)
 * 2. Runs prisma migrate deploy when DATABASE_URL is set
 * 3. Starts the API even if migration fails (auth can still work via Supabase)
 */
import { spawn } from 'node:child_process';
import dns from 'node:dns/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, '..');

function extractProjectRef(supabaseUrl) {
  const match = supabaseUrl?.trim().match(/^https:\/\/([a-z0-9]+)\.supabase\.co\/?$/i);
  return match?.[1] ?? null;
}

function run(command, args, cwd = serverRoot) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    });
    child.on('close', (code) => resolve(code === 0));
  });
}

async function validateProductionEnv() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  let ok = true;
  for (const key of required) {
    if (!process.env[key]?.trim()) {
      console.error(`❌ Missing required env: ${key}`);
      ok = false;
    }
  }
  if (!ok) process.exit(1);

  const projectRef = extractProjectRef(process.env.SUPABASE_URL);
  if (!projectRef) {
    console.error('❌ SUPABASE_URL must be https://YOUR-PROJECT-REF.supabase.co');
    process.exit(1);
  }

  try {
    await dns.lookup(`${projectRef}.supabase.co`);
    console.log(`✅ Supabase project resolves: ${projectRef}.supabase.co`);
  } catch {
    console.error(`❌ Supabase project not found: ${projectRef}.supabase.co`);
    console.error('   → Project deleted, paused, or wrong ref in Render env vars.');
    console.error('   → Open https://supabase.com/dashboard → restore/create project.');
    console.error('   → Update SUPABASE_URL, SUPABASE_* keys, and DATABASE_URL together.');
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL?.trim();
  if (dbUrl) {
    const poolerTenant = `postgres.${projectRef}`;
    if (dbUrl.includes('pooler.supabase.com') && !dbUrl.includes(poolerTenant)) {
      console.warn(`⚠️  DATABASE_URL may be stale — expected pooler user "${poolerTenant}"`);
      console.warn('   → Supabase → Settings → Database → Connection string → URI (pooler).');
    }
  } else {
    console.warn('⚠️  DATABASE_URL not set — skipping migrations (DB features unavailable).');
  }

  return projectRef;
}

async function main() {
  console.log('🚀 Aether production startup…');
  await validateProductionEnv();

  if (process.env.DATABASE_URL?.trim()) {
    console.log('🔄 Running prisma migrate deploy…');
    const migrated = await run('npx', ['prisma', 'migrate', 'deploy']);
    if (!migrated) {
      console.error('⚠️  Migration failed — starting API anyway so Supabase auth can work.');
      console.error('   Fix DATABASE_URL in Render (must match your active Supabase project).');
    } else {
      console.log('✅ Migrations applied.');
    }
  }

  console.log('▶️  Starting API server…');
  const started = await run('npx', ['tsx', 'src/index.ts']);
  process.exit(started ? 0 : 1);
}

main().catch((err) => {
  console.error('❌ Startup failed:', err.message);
  process.exit(1);
});
