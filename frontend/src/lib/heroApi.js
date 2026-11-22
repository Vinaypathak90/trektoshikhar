import { fetchWithAuth } from './authApi';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CACHE_KEY_HERO = 'tts_cached_hero_slides_v2';

/**
 * Get cached hero slides for 0ms initial render
 */
export function getCachedHeroSlides() {
  try {
    const raw = localStorage.getItem(CACHE_KEY_HERO);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch (e) {
    return null;
  }
}

/**
 * Cache hero slides locally
 */
export function setCachedHeroSlides(slides) {
  try {
    if (Array.isArray(slides) && slides.length > 0) {
      localStorage.setItem(CACHE_KEY_HERO, JSON.stringify(slides));
    }
  } catch (e) {}
}

/**
 * Fetch hero slides from backend
 * @param {boolean} admin - If true, fetches all slides (including inactive)
 */
export async function getHeroSlides(admin = false) {
  try {
    const res = await fetch(`${API_URL}/hero-slides${admin ? '?admin=true' : ''}`);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const json = await res.json();
    const slides = json.data || [];
    if (!admin && slides.length > 0) {
      setCachedHeroSlides(slides);
    }
    return slides;
  } catch (err) {
    console.warn('⚠️ Fetching hero slides via API failed, using fallback cache:', err.message);
    return getCachedHeroSlides();
  }
}

/**
 * Create a new hero slide in database
 * @param {object} slideData
 */
export async function createHeroSlide(slideData) {
  const res = await fetchWithAuth(`${API_URL}/hero-slides`, {
    method: 'POST',
    body: JSON.stringify(slideData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create slide');
  return json.data;
}

/**
 * Update an existing hero slide
 * @param {string} id
 * @param {object} slideData
 */
export async function updateHeroSlide(id, slideData) {
  const res = await fetchWithAuth(`${API_URL}/hero-slides/${id}`, {
    method: 'PUT',
    body: JSON.stringify(slideData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update slide');
  return json.data;
}

/**
 * Delete a hero slide
 * @param {string} id
 */
export async function deleteHeroSlide(id) {
  const res = await fetchWithAuth(`${API_URL}/hero-slides/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete slide');
  return json;
}

/**
 * Batch update display order
 * @param {string[]} orderedIds
 */
export async function reorderHeroSlides(orderedIds) {
  const res = await fetchWithAuth(`${API_URL}/hero-slides/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ orderedIds })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reorder slides');
  return json;
}
