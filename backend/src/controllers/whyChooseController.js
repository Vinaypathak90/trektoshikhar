import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../config/supabase.js';
import { appCache } from '../utils/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_PATH = path.resolve(__dirname, '../data/why_choose_store.json');

const CACHE_KEY = 'why_choose_global';

export const DEFAULT_WHY_CHOOSE = {
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

// Local JSON fallback helpers (used seamlessly if Supabase table is not yet created)
const readLocalStore = () => {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const raw = fs.readFileSync(LOCAL_STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('⚠️ Could not read local why_choose store:', err.message);
  }
  return DEFAULT_WHY_CHOOSE;
};

const writeLocalStore = (payload) => {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ Could not write local why_choose store:', err.message);
  }
};

// Normalize row to consistent shape
const normalizeData = (row) => {
  if (!row) return DEFAULT_WHY_CHOOSE;
  let stats = [];
  if (Array.isArray(row.stats)) {
    stats = row.stats;
  } else if (typeof row.stats === 'string') {
    try {
      stats = JSON.parse(row.stats);
    } catch {
      stats = DEFAULT_WHY_CHOOSE.stats;
    }
  } else {
    stats = DEFAULT_WHY_CHOOSE.stats;
  }

  return {
    id: row.id || 'global',
    badge_text: row.badge_text ?? DEFAULT_WHY_CHOOSE.badge_text,
    title: row.title || DEFAULT_WHY_CHOOSE.title,
    subtitle: row.subtitle ?? DEFAULT_WHY_CHOOSE.subtitle,
    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
    stats: stats.map((s, idx) => ({
      id: s.id || `stat-${idx + 1}`,
      icon: s.icon || 'Mountain',
      target_number: Number(s.target_number ?? s.targetNumber ?? 0) || 0,
      prefix: s.prefix || '',
      suffix: s.suffix ?? '+',
      label: s.label || 'Milestone',
      sublabel: s.sublabel || '',
      is_highlighted: Boolean(s.is_highlighted ?? s.isHighlighted ?? false)
    })),
    updated_at: row.updated_at || new Date().toISOString()
  };
};

/**
 * GET /api/why-choose
 * Retrieves global Why Choose TrekToShikhar section config & animated stats
 */
export const getWhyChooseSection = async (req, res) => {
  try {
    const bypassCache = req.query.admin === 'true' || req.query.fresh === 'true';

    if (!bypassCache) {
      const cached = appCache.get(CACHE_KEY);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cached);
      }
    }

    const { data, error } = await supabase
      .from('why_choose_section')
      .select('*')
      .eq('id', 'global')
      .limit(1);

    if (error) {
      console.warn('⚠️ Supabase why_choose_section query note:', error.message);
      const localData = normalizeData(readLocalStore());
      const fallbackPayload = {
        success: true,
        source: 'local_fallback',
        tableNotReady: error.code === 'PGRST205' || error.message?.includes('does not exist'),
        data: localData
      };
      appCache.set(CACHE_KEY, fallbackPayload, 300);
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(fallbackPayload);
    }

    // If table exists but no row yet, seed the global default row automatically
    if (!data || data.length === 0) {
      const seedPayload = {
        ...DEFAULT_WHY_CHOOSE,
        updated_at: new Date().toISOString()
      };
      const { data: seeded } = await supabase
        .from('why_choose_section')
        .upsert([seedPayload], { onConflict: 'id' })
        .select();

      const resultPayload = {
        success: true,
        source: 'database',
        tableNotReady: false,
        data: normalizeData(seeded?.[0] || seedPayload)
      };
      appCache.set(CACHE_KEY, resultPayload, 600);
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(resultPayload);
    }

    const responsePayload = {
      success: true,
      source: 'database',
      tableNotReady: false,
      data: normalizeData(data[0])
    };

    appCache.set(CACHE_KEY, responsePayload, 600);
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(responsePayload);
  } catch (err) {
    console.error('Error fetching why_choose_section:', err);
    return res.status(200).json({
      success: true,
      source: 'fallback',
      data: normalizeData(readLocalStore())
    });
  }
};

/**
 * PUT /api/why-choose
 * Updates global Why Choose section config & stat cards (from Admin Dashboard)
 */
export const updateWhyChooseSection = async (req, res) => {
  try {
    const body = req.body || {};

    const cleanStats = Array.isArray(body.stats)
      ? body.stats.map((s, idx) => ({
          id: s.id || `stat-${Date.now()}-${idx}`,
          icon: s.icon || 'Mountain',
          target_number: Math.max(0, Number(s.target_number ?? s.targetNumber ?? 0) || 0),
          prefix: String(s.prefix || '').slice(0, 12),
          suffix: String(s.suffix ?? '+').slice(0, 12),
          label: String(s.label || 'Stat Title').trim(),
          sublabel: String(s.sublabel || '').trim(),
          is_highlighted: Boolean(s.is_highlighted ?? s.isHighlighted ?? false)
        }))
      : DEFAULT_WHY_CHOOSE.stats;

    const payload = {
      id: 'global',
      badge_text: body.badge_text !== undefined ? String(body.badge_text).trim() : DEFAULT_WHY_CHOOSE.badge_text,
      title: body.title ? String(body.title).trim() : DEFAULT_WHY_CHOOSE.title,
      subtitle: body.subtitle !== undefined ? String(body.subtitle).trim() : DEFAULT_WHY_CHOOSE.subtitle,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      stats: cleanStats,
      updated_at: new Date().toISOString()
    };

    // Always keep local store synced as backup
    writeLocalStore(payload);

    // Clear RAM cache immediately
    appCache.del(CACHE_KEY);

    const { data, error } = await supabase
      .from('why_choose_section')
      .upsert([payload], { onConflict: 'id' })
      .select();

    if (error) {
      const tableMissing = error.code === 'PGRST205' || error.message?.includes('does not exist');
      if (tableMissing) {
        return res.status(200).json({
          success: true,
          source: 'local_fallback',
          tableNotReady: true,
          message: 'Saved locally! Run why_choose.sql in Supabase to sync with cloud DB.',
          data: normalizeData(payload)
        });
      }
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      source: 'database',
      tableNotReady: false,
      message: 'Why Choose TrekToShikhar section updated live!',
      data: normalizeData(data?.[0] || payload)
    });
  } catch (err) {
    console.error('Error updating why_choose_section:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update Why Choose section: ' + err.message
    });
  }
};

/**
 * POST /api/why-choose/reset
 * Resets global Why Choose section back to default 5 TrekToShikhar stats
 */
export const resetWhyChooseSection = async (req, res) => {
  try {
    const payload = {
      ...DEFAULT_WHY_CHOOSE,
      updated_at: new Date().toISOString()
    };

    writeLocalStore(payload);
    appCache.del(CACHE_KEY);

    const { data, error } = await supabase
      .from('why_choose_section')
      .upsert([payload], { onConflict: 'id' })
      .select();

    if (error && error.code !== 'PGRST205') {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Reset to default TrekToShikhar milestones!',
      data: normalizeData(data?.[0] || payload)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to reset section: ' + err.message
    });
  }
};
