import jwt from 'jsonwebtoken';
import { isWhitelistedEmail, normalizeEmail } from '../config/adminConfig.js';

const JWT_SECRET = process.env.JWT_SECRET || 'trektoshikhar_vault_secret_key_879218377';
const COOKIE_NAME = 'tts_admin_token';

/**
 * Middleware that strictly enforces admin authentication on API routes.
 * Checks httpOnly cookie first, then Bearer Authorization header.
 */
export function requireAdminAuth(req, res, next) {
  try {
    const tokenFromCookie = req.cookies?.[COOKIE_NAME];
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required: You must be signed in as a TrekToShikhar admin to perform this action.'
      });
    }

    // Verify JWT Token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session token. Please sign in again.'
      });
    }

    // Verify against 2-admin whitelist
    if (!isWhitelistedEmail(decoded.email)) {
      return res.status(403).json({
        success: false,
        error: 'Access Forbidden: This account does not have administrative privileges.'
      });
    }

    // Attach verified admin to request object
    req.admin = {
      email: normalizeEmail(decoded.email),
      name: decoded.name,
      role: decoded.role || 'super_admin'
    };

    next();
  } catch (error) {
    console.error('requireAdminAuth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Security verification failed.'
    });
  }
}
