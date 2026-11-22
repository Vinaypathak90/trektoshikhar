import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

/**
 * Normalizes email for strict case-insensitive matching
 */
export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * STRICT 2-ADMIN WHITELIST RESOLVER
 * Passwords are NEVER hardcoded in source code — they are loaded
 * strictly from environment variables (.env).
 */
export function getAllowedAdmins() {
  const envEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  const envPasswords = (process.env.ADMIN_PASSWORDS || '')
    .split(',')
    .map(p => p.trim());

  // Base whitelisted founder emails
  const baseEmails = envEmails.length > 0 
    ? envEmails 
    : ['vinaypathak2772@gmail.com', 'trektoshikhar@gmail.com'];

  return baseEmails.map((email, idx) => {
    let password = '';

    // 1. Check array in ADMIN_PASSWORDS
    if (envPasswords[idx]) {
      password = envPasswords[idx];
    } 
    // 2. Check individual founder password env vars
    else if (email.includes('vinay')) {
      password = process.env.ADMIN_VINAY_PASSWORD || '';
    } else if (email.includes('trektoshikhar') || email.includes('kunal')) {
      password = process.env.ADMIN_KUNAL_PASSWORD || '';
    }

    return {
      email,
      name: email.includes('vinay') ? 'Vinay Pathak' : 'Kunal Satyal (TrekToShikhar Ops)',
      role: 'super_admin',
      password // Loaded exclusively from process.env — zero code fallbacks
    };
  });
}

// Export array getter for backward compatibility
export const ALLOWED_ADMINS = getAllowedAdmins();

/**
 * Checks whether the given email belongs to the 2-admin whitelist
 */
export function isWhitelistedEmail(email) {
  const normalized = normalizeEmail(email);
  return getAllowedAdmins().some(admin => normalizeEmail(admin.email) === normalized);
}

/**
 * Finds the admin profile by email
 */
export function getAdminByEmail(email) {
  const normalized = normalizeEmail(email);
  return getAllowedAdmins().find(admin => normalizeEmail(admin.email) === normalized) || null;
}

/**
 * Validates direct password against stored credential from .env
 */
export function verifyAdminCredentials(email, password) {
  const admin = getAdminByEmail(email);
  if (!admin) return { valid: false, reason: 'unauthorized_email' };

  if (!admin.password) {
    console.warn(`[SECURITY] No password defined in .env for ${admin.email}`);
    return { valid: false, reason: 'no_password_configured' };
  }

  const inputPassword = String(password || '');
  const targetPassword = String(admin.password || '');

  if (inputPassword === targetPassword) {
    return { valid: true, admin };
  }

  return { valid: false, reason: 'invalid_password' };
}
