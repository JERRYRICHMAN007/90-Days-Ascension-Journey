#!/usr/bin/env node
/**
 * Reset a local dev-auth password (no Supabase required).
 * Usage: node scripts/reset-dev-password.mjs email@example.com NewPassword1
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import argon2 from 'argon2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, '../.dev-auth-users.json');

const [emailArg, passwordArg] = process.argv.slice(2);

if (!emailArg || !passwordArg) {
  console.error('Usage: node scripts/reset-dev-password.mjs <email> <new-password>');
  console.error('Password must be 8+ chars with uppercase, lowercase, and a number.');
  process.exit(1);
}

const email = emailArg.toLowerCase().trim();
if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(passwordArg)) {
  console.error('Password must be at least 8 characters and include upper, lower, and a digit.');
  process.exit(1);
}

let users = [];
try {
  if (fs.existsSync(STORE_PATH)) {
    users = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    if (!Array.isArray(users)) users = [];
  }
} catch {
  users = [];
}

const idx = users.findIndex((u) => u.email === email);
const hash = await argon2.hash(passwordArg);

if (idx >= 0) {
  users[idx].passwordHash = hash;
  console.log(`Updated password for ${email}`);
} else {
  users.push({
    id: `dev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    email,
    name: email.split('@')[0],
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  });
  console.log(`Created dev user ${email}`);
}

fs.writeFileSync(STORE_PATH, JSON.stringify(users, null, 2), 'utf8');
console.log('Done. Sign in at http://localhost:5174/signin');
