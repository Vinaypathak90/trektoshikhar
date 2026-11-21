import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { supabase } from '../config/supabase.js';
import { 
  ALLOWED_ADMINS, 
  isWhitelistedEmail, 
  getAdminByEmail, 
  verifyAdminCredentials,
  normalizeEmail
} from '../config/adminConfig.js';

const JWT_SECRET = process.env.JWT_SECRET || 'trektoshikhar_vault_secret_key_879218377';
const JWT_EXPIRES_IN = '7d';
const COOKIE_NAME = 'tts_admin_token';

// Google OAuth client instance
const googleClient = process.env.GOOGLE_CLIENT_ID 
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

/**
 * Helper to log security audit events in Supabase (fail-safe)
 */
async function logSecurityAudit(email, method, status, req, details = {}) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await supabase.from('admin_audit_logs').insert([{
      admin_email: email || 'unknown',
      auth_method: method,
      status: status,
      ip_address: String(ip).slice(0, 100),
      user_agent: String(userAgent).slice(0, 255),
      details: details,
      created_at: new Date().toISOString()
    }]);
  } catch (err) {
    // Fail-safe: database table might not exist yet, print to console
    console.log(`[SECURITY AUDIT] ${new Date().toISOString()} | Method: ${method} | Email: ${email} | Status: ${status}`);
  }
}

/**
 * Cookie options for high security
 */
function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd, // true in HTTPS production
    sameSite: isProd ? 'none' : 'lax', // 'none' for cross-domain in prod if frontend/backend separated
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    path: '/'
  };
}

/**
 * Generate standard signed Admin JWT token
 */
function generateAdminToken(admin) {
  return jwt.sign(
    {
      email: normalizeEmail(admin.email),
      name: admin.name || 'TrekToShikhar Super Admin',
      role: 'super_admin'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// ==============================================================================
// 1. PASSWORD AUTHENTICATION (DIRECT CREDENTIALS AS REQUESTED)
// ==============================================================================
export async function loginWithPassword(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Both Admin Email and Password are required.' 
      });
    }

    const cleanEmail = normalizeEmail(email);

    // 1. Check against the 2-admin whitelist
    if (!isWhitelistedEmail(cleanEmail)) {
      await logSecurityAudit(cleanEmail, 'password', 'failed_whitelist', req);
      return res.status(403).json({
        success: false,
        error: 'Access Denied: This email address is not authorized on TrekToShikhar Admin CRM.'
      });
    }

    // 2. Verify Credentials
    const verification = verifyAdminCredentials(cleanEmail, password);
    if (!verification.valid) {
      await logSecurityAudit(cleanEmail, 'password', 'failed_password', req);
      return res.status(401).json({
        success: false,
        error: 'Invalid Admin Password for this account.'
      });
    }

    const admin = verification.admin;
    const token = generateAdminToken(admin);

    // 3. Set httpOnly Cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    // 4. Log Success Audit
    await logSecurityAudit(cleanEmail, 'password', 'success', req);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${admin.name}!`,
      token,
      admin: {
        email: cleanEmail,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Password login error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred during authentication.'
    });
  }
}

// ==============================================================================
// 2. GOOGLE OAUTH 2.0 AUTHENTICATION (RESTRICTED TO 2 WHITELISTED ADMINS)
// ==============================================================================
export async function loginWithGoogle(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        error: 'Google ID token credential is required.'
      });
    }

    if (!googleClient) {
      return res.status(500).json({
        success: false,
        error: 'Google OAuth Client is not configured on the server (missing GOOGLE_CLIENT_ID).'
      });
    }

    // 1. Verify Google ID Token with Google's public keys
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract verified email from Google identity token.'
      });
    }

    const googleEmail = normalizeEmail(payload.email);

    // 2. STRICT WHITELIST CHECK: Only Vinay & Kunal allowed!
    if (!isWhitelistedEmail(googleEmail)) {
      await logSecurityAudit(googleEmail, 'google_oauth', 'failed_whitelist', req, {
        google_name: payload.name
      });
      return res.status(403).json({
        success: false,
        error: `Access Denied: Google account (${googleEmail}) is not an authorized TrekToShikhar founder.`
      });
    }

    const admin = getAdminByEmail(googleEmail) || {
      email: googleEmail,
      name: payload.name || 'TrekToShikhar Admin',
      role: 'super_admin'
    };

    const token = generateAdminToken(admin);

    // 3. Set httpOnly Cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    // 4. Log Success Audit
    await logSecurityAudit(googleEmail, 'google_oauth', 'success', req, {
      google_sub: payload.sub,
      google_picture: payload.picture
    });

    return res.status(200).json({
      success: true,
      message: `Google authentication verified for ${admin.name}!`,
      token,
      admin: {
        email: googleEmail,
        name: admin.name,
        role: 'super_admin',
        avatar: payload.picture
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(401).json({
      success: false,
      error: 'Google ID token verification failed. Please try again or use password.'
    });
  }
}

// ==============================================================================
// 3. SUPABASE EMAIL OTP AUTHENTICATION
// ==============================================================================
export async function sendSupabaseOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Admin email is required to request OTP.'
      });
    }

    const cleanEmail = normalizeEmail(email);

    // 1. Whitelist check before triggering Supabase OTP
    if (!isWhitelistedEmail(cleanEmail)) {
      await logSecurityAudit(cleanEmail, 'supabase_otp_send', 'failed_whitelist', req);
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: OTP can only be dispatched to registered founder emails.'
      });
    }

    // 2. Dispatch OTP via Supabase Auth
    const { data, error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true
      }
    });

    if (error) {
      console.error('Supabase OTP Dispatch Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to dispatch OTP via Supabase auth.'
      });
    }

    await logSecurityAudit(cleanEmail, 'supabase_otp_send', 'dispatched', req);

    return res.status(200).json({
      success: true,
      message: `A secure 6-digit verification code has been dispatched to ${cleanEmail} via Supabase.`
    });
  } catch (error) {
    console.error('Send Supabase OTP error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initiate OTP request.'
    });
  }
}

export async function verifySupabaseOtp(req, res) {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({
        success: false,
        error: 'Both Email and 6-digit OTP code are required.'
      });
    }

    const cleanEmail = normalizeEmail(email);

    // 1. Whitelist check
    if (!isWhitelistedEmail(cleanEmail)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized admin email.'
      });
    }

    // 2. Verify with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: String(token).trim(),
      type: 'email'
    });

    if (error || !data?.user) {
      await logSecurityAudit(cleanEmail, 'supabase_otp_verify', 'failed_otp', req, {
        error: error?.message
      });
      return res.status(401).json({
        success: false,
        error: error?.message || 'Invalid or expired OTP code. Please request a fresh one.'
      });
    }

    const admin = getAdminByEmail(cleanEmail) || {
      email: cleanEmail,
      name: 'TrekToShikhar Super Admin',
      role: 'super_admin'
    };

    const jwtToken = generateAdminToken(admin);

    // 3. Set httpOnly Cookie
    res.cookie(COOKIE_NAME, jwtToken, getCookieOptions());

    await logSecurityAudit(cleanEmail, 'supabase_otp_verify', 'success', req);

    return res.status(200).json({
      success: true,
      message: `OTP successfully verified. Welcome back, ${admin.name}!`,
      token: jwtToken,
      admin: {
        email: cleanEmail,
        name: admin.name,
        role: 'super_admin'
      }
    });
  } catch (error) {
    console.error('Verify Supabase OTP error:', error);
    return res.status(500).json({
      success: false,
      error: 'OTP verification failed.'
    });
  }
}

// ==============================================================================
// 4. GET CURRENT ADMIN SESSION (/api/auth/me)
// ==============================================================================
export async function getCurrentAdmin(req, res) {
  try {
    // 1. Check Cookie first, then fallback to Authorization header
    const tokenFromCookie = req.cookies?.[COOKIE_NAME];
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(200).json({
        authenticated: false,
        admin: null
      });
    }

    // 2. Verify JWT signature
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      // Invalid or expired token
      res.clearCookie(COOKIE_NAME, getCookieOptions());
      return res.status(200).json({
        authenticated: false,
        admin: null,
        reason: 'token_expired_or_invalid'
      });
    }

    // 3. Ensure still in 2-admin whitelist
    if (!isWhitelistedEmail(decoded.email)) {
      res.clearCookie(COOKIE_NAME, getCookieOptions());
      return res.status(403).json({
        authenticated: false,
        admin: null,
        error: 'Email is no longer in the allowed admin whitelist.'
      });
    }

    const adminProfile = getAdminByEmail(decoded.email);

    return res.status(200).json({
      authenticated: true,
      admin: {
        email: decoded.email,
        name: adminProfile?.name || decoded.name,
        role: decoded.role || 'super_admin'
      }
    });
  } catch (error) {
    console.error('Get current admin error:', error);
    return res.status(500).json({
      authenticated: false,
      error: 'Failed to verify session.'
    });
  }
}

// ==============================================================================
// 5. LOGOUT ADMIN (/api/auth/logout)
// ==============================================================================
export async function logoutAdmin(req, res) {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/'
    });

    return res.status(200).json({
      success: true,
      message: 'Admin session terminated successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to complete logout.'
    });
  }
}
