import { fetchWithAuth } from './authApi';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://trektoshikhar.onrender.com/api';

const CACHE_KEY_WHY_CHOOSE = 'tts_cached_why_choose_v1';

export const DEFAULT_WHY_CHOOSE_DATA = {
  id: 'global',
  badge_text: 'TRUSTED HIMALAYAN EXPEDITION LEADER',
  title: 'Why Choose TrekToShikhar?',
  subtitle: 'Trusted by over 5 Lakh trekkers and recognized by leading adventure bodies.',
  is_active: true,
  stats: [
    {
      id: 'stat-1',
      icon: 'Users',
      target_number: 500000,
      prefix: '',
      suffix: '+',
      label: 'Happy Trekkers',
      sublabel: 'Across 60+ destinations',
      is_highlighted: true
    },
    {
      id: 'stat-2',
      icon: 'Mountain',
      target_number: 100,
      prefix: '',
      suffix: '+',
      label: 'Treks',
      sublabel: 'Multiple regions',
      is_highlighted: false
    },
    {
      id: 'stat-3',
      icon: 'Trophy',
      target_number: 20,
      prefix: '',
      suffix: '+',
      label: 'Awards',
      sublabel: 'Industry recognition',
      is_highlighted: false
    },
    {
      id: 'stat-4',
      icon: 'Clock',
      target_number: 16,
      prefix: '',
      suffix: '+',
      label: 'Years',
      sublabel: 'Of safe adventures',
      is_highlighted: false
    },
    {
      id: 'stat-5',
      icon: 'Sprout',
      target_number: 1238,
      prefix: '',
      suffix: '+',
      label: 'Heal Himalaya',
      sublabel: 'Cleanup drives conducted successfully',
      is_highlighted: false
    }
  ]
};

/**
 * Get instant cached data for 0ms first paint (Stale-While-Revalidate)
 */
export function getCachedWhyChoose() {
  try {
    const raw = localStorage.getItem(CACHE_KEY_WHY_CHOOSE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.stats) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Persist Why Choose data locally
 */
export function setCachedWhyChoose(data) {
  try {
    if (data && Array.isArray(data.stats)) {
      localStorage.setItem(CACHE_KEY_WHY_CHOOSE, JSON.stringify(data));
    }
  } catch {
    // Ignore storage quota exceptions
  }
}

/**
 * Fetch global Why Choose TrekToShikhar config & stats from Backend API
 */
export async function getWhyChooseData(options = {}) {
  try {
    const qs = options.admin ? '?admin=true' : '';
    const res = await fetch(`${API_URL}/why-choose${qs}`);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const json = await res.json();
    if (json && json.data) {
      setCachedWhyChoose(json.data);
      return {
        data: json.data,
        tableNotReady: !!json.tableNotReady,
        source: json.source || 'database'
      };
    }
    return {
      data: getCachedWhyChoose() || DEFAULT_WHY_CHOOSE_DATA,
      tableNotReady: false,
      source: 'fallback'
    };
  } catch (err) {
    console.warn('⚠️ Fetching Why Choose section via API failed, using cache/default:', err.message);
    return {
      data: getCachedWhyChoose() || DEFAULT_WHY_CHOOSE_DATA,
      tableNotReady: false,
      source: 'cache'
    };
  }
}

/**
 * Update global Why Choose section from Admin Dashboard
 */
export async function updateWhyChooseData(payload) {
  const res = await fetchWithAuth(`${API_URL}/why-choose`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to save Why Choose section');
  }
  if (json.data) {
    setCachedWhyChoose(json.data);
    // Notify any active component in the same browser session immediately
    window.dispatchEvent(new CustomEvent('tts-why-choose-updated', { detail: json.data }));
  }
  return json;
}

/**
 * Reset Why Choose section to TrekToShikhar defaults
 */
export async function resetWhyChooseData() {
  const res = await fetchWithAuth(`${API_URL}/why-choose/reset`, {
    method: 'POST'
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to reset Why Choose section');
  }
  if (json.data) {
    setCachedWhyChoose(json.data);
    window.dispatchEvent(new CustomEvent('tts-why-choose-updated', { detail: json.data }));
  }
  return json;
}
