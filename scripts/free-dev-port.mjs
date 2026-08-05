#!/usr/bin/env node
/**
 * Free dev ports before `npm run dev` so API + Vite can always bind.
 * Stale processes from crashed or duplicate `npm run dev` cause ECONNREFUSED
 * (API) or "port already in use" (Vite) on Windows.
 */
import { execSync } from 'node:child_process';

const HOST = process.env.HOST || '127.0.0.1';
const PORTS = [
  { port: process.env.API_PORT || '5001', healthPath: '/health' },
  { port: process.env.WEB_PORT || '5174', healthPath: null },
];

function getListeningPid(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const line = out
      .split(/\r?\n/)
      .find((l) => l.includes('LISTENING') && l.includes(`:${port}`));
    if (!line) return null;
    const parts = line.trim().split(/\s+/);
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

async function healthOk(port, healthPath) {
  if (!healthPath) return false;
  try {
    const res = await fetch(`http://${HOST}:${port}${healthPath}`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function freePort({ port, healthPath }) {
  const pid = getListeningPid(port);
  if (!pid) return;

  const healthy = healthPath ? await healthOk(port, healthPath) : false;
  const label = healthy
    ? `Stopping existing service on port ${port} (pid ${pid}) for a clean dev restart`
    : `Freeing stale process on port ${port} (pid ${pid})`;

  console.log(`ℹ️  ${label}…`);

  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    await new Promise((r) => setTimeout(r, 400));
  } catch {
    console.warn(`⚠️  Could not stop pid ${pid} on port ${port}. Try: taskkill /PID ${pid} /F`);
  }
}

for (const entry of PORTS) {
  await freePort(entry);
}
