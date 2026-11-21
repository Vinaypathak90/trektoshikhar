import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

/**
 * STRICT 2-ADMIN WHITELIST CONFIGURATION
 * Only Vinay & Kunal have access to TrekToShikhar Admin CRM.
 * All other emails/credentials will be rejected immediately with 403 Forbidden.
 */
export const ALLOWED_ADMINS = [
  {
    email: 'vinaypathak2772@gmail.com',
    name: 'Vinay Pathak',
    role: 'super_admin',
    password: process.env.ADMIN_VINAY_PASSWORD || '879218377@vinaytrektoshikharkunalbhai'
  },
  {
    email: 'trektoshikhar@gmail.com',
    name: 'Kunal Satyal (TrekToShikhar Ops)',
    role: 'super_admin',
    password: process.env.ADMIN_KUNAL_PASSWORD || '01-12-2004@kunalSatyal01931'
  }
];

/**
 * Normalizes email for case-insensitive matching
 */
export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * Checks whether the given email belongs to the 2-admin whitelist
 */
export function isWhitelistedEmail(email) {
  const normalized = normalizeEmail(email);
  return ALLOWED_ADMINS.some(admin => normalizeEmail(admin.email) === normalized);
}

/**
 * Finds the admin profile by email
 */
export function getAdminByEmail(email) {
  const normalized = normalizeEmail(email);
  return ALLOWED_ADMINS.find(admin => normalizeEmail(admin.email) === normalized) || null;
}

/**
 * Validates direct password against stored credential
 * (as requested: direct password matching without hashing)
 */
export function verifyAdminCredentials(email, password) {
  const admin = getAdminByEmail(email);
  if (!admin) return { valid: false, reason: 'unauthorized_email' };

  const inputPassword = String(password || '');
  const targetPassword = String(admin.password || '');

  if (inputPassword === targetPassword) {
    return { valid: true, admin };
  }

  return { valid: false, reason: 'invalid_password' };
}
