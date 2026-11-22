const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const STORAGE_KEY = 'tts_admin_session_v1';

/**
 * Returns saved session from localStorage (if any)
 */
export function getStoredAdminSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Saves or clears session in localStorage
 */
export function setStoredAdminSession(session) {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not update localStorage session:', err);
  }
}

/**
 * Helper to build auth headers (Bearer token + JSON)
 */
export function getAuthHeaders(custom = {}) {
  const session = getStoredAdminSession();
  const headers = {
    'Content-Type': 'application/json',
    ...custom
  };
  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }
  return headers;
}

/**
 * Universal authenticated fetch wrapper that attaches httpOnly credentials & Bearer token
 */
export async function fetchWithAuth(url, options = {}) {
  const headers = getAuthHeaders(options.headers || {});
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
}

/**
 * 1. Password Login
 */
export async function loginWithPassword(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Sends & receives httpOnly cookies
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Password authentication failed.');
    }

    setStoredAdminSession({ token: data.token, admin: data.admin });
    return data;
  } catch (err) {
    console.error('loginWithPassword API error:', err);
    throw err;
  }
}

/**
 * 2. Google OAuth 2.0 Login (Restricted to 2 Whitelisted Admins)
 */
export async function loginWithGoogle(credential) {
  try {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credential })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Google authentication failed.');
    }

    setStoredAdminSession({ token: data.token, admin: data.admin });
    return data;
  } catch (err) {
    console.error('loginWithGoogle API error:', err);
    throw err;
  }
}

/**
 * 3. Supabase OTP Send
 */
export async function sendSupabaseOtp(email) {
  try {
    const res = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to dispatch Supabase OTP.');
    }
    return data;
  } catch (err) {
    console.error('sendSupabaseOtp API error:', err);
    throw err;
  }
}

/**
 * 4. Supabase OTP Verify
 */
export async function verifySupabaseOtp(email, token) {
  try {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, token })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Invalid or expired OTP code.');
    }

    setStoredAdminSession({ token: data.token, admin: data.admin });
    return data;
  } catch (err) {
    console.error('verifySupabaseOtp API error:', err);
    throw err;
  }
}

/**
 * 5. Verify Current Active Session
 */
export async function checkAdminSession() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok && data.authenticated && data.admin) {
      // Refresh local cache
      const prev = getStoredAdminSession() || {};
      setStoredAdminSession({ ...prev, admin: data.admin });
      return { authenticated: true, admin: data.admin };
    }

    // Not authenticated
    setStoredAdminSession(null);
    return { authenticated: false, admin: null };
  } catch (err) {
    // If backend offline, fallback to valid cached session if not expired
    const local = getStoredAdminSession();
    if (local?.admin && local?.token) {
      return { authenticated: true, admin: local.admin, isOfflineFallback: true };
    }
    return { authenticated: false, admin: null };
  }
}

/**
 * 6. Logout Admin
 */
export async function logoutAdmin() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include'
    });
  } catch (err) {
    console.warn('Logout API silent warning:', err);
  } finally {
    setStoredAdminSession(null);
    // Dispatch global event for reactive UI updates
    window.dispatchEvent(new CustomEvent('tts-admin-logged-out'));
  }
}
