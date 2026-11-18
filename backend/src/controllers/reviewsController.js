import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { appCache } from '../utils/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_PATH = path.resolve(__dirname, '../data/reviews_store.json');

const CACHE_PREFIX = 'reviews_';

export const DEFAULT_SETTINGS = {
  id: 'global',
  badge_text: 'Verified Himalayan Trekker Reviews',
  headline: 'EXCELLENT',
  star_rating: 5,
  total_reviews_label: '108+ verified reviews',
  subtitle_suffix: 'across Google & trail logs',
  show_google_logo: true,
  is_active: true
};

export const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Ashish Agarwal',
    avatar_bg: 'bg-blue-600',
    avatar_text: 'A',
    time_ago: '8 months ago',
    trek_tag: 'Nag Tibba Weekend Trek',
    rating: 5,
    review: 'Trek To Shikhar provided brilliant experience for my first trek. They had amazing facilities, warm four-season tents, and provided guidance of utmost quality. The certified NIM guides were patient and motivating throughout the summit climb. Highly recommend!',
    is_verified: true,
    verified_label: 'Verified Stay & Trail',
    display_order: 1,
    is_active: true
  },
  {
    id: 'rev-2',
    name: 'Mayank Bhardwaj',
    avatar_bg: 'bg-emerald-600',
    avatar_text: 'M',
    time_ago: '9 months ago',
    trek_tag: 'Nag Tibba Summit',
    rating: 5,
    review: 'Nag Tibba with Trek To Shikhar was well-planned and smoothly executed. The trek leaders explained the trail well and motivated the group throughout the difficult stretches. Fresh hot meals at sub-zero base camp was a blessing.',
    is_verified: true,
    verified_label: 'Verified Stay & Trail',
    display_order: 2,
    is_active: true
  },
  {
    id: 'rev-3',
    name: 'Kamal Sarkar',
    avatar_bg: 'bg-neutral-900',
    avatar_text: 'KS',
    time_ago: '9 months ago',
    trek_tag: 'Brahmatal Winter Expedition',
    rating: 5,
    review: 'Brahmatal Trek exceeded expectations in every way! The team maintained a perfect balance of safety and enjoyment. Medical pulse oximeter checks twice daily and reliable high-altitude sleeping bags kept us warm at -5°C.',
    is_verified: true,
    verified_label: 'Verified Stay & Trail',
    display_order: 3,
    is_active: true
  },
  {
    id: 'rev-4',
    name: 'Priya Sharma',
    avatar_bg: 'bg-rose-500',
    avatar_text: 'P',
    time_ago: '6 months ago',
    trek_tag: 'Kedarkantha Summit Ridge',
    rating: 5,
    review: 'Kedarkantha sunrise summit was pure magic! As a solo female trekker, I felt 100% safe and respected. Strict 12-15 batch size meant genuine personal care. Microspikes and gaiters were provided on spot for the snow trail.',
    is_verified: true,
    verified_label: 'Verified Stay & Trail',
    display_order: 4,
    is_active: true
  },
  {
    id: 'rev-5',
    name: 'Rahul Verma',
    avatar_bg: 'bg-amber-600',
    avatar_text: 'R',
    time_ago: '5 months ago',
    trek_tag: 'Hatu Peak & Alpine Ridge',
    rating: 5,
    review: 'Hatu Peak alpine ridge trail was breathtaking! Equipment was spotless—waterproof dome tents and clean thermal sleeping bags kept us warm. The certified guides are born locals with deep mountain respect. Booking Kuari Pass next!',
    is_verified: true,
    verified_label: 'Verified Stay & Trail',
    display_order: 5,
    is_active: true
  },
  {
    id: 'rev-6',
    name: 'Sunita Rawat',
    avatar_bg: 'bg-indigo-600',
    avatar_text: 'S',
    time_ago: '7 months ago',
    trek_tag: 'Churdhar Sanctuary Trek',
    rating: 5,
    review: 'Churdhar Peak sanctuary trek was thrilling! The team monitored hydration and acclimatization with immense care. Zero plastic on trail, transparent pricing, and authentic mountain hospitality. 5 stars all the way!',
    is_verified: true,
    verified_label: 'Verified Stay & Trail',
    display_order: 6,
    is_active: true
  },
  {
    id: 'rev-7',
    name: 'Kunal Malhotra',
    avatar_bg: 'bg-teal-600',
    avatar_text: 'K',
    time_ago: '4 months ago',
    trek_tag: 'Dayara Bugyal Meadows',
    rating: 5,
    review: 'Having trekked across Uttarakhand with several commercial agencies, Trek To Shikhar stands in a league of its own. Capping batches strictly at 12–15 trekkers ensures zero trail chaos and medical-grade expedition safety.',
    is_verified: true,
    verified_label: 'Verified Stay & Trail',
    display_order: 7,
    is_active: true
  },
  {
    id: 'rev-8',
    name: 'Tanvi Kapoor',
    avatar_bg: 'bg-purple-600',
    avatar_text: 'T',
    time_ago: '3 months ago',
    trek_tag: 'Kuari Pass Expedition',
    rating: 5,
    review: 'From seamless pickup at Dehradun station to reaching the summit ridge, every logistical detail was flawless. The trek leaders are genuine mountaineers who prioritize safety first. Best Himalayan trekking operator hands down!',
    is_verified: true,
    verified_label: 'Verified Stay & Trail',
    display_order: 8,
    is_active: true
  }
];

const isTableMissing = (error) =>
  Boolean(error && (error.code === 'PGRST205' || error.message?.includes('does not exist') || error.message?.includes('schema cache')));

const deriveInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'T';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const formatSettings = (row) => ({
  id: 'global',
  badge_text: row?.badge_text ?? DEFAULT_SETTINGS.badge_text,
  headline: row?.headline || DEFAULT_SETTINGS.headline,
  star_rating: Math.min(5, Math.max(1, Number(row?.star_rating ?? 5) || 5)),
  total_reviews_label: row?.total_reviews_label ?? DEFAULT_SETTINGS.total_reviews_label,
  subtitle_suffix: row?.subtitle_suffix ?? DEFAULT_SETTINGS.subtitle_suffix,
  show_google_logo: row?.show_google_logo !== undefined ? Boolean(row.show_google_logo) : true,
  is_active: row?.is_active !== undefined ? Boolean(row.is_active) : true,
  updated_at: row?.updated_at || new Date().toISOString()
});

const formatReview = (row, idx = 0) => ({
  id: row.id || `rev-${idx + 1}`,
  name: row.name || 'Himalayan Trekker',
  avatar_bg: row.avatar_bg || row.avatarBg || 'bg-blue-600',
  avatarBg: row.avatar_bg || row.avatarBg || 'bg-blue-600',
  avatar_text: row.avatar_text || row.avatarText || deriveInitials(row.name),
  avatarText: row.avatar_text || row.avatarText || deriveInitials(row.name),
  time_ago: row.time_ago || row.timeAgo || 'Recently',
  timeAgo: row.time_ago || row.timeAgo || 'Recently',
  trek_tag: row.trek_tag || row.trekTag || 'Himalayan Expedition',
  trekTag: row.trek_tag || row.trekTag || 'Himalayan Expedition',
  rating: Math.min(5, Math.max(1, Number(row.rating ?? 5) || 5)),
  review: row.review || '',
  is_verified: row.is_verified !== undefined ? Boolean(row.is_verified) : true,
  isVerified: row.is_verified !== undefined ? Boolean(row.is_verified) : true,
  verified_label: row.verified_label || row.verifiedLabel || 'Verified Stay & Trail',
  verifiedLabel: row.verified_label || row.verifiedLabel || 'Verified Stay & Trail',
  display_order: Number(row.display_order ?? row.displayOrder ?? idx + 1),
  is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
  isActive: row.is_active !== undefined ? Boolean(row.is_active) : true,
  created_at: row.created_at,
  updated_at: row.updated_at
});

// Local JSON fallback persistence helpers
const readLocalStore = () => {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'));
      if (parsed && parsed.settings && Array.isArray(parsed.reviews)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not read local reviews store:', err.message);
  }
  return {
    settings: { ...DEFAULT_SETTINGS },
    reviews: DEFAULT_REVIEWS.map((r) => ({ ...r }))
  };
};

const writeLocalStore = (store) => {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ Could not write local reviews store:', err.message);
  }
};

/**
 * GET /api/reviews
 * Fetches both section header settings & ordered review cards
 */
export const getAllReviews = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const cacheKey = `${CACHE_PREFIX}${isAdmin ? 'admin' : 'public'}`;

    if (!isAdmin) {
      const cached = appCache.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cached);
      }
    }

    const [settingsRes, reviewsRes] = await Promise.all([
      supabase.from('google_reviews_settings').select('*').eq('id', 'global').limit(1),
      isAdmin
        ? supabase.from('google_reviews').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: true })
        : supabase.from('google_reviews').select('*').eq('is_active', true).order('display_order', { ascending: true }).order('created_at', { ascending: true })
    ]);

    if (isTableMissing(settingsRes.error) || isTableMissing(reviewsRes.error)) {
      const local = readLocalStore();
      const sorted = [...local.reviews].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      const filtered = isAdmin ? sorted : sorted.filter((r) => r.is_active !== false);
      const payload = {
        success: true,
        source: 'local_fallback',
        tableNotReady: true,
        settings: formatSettings(local.settings),
        reviews: filtered.map(formatReview),
        total: filtered.length
      };
      if (!isAdmin) appCache.set(cacheKey, payload, 300);
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(payload);
    }

    if (settingsRes.error || reviewsRes.error) {
      const errMsg = settingsRes.error?.message || reviewsRes.error?.message;
      console.warn('⚠️ Supabase reviews query error:', errMsg);
      const local = readLocalStore();
      const filtered = isAdmin ? local.reviews : local.reviews.filter((r) => r.is_active !== false);
      return res.status(200).json({
        success: true,
        source: 'fallback',
        tableNotReady: false,
        settings: formatSettings(local.settings),
        reviews: filtered.map(formatReview),
        total: filtered.length
      });
    }

    const settings = formatSettings(settingsRes.data?.[0] || DEFAULT_SETTINGS);
    const reviews = (reviewsRes.data || []).map(formatReview);

    const payload = {
      success: true,
      source: 'database',
      tableNotReady: false,
      settings,
      reviews,
      total: reviews.length
    };

    if (!isAdmin) {
      appCache.set(cacheKey, payload, 600);
    }
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews: ' + err.message
    });
  }
};

/**
 * PUT /api/reviews/settings
 * Updates the section header settings (EXCELLENT, stars, 108+ verified reviews, etc.)
 */
export const updateReviewsSettings = async (req, res) => {
  try {
    const body = req.body || {};
    const payload = {
      id: 'global',
      badge_text: body.badge_text !== undefined ? String(body.badge_text).trim() : DEFAULT_SETTINGS.badge_text,
      headline: body.headline ? String(body.headline).trim() : DEFAULT_SETTINGS.headline,
      star_rating: Math.min(5, Math.max(1, Number(body.star_rating ?? 5) || 5)),
      total_reviews_label: body.total_reviews_label !== undefined ? String(body.total_reviews_label).trim() : DEFAULT_SETTINGS.total_reviews_label,
      subtitle_suffix: body.subtitle_suffix !== undefined ? String(body.subtitle_suffix).trim() : DEFAULT_SETTINGS.subtitle_suffix,
      show_google_logo: body.show_google_logo !== undefined ? Boolean(body.show_google_logo) : true,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      updated_at: new Date().toISOString()
    };

    const local = readLocalStore();
    local.settings = payload;
    writeLocalStore(local);
    appCache.clearPrefix(CACHE_PREFIX);

    const { data, error } = await supabase
      .from('google_reviews_settings')
      .upsert([payload], { onConflict: 'id' })
      .select();

    if (isTableMissing(error)) {
      return res.status(200).json({
        success: true,
        source: 'local_fallback',
        tableNotReady: true,
        message: 'Settings saved live! Run google_reviews.sql in Supabase for cloud sync.',
        data: formatSettings(payload)
      });
    }

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      source: 'database',
      tableNotReady: false,
      message: 'Reviews header settings updated live!',
      data: formatSettings(data?.[0] || payload)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update settings: ' + err.message });
  }
};

/**
 * POST /api/reviews
 * Creates a new Google review card
 */
export const createReview = async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.review) {
      return res.status(400).json({
        success: false,
        error: 'Reviewer name and review text are required.'
      });
    }

    const local = readLocalStore();
    const nextOrder = body.display_order !== undefined
      ? Number(body.display_order)
      : (local.reviews.length + 1);

    const dbPayload = {
      name: String(body.name).trim(),
      avatar_bg: body.avatar_bg || body.avatarBg || 'bg-blue-600',
      avatar_text: (body.avatar_text || body.avatarText || deriveInitials(body.name)).trim().slice(0, 3).toUpperCase(),
      time_ago: (body.time_ago || body.timeAgo || 'Recently').trim(),
      trek_tag: (body.trek_tag || body.trekTag || 'Himalayan Expedition').trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating ?? 5) || 5)),
      review: String(body.review).trim(),
      is_verified: body.is_verified !== undefined ? Boolean(body.is_verified) : true,
      verified_label: (body.verified_label || body.verifiedLabel || 'Verified Stay & Trail').trim(),
      display_order: nextOrder,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      updated_at: new Date().toISOString()
    };

    appCache.clearPrefix(CACHE_PREFIX);

    const { data, error } = await supabase
      .from('google_reviews')
      .insert([dbPayload])
      .select();

    if (isTableMissing(error)) {
      const localRecord = {
        id: `rev-${crypto.randomBytes(4).toString('hex')}`,
        ...dbPayload,
        created_at: new Date().toISOString()
      };
      local.reviews.push(localRecord);
      writeLocalStore(local);

      return res.status(201).json({
        success: true,
        source: 'local_fallback',
        tableNotReady: true,
        message: 'Review added live!',
        data: formatReview(localRecord)
      });
    }

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(201).json({
      success: true,
      source: 'database',
      tableNotReady: false,
      message: 'New trekker review published live!',
      data: formatReview(data[0])
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create review: ' + err.message });
  }
};

/**
 * PUT /api/reviews/:id
 * Updates an existing review card
 */
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const updatePayload = {
      updated_at: new Date().toISOString()
    };

    if (body.name !== undefined) updatePayload.name = String(body.name).trim();
    if (body.avatar_bg !== undefined || body.avatarBg !== undefined) updatePayload.avatar_bg = body.avatar_bg || body.avatarBg;
    if (body.avatar_text !== undefined || body.avatarText !== undefined) {
      const rawTxt = body.avatar_text || body.avatarText;
      updatePayload.avatar_text = (rawTxt || deriveInitials(body.name)).trim().slice(0, 3).toUpperCase();
    }
    if (body.time_ago !== undefined || body.timeAgo !== undefined) updatePayload.time_ago = (body.time_ago || body.timeAgo).trim();
    if (body.trek_tag !== undefined || body.trekTag !== undefined) updatePayload.trek_tag = (body.trek_tag || body.trekTag).trim();
    if (body.rating !== undefined) updatePayload.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    if (body.review !== undefined) updatePayload.review = String(body.review).trim();
    if (body.is_verified !== undefined || body.isVerified !== undefined) updatePayload.is_verified = Boolean(body.is_verified ?? body.isVerified);
    if (body.verified_label !== undefined || body.verifiedLabel !== undefined) updatePayload.verified_label = (body.verified_label || body.verifiedLabel).trim();
    if (body.display_order !== undefined) updatePayload.display_order = Number(body.display_order);
    if (body.is_active !== undefined || body.isActive !== undefined) updatePayload.is_active = Boolean(body.is_active ?? body.isActive);

    appCache.clearPrefix(CACHE_PREFIX);

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUUID) {
      const { data, error } = await supabase
        .from('google_reviews')
        .update(updatePayload)
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        return res.status(200).json({
          success: true,
          source: 'database',
          tableNotReady: false,
          message: 'Review updated live!',
          data: formatReview(data[0])
        });
      }

      if (error && !isTableMissing(error)) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    // Fallback to local JSON store (when using non-UUID fallback ID or tableNotReady)
    const local = readLocalStore();
    const idx = local.reviews.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, error: `Review '${id}' not found` });
    }
    local.reviews[idx] = { ...local.reviews[idx], ...updatePayload };
    writeLocalStore(local);

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      tableNotReady: true,
      message: 'Review updated live!',
      data: formatReview(local.reviews[idx])
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update review: ' + err.message });
  }
};

/**
 * DELETE /api/reviews/:id
 * Deletes a review card
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    appCache.clearPrefix(CACHE_PREFIX);

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUUID) {
      const { error } = await supabase.from('google_reviews').delete().eq('id', id);
      if (!error) {
        return res.status(200).json({
          success: true,
          message: 'Review deleted successfully!'
        });
      }
      if (!isTableMissing(error)) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    const local = readLocalStore();
    local.reviews = local.reviews.filter((r) => String(r.id) !== String(id));
    writeLocalStore(local);

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      message: 'Review deleted successfully!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete review: ' + err.message });
  }
};

/**
 * PUT /api/reviews/reorder
 * Batch reorder review cards
 */
export const reorderReviews = async (req, res) => {
  try {
    const { orderedIds } = req.body || {};
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, error: 'orderedIds must be an array' });
    }

    appCache.clearPrefix(CACHE_PREFIX);

    const allUUIDs = orderedIds.every((id) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
    );

    if (allUUIDs && orderedIds.length > 0) {
      const results = await Promise.all(
        orderedIds.map((id, index) =>
          supabase
            .from('google_reviews')
            .update({ display_order: index + 1, updated_at: new Date().toISOString() })
            .eq('id', id)
        )
      );
      const firstErr = results.find((r) => r.error)?.error;
      if (!firstErr) {
        return res.status(200).json({ success: true, message: 'Reviews reordered live!' });
      }
      if (!isTableMissing(firstErr)) {
        return res.status(400).json({ success: false, error: firstErr.message });
      }
    }

    const local = readLocalStore();
    const orderMap = new Map(orderedIds.map((id, idx) => [String(id), idx + 1]));
    local.reviews = local.reviews
      .map((r) => ({ ...r, display_order: orderMap.get(String(r.id)) ?? r.display_order }))
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    writeLocalStore(local);

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      message: 'Reviews reordered live!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to reorder reviews: ' + err.message });
  }
};

/**
 * POST /api/reviews/reset
 * Resets header settings & reviews back to default 8 verified TrekToShikhar reviews
 */
export const resetReviews = async (req, res) => {
  try {
    appCache.clearPrefix(CACHE_PREFIX);

    const freshLocal = {
      settings: { ...DEFAULT_SETTINGS, updated_at: new Date().toISOString() },
      reviews: DEFAULT_REVIEWS.map((r) => ({ ...r }))
    };
    writeLocalStore(freshLocal);

    const { error: settingsErr } = await supabase
      .from('google_reviews_settings')
      .upsert([freshLocal.settings], { onConflict: 'id' });

    if (!isTableMissing(settingsErr)) {
      await supabase.from('google_reviews').delete().neq('display_order', -9999);
      const seedRows = DEFAULT_REVIEWS.map(({ id, ...rest }) => ({
        ...rest,
        updated_at: new Date().toISOString()
      }));
      const { data: inserted } = await supabase.from('google_reviews').insert(seedRows).select();
      return res.status(200).json({
        success: true,
        source: 'database',
        message: 'Reviews reset to defaults!',
        settings: formatSettings(freshLocal.settings),
        reviews: (inserted || DEFAULT_REVIEWS).map(formatReview)
      });
    }

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      tableNotReady: true,
      message: 'Reviews reset to defaults!',
      settings: formatSettings(freshLocal.settings),
      reviews: freshLocal.reviews.map(formatReview)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to reset reviews: ' + err.message });
  }
};
