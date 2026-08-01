import { isDevAuthEnabled } from '../lib/supabaseConfig';
import * as devAuth from './devAuth';
import * as supabaseAuth from './supabaseAuth';

export type AuthUser = devAuth.AuthUserResponse;

async function useDev() {
  return isDevAuthEnabled();
}

export async function signUpUser(
  email: string,
  password: string,
  metadata?: { name?: string }
) {
  if (await useDev()) return devAuth.devSignUpUser(email, password, metadata);
  return supabaseAuth.signUpUser(email, password, metadata);
}

export async function signInUser(email: string, password: string) {
  if (await useDev()) return devAuth.devSignInUser(email, password);
  return supabaseAuth.signInUser(email, password);
}

export async function refreshAccessToken(refreshToken: string) {
  if (await useDev()) return devAuth.devRefreshAccessToken(refreshToken);
  return supabaseAuth.refreshAccessToken(refreshToken);
}

export async function verifyAccessToken(accessToken: string) {
  if (await useDev()) return devAuth.devVerifyAccessToken(accessToken);
  return supabaseAuth.verifyAccessToken(accessToken);
}

export async function signOutUser(refreshToken: string) {
  if (await useDev()) return devAuth.devSignOutUser(refreshToken);
  return supabaseAuth.signOutUser(refreshToken);
}

export async function sendPasswordResetEmail(email: string) {
  if (await useDev()) return devAuth.devSendPasswordResetEmail(email);
  return supabaseAuth.sendPasswordResetEmail(email);
}

export async function updateUserPassword(accessToken: string, newPassword: string) {
  if (await useDev()) return devAuth.devUpdateUserPassword(accessToken, newPassword);
  return supabaseAuth.updateUserPassword(accessToken, newPassword);
}

export async function getUserById(userId: string) {
  if (await useDev()) return devAuth.devGetUserById(userId);
  return supabaseAuth.getUserById(userId);
}
