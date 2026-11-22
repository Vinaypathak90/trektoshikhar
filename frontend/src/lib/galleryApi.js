import { GALLERY_HERO_SLIDES, GALLERY_PHOTOS } from '../data/galleryData';
import { fetchWithAuth } from './authApi';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://trektoshikhar.onrender.com/api';

const CACHE_KEY_GALLERY = 'tts_cached_gallery_v1';

export const GALLERY_CATEGORIES = [
  'Summit Views',
  'Winter Snow',
  'Camp Life',
  'Forest Trails',
  'Shikharite Family'
];

export const DEFAULT_GALLERY_SETTINGS = {
  id: 'global',
  hero_badge: 'Himalayan Expedition Chronicles',
  hero_title_line1: 'Captured On The Trails,',
  hero_title_cursive: 'felt forever in the soul.',
  hero_subtitle:
    'Browse trek-by-trek photo journals, click any frame to zoom in up to 350%, and read the real story behind every summit.',
  hero_slides: GALLERY_HERO_SLIDES,
  home_gallery_badge: 'Raw Trail Moments',
  home_gallery_title: 'Captured On The Trails',
  home_gallery_subtitle:
    'Real photos clicked by our trekkers and expedition leaders in Uttarakhand and Himachal Pradesh. Click any frame to zoom & read its story.',
  cta_badge: 'Be Part Of Our Next Expedition Album',
  cta_heading: 'Ready To Live These Moments Yourself?',
  cta_subtitle:
    'Every frame in this gallery was clicked on a real TrekToShikhar batch. Join our upcoming Shimla or Dehradun departures and bring home stories that last a lifetime.'
};

export function getCachedGallery() {
  try {
    const raw = localStorage.getItem(CACHE_KEY_GALLERY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.settings && Array.isArray(parsed.photos)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setCachedGallery(payload) {
  try {
    if (payload && payload.settings && Array.isArray(payload.photos)) {
      localStorage.setItem(CACHE_KEY_GALLERY, JSON.stringify(payload));
    }
  } catch {
    // Ignore quota errors
  }
}

function broadcastGalleryUpdate(payload) {
  window.dispatchEvent(new CustomEvent('tts-gallery-updated', { detail: payload }));
}

export async function getGalleryData(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.admin) params.append('admin', 'true');
    if (options.trek && options.trek !== 'all') params.append('trek', options.trek);
    if (options.featured) params.append('featured', 'true');
    const qs = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${API_URL}/gallery${qs}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const json = await res.json();

    const settings = json.settings || DEFAULT_GALLERY_SETTINGS;
    const photos = Array.isArray(json.photos) ? json.photos : GALLERY_PHOTOS;

    if (!options.admin && !options.trek && !options.featured) {
      setCachedGallery({ settings, photos });
    }

    return {
      settings,
      photos,
      total: json.total ?? photos.length,
      source: json.source || 'database',
      tableNotReady: Boolean(json.tableNotReady)
    };
  } catch (err) {
    console.warn('⚠️ Fetching Gallery via API failed, using cache/default:', err.message);
    const cached = getCachedGallery();
    return {
      settings: cached?.settings || DEFAULT_GALLERY_SETTINGS,
      photos: cached?.photos || GALLERY_PHOTOS,
      total: (cached?.photos || GALLERY_PHOTOS).length,
      source: 'cache',
      tableNotReady: false
    };
  }
}

export async function updateGallerySettings(settingsPayload) {
  const res = await fetchWithAuth(`${API_URL}/gallery/settings`, {
    method: 'PUT',
    body: JSON.stringify(settingsPayload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update gallery settings');

  const fresh = await getGalleryData({ admin: false });
  broadcastGalleryUpdate({ settings: fresh.settings, photos: fresh.photos });
  return json;
}

export async function createGalleryPhoto(photoData) {
  const res = await fetchWithAuth(`${API_URL}/gallery/photos`, {
    method: 'POST',
    body: JSON.stringify(photoData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to add photo');

  const fresh = await getGalleryData({ admin: false });
  broadcastGalleryUpdate({ settings: fresh.settings, photos: fresh.photos });
  return json;
}

export async function updateGalleryPhoto(id, photoData) {
  const res = await fetchWithAuth(`${API_URL}/gallery/photos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(photoData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update photo');

  const fresh = await getGalleryData({ admin: false });
  broadcastGalleryUpdate({ settings: fresh.settings, photos: fresh.photos });
  return json;
}

export async function deleteGalleryPhoto(id) {
  const res = await fetchWithAuth(`${API_URL}/gallery/photos/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete photo');

  const fresh = await getGalleryData({ admin: false });
  broadcastGalleryUpdate({ settings: fresh.settings, photos: fresh.photos });
  return json;
}

export async function reorderGalleryPhotos(orderedIds) {
  const res = await fetchWithAuth(`${API_URL}/gallery/photos/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ orderedIds })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reorder photos');

  const fresh = await getGalleryData({ admin: false });
  broadcastGalleryUpdate({ settings: fresh.settings, photos: fresh.photos });
  return json;
}

export async function resetGalleryData() {
  const res = await fetchWithAuth(`${API_URL}/gallery/reset`, {
    method: 'POST'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset gallery');

  const payload = {
    settings: json.settings || DEFAULT_GALLERY_SETTINGS,
    photos: json.photos || GALLERY_PHOTOS
  };
  setCachedGallery(payload);
  broadcastGalleryUpdate(payload);
  return json;
}
