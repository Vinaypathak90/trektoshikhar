import { fetchWithAuth } from './authApi';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CACHE_KEY_REVIEWS = 'tts_cached_google_reviews_v1';

export const AVATAR_COLOR_OPTIONS = [
  { label: 'Blue', value: 'bg-blue-600' },
  { label: 'Emerald', value: 'bg-emerald-600' },
  { label: 'Obsidian', value: 'bg-neutral-900' },
  { label: 'Rose', value: 'bg-rose-500' },
  { label: 'Amber', value: 'bg-amber-600' },
  { label: 'Indigo', value: 'bg-indigo-600' },
  { label: 'Teal', value: 'bg-teal-600' },
  { label: 'Purple', value: 'bg-purple-600' },
  { label: 'Crimson', value: 'bg-[#E5383B]' }
];

export const DEFAULT_REVIEWS_SETTINGS = {
  id: 'global',
  badge_text: 'Verified Himalayan Trekker Reviews',
  headline: 'EXCELLENT',
  star_rating: 5,
  total_reviews_label: '108+ verified reviews',
  subtitle_suffix: 'across Google & trail logs',
  show_google_logo: true,
  is_active: true
};

export const DEFAULT_REVIEWS_LIST = [
  {
    id: 'rev-1',
    name: 'Ashish Agarwal',
    avatarBg: 'bg-blue-600',
    avatarText: 'A',
    timeAgo: '8 months ago',
    trekTag: 'Nag Tibba Weekend Trek',
    rating: 5,
    review: 'Trek To Shikhar provided brilliant experience for my first trek. They had amazing facilities, warm four-season tents, and provided guidance of utmost quality. The certified NIM guides were patient and motivating throughout the summit climb. Highly recommend!',
    isVerified: true,
    verifiedLabel: 'Verified Stay & Trail',
    isActive: true
  },
  {
    id: 'rev-2',
    name: 'Mayank Bhardwaj',
    avatarBg: 'bg-emerald-600',
    avatarText: 'M',
    timeAgo: '9 months ago',
    trekTag: 'Nag Tibba Summit',
    rating: 5,
    review: 'Nag Tibba with Trek To Shikhar was well-planned and smoothly executed. The trek leaders explained the trail well and motivated the group throughout the difficult stretches. Fresh hot meals at sub-zero base camp was a blessing.',
    isVerified: true,
    verifiedLabel: 'Verified Stay & Trail',
    isActive: true
  },
  {
    id: 'rev-3',
    name: 'Kamal Sarkar',
    avatarBg: 'bg-neutral-900',
    avatarText: 'KS',
    timeAgo: '9 months ago',
    trekTag: 'Brahmatal Winter Expedition',
    rating: 5,
    review: 'Brahmatal Trek exceeded expectations in every way! The team maintained a perfect balance of safety and enjoyment. Medical pulse oximeter checks twice daily and reliable high-altitude sleeping bags kept us warm at -5°C.',
    isVerified: true,
    verifiedLabel: 'Verified Stay & Trail',
    isActive: true
  },
  {
    id: 'rev-4',
    name: 'Priya Sharma',
    avatarBg: 'bg-rose-500',
    avatarText: 'P',
    timeAgo: '6 months ago',
    trekTag: 'Kedarkantha Summit Ridge',
    rating: 5,
    review: 'Kedarkantha sunrise summit was pure magic! As a solo female trekker, I felt 100% safe and respected. Strict 12-15 batch size meant genuine personal care. Microspikes and gaiters were provided on spot for the snow trail.',
    isVerified: true,
    verifiedLabel: 'Verified Stay & Trail',
    isActive: true
  },
  {
    id: 'rev-5',
    name: 'Rahul Verma',
    avatarBg: 'bg-amber-600',
    avatarText: 'R',
    timeAgo: '5 months ago',
    trekTag: 'Hatu Peak & Alpine Ridge',
    rating: 5,
    review: 'Hatu Peak alpine ridge trail was breathtaking! Equipment was spotless—waterproof dome tents and clean thermal sleeping bags kept us warm. The certified guides are born locals with deep mountain respect. Booking Kuari Pass next!',
    isVerified: true,
    verifiedLabel: 'Verified Stay & Trail',
    isActive: true
  },
  {
    id: 'rev-6',
    name: 'Sunita Rawat',
    avatarBg: 'bg-indigo-600',
    avatarText: 'S',
    timeAgo: '7 months ago',
    trekTag: 'Churdhar Sanctuary Trek',
    rating: 5,
    review: 'Churdhar Peak sanctuary trek was thrilling! The team monitored hydration and acclimatization with immense care. Zero plastic on trail, transparent pricing, and authentic mountain hospitality. 5 stars all the way!',
    isVerified: true,
    verifiedLabel: 'Verified Stay & Trail',
    isActive: true
  },
  {
    id: 'rev-7',
    name: 'Kunal Malhotra',
    avatarBg: 'bg-teal-600',
    avatarText: 'K',
    timeAgo: '4 months ago',
    trekTag: 'Dayara Bugyal Meadows',
    rating: 5,
    review: 'Having trekked across Uttarakhand with several commercial agencies, Trek To Shikhar stands in a league of its own. Capping batches strictly at 12–15 trekkers ensures zero trail chaos and medical-grade expedition safety.',
    isVerified: true,
    verifiedLabel: 'Verified Stay & Trail',
    isActive: true
  },
  {
    id: 'rev-8',
    name: 'Tanvi Kapoor',
    avatarBg: 'bg-purple-600',
    avatarText: 'T',
    timeAgo: '3 months ago',
    trekTag: 'Kuari Pass Expedition',
    rating: 5,
    review: 'From seamless pickup at Dehradun station to reaching the summit ridge, every logistical detail was flawless. The trek leaders are genuine mountaineers who prioritize safety first. Best Himalayan trekking operator hands down!',
    isVerified: true,
    verifiedLabel: 'Verified Stay & Trail',
    isActive: true
  }
];

export function getCachedReviewsPayload() {
  try {
    const raw = localStorage.getItem(CACHE_KEY_REVIEWS);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.settings && Array.isArray(parsed.reviews)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setCachedReviewsPayload(payload) {
  try {
    if (payload && payload.settings && Array.isArray(payload.reviews)) {
      localStorage.setItem(CACHE_KEY_REVIEWS, JSON.stringify(payload));
    }
  } catch {
    // Ignore storage quota exceptions
  }
}

function broadcastUpdate(payload) {
  window.dispatchEvent(new CustomEvent('tts-reviews-updated', { detail: payload }));
}

export async function getReviewsData(options = {}) {
  try {
    const qs = options.admin ? '?admin=true' : '';
    const res = await fetch(`${API_URL}/reviews${qs}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const json = await res.json();

    const settings = json.settings || DEFAULT_REVIEWS_SETTINGS;
    const reviews = Array.isArray(json.reviews) ? json.reviews : DEFAULT_REVIEWS_LIST;

    if (!options.admin) {
      setCachedReviewsPayload({ settings, reviews });
    }

    return {
      settings,
      reviews,
      total: json.total ?? reviews.length,
      source: json.source || 'database',
      tableNotReady: Boolean(json.tableNotReady)
    };
  } catch (err) {
    console.warn('⚠️ Fetching Google Reviews via API failed, using cache/default:', err.message);
    const cached = getCachedReviewsPayload();
    return {
      settings: cached?.settings || DEFAULT_REVIEWS_SETTINGS,
      reviews: cached?.reviews || DEFAULT_REVIEWS_LIST,
      total: (cached?.reviews || DEFAULT_REVIEWS_LIST).length,
      source: 'cache',
      tableNotReady: false
    };
  }
}

export async function updateReviewsSettings(settingsPayload) {
  const res = await fetchWithAuth(`${API_URL}/reviews/settings`, {
    method: 'PUT',
    body: JSON.stringify(settingsPayload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update reviews settings');

  // Refresh public cache and notify live components
  const fresh = await getReviewsData({ admin: false });
  broadcastUpdate({ settings: fresh.settings, reviews: fresh.reviews });
  return json;
}

export async function createReview(reviewData) {
  const res = await fetchWithAuth(`${API_URL}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create review');

  const fresh = await getReviewsData({ admin: false });
  broadcastUpdate({ settings: fresh.settings, reviews: fresh.reviews });
  return json;
}

export async function updateReview(id, reviewData) {
  const res = await fetchWithAuth(`${API_URL}/reviews/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update review');

  const fresh = await getReviewsData({ admin: false });
  broadcastUpdate({ settings: fresh.settings, reviews: fresh.reviews });
  return json;
}

export async function deleteReview(id) {
  const res = await fetchWithAuth(`${API_URL}/reviews/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete review');

  const fresh = await getReviewsData({ admin: false });
  broadcastUpdate({ settings: fresh.settings, reviews: fresh.reviews });
  return json;
}

export async function reorderReviews(orderedIds) {
  const res = await fetchWithAuth(`${API_URL}/reviews/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ orderedIds })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reorder reviews');

  const fresh = await getReviewsData({ admin: false });
  broadcastUpdate({ settings: fresh.settings, reviews: fresh.reviews });
  return json;
}

export async function resetReviewsData() {
  const res = await fetchWithAuth(`${API_URL}/reviews/reset`, {
    method: 'POST'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset reviews');

  const payload = {
    settings: json.settings || DEFAULT_REVIEWS_SETTINGS,
    reviews: json.reviews || DEFAULT_REVIEWS_LIST
  };
  setCachedReviewsPayload(payload);
  broadcastUpdate(payload);
  return json;
}
