import { fetchWithAuth } from './authApi';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Stale-While-Revalidate LocalStorage Keys
const CACHE_KEY_TREKS = 'tts_cached_treks_v2';
const CACHE_KEY_META = 'tts_cached_treks_meta_v2';
const CACHE_PREFIX_SINGLE = 'tts_cached_trek_v2_';

/**
 * Get instant cached treks for Stale-While-Revalidate (0ms first paint)
 */
export function getCachedTreks() {
  try {
    const raw = localStorage.getItem(CACHE_KEY_TREKS);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch (e) {
    return null;
  }
}

/**
 * Get cached metadata (dynamic regions & difficulties)
 */
export function getCachedTrekMeta() {
  try {
    const raw = localStorage.getItem(CACHE_KEY_META);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Cache treks and metadata locally
 */
export function setCachedTreks(treks, meta = {}) {
  try {
    if (Array.isArray(treks) && treks.length > 0) {
      localStorage.setItem(CACHE_KEY_TREKS, JSON.stringify(treks));
    }
    if (meta && (meta.availableRegions || meta.availableDifficulties)) {
      localStorage.setItem(CACHE_KEY_META, JSON.stringify(meta));
    }
  } catch (e) {
    // Gracefully ignore local storage quota exceptions
  }
}

/**
 * Get cached single trek by slug
 */
export function getCachedTrekBySlug(slug) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX_SINGLE + slug);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Cache single trek by slug
 */
export function setCachedTrekBySlug(slug, trek) {
  try {
    if (slug && trek) {
      localStorage.setItem(CACHE_PREFIX_SINGLE + slug, JSON.stringify(trek));
    }
  } catch (e) {}
}

/**
 * Fetch all treks from backend API (with auto-sync to local cache)
 * @param {object} options - { admin: boolean, region: string, difficulty: string, search: string, sort: string }
 */
export async function getTreks(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.admin) params.append('admin', 'true');
    if (options.region && options.region !== 'all') params.append('region', options.region);
    if (options.difficulty && options.difficulty !== 'all') params.append('difficulty', options.difficulty);
    if (options.search) params.append('search', options.search);
    if (options.sort) params.append('sort', options.sort);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_URL}/treks${qs}`);

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const json = await res.json();
    const treks = json.data || [];

    // Automatically sync default public list to local cache for 0ms loads
    const isDefaultPublic = !options.admin && (!options.region || options.region === 'all') && (!options.difficulty || options.difficulty === 'all') && !options.search && (!options.sort || options.sort === 'recommended');

    if (isDefaultPublic && treks.length > 0) {
      setCachedTreks(treks, {
        availableRegions: json.availableRegions || [],
        availableDifficulties: json.availableDifficulties || []
      });
    }

    return {
      treks,
      availableRegions: json.availableRegions || [],
      availableDifficulties: json.availableDifficulties || [],
      total: json.total || treks.length,
      tableNotReady: !!json.tableNotReady
    };
  } catch (err) {
    console.warn('⚠️ Fetching treks via API failed, using fallback cache:', err.message);
    const cached = getCachedTreks();
    if (cached) {
      const meta = getCachedTrekMeta() || {};
      return {
        treks: cached,
        availableRegions: meta.availableRegions || [],
        availableDifficulties: meta.availableDifficulties || [],
        total: cached.length,
        fromCache: true
      };
    }
    return null;
  }
}

/**
 * Fetch a single trek by slug or ID (with cache-first acceleration)
 * @param {string} slug
 */
export async function getTrekBySlug(slug) {
  try {
    const res = await fetch(`${API_URL}/treks/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const json = await res.json();
    if (json.data) {
      setCachedTrekBySlug(slug, json.data);
    }
    return json.data || null;
  } catch (err) {
    console.warn(`⚠️ Fetching trek '${slug}' via API failed:`, err.message);
    return getCachedTrekBySlug(slug);
  }
}

/**
 * Create a new trek
 * @param {object} trekData
 */
export async function createTrek(trekData) {
  const res = await fetchWithAuth(`${API_URL}/treks`, {
    method: 'POST',
    body: JSON.stringify(trekData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create trek');
  return json.data;
}

/**
 * Update an existing trek
 * @param {string} id
 * @param {object} trekData
 */
export async function updateTrek(id, trekData) {
  const res = await fetchWithAuth(`${API_URL}/treks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(trekData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update trek');
  return json.data;
}

/**
 * Delete a trek
 * @param {string} id
 */
export async function deleteTrek(id) {
  const res = await fetchWithAuth(`${API_URL}/treks/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete trek');
  return json;
}

/**
 * Reorder treks display order
 * @param {string[]} orderedIds
 */
export async function reorderTreks(orderedIds) {
  const res = await fetchWithAuth(`${API_URL}/treks/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ orderedIds })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reorder treks');
  return json;
}
