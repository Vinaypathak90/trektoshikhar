import { supabase } from '../config/supabase.js';
import { appCache } from '../utils/cache.js';

// Default fallback slides if database table is empty or being initialized
const DEFAULT_FALLBACK_SLIDES = [
  {
    id: '1',
    title: 'Kedarkantha Summit Ridge',
    location: 'Uttarakhand (12,500 ft)',
    highlight: 'Winter Snow Expedition',
    next_batch: '22 Nov • 4 slots left',
    headline_line1: 'WALK THE UNTOUCHED TRAILS',
    cursive_text: 'reach your shikhar',
    subtitle: 'Curated mountain expeditions with certified Himalayan leaders across Shimla, Dehradun, and the high peaks. Small batches, verified alpine gear, zero compromises on safety.',
    image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=80',
    button_primary_text: 'Explore Upcoming Treks',
    button_primary_link: '/track',
    button_secondary_text: 'Why Trek With Us',
    button_secondary_link: '/about',
    display_order: 1,
    is_active: true
  },
  {
    id: '2',
    title: 'Nag Tibba Alpine Crest',
    location: 'Dehradun / Pantwari (9,915 ft)',
    highlight: 'Best Weekend Trek',
    next_batch: 'Every Friday Departure',
    headline_line1: 'EXPERIENCE THE RIDGE WALK',
    cursive_text: 'serenity above clouds',
    subtitle: 'Fast weekend summit escape from Delhi & Dehradun with certified NIM mountain guides. High-altitude camp overlooking snow ranges.',
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
    button_primary_text: 'Explore Upcoming Treks',
    button_primary_link: '/track',
    button_secondary_text: 'Why Trek With Us',
    button_secondary_link: '/about',
    display_order: 2,
    is_active: true
  },
  {
    id: '3',
    title: 'Hatu Peak Snow Walk',
    location: 'Narkanda / Shimla (11,150 ft)',
    highlight: '360° Himalayan Panorama',
    next_batch: 'Weekend Escapes Open',
    headline_line1: 'SHIMLA ALPINE ESCAPE',
    cursive_text: 'wander amidst pines',
    subtitle: 'Dense oak forests and ancient pine trails leading to panoramic Greater Himalayan vistas across Shrikhand Mahadev range.',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    button_primary_text: 'Explore Upcoming Treks',
    button_primary_link: '/track',
    button_secondary_text: 'Why Trek With Us',
    button_secondary_link: '/about',
    display_order: 3,
    is_active: true
  },
  {
    id: '4',
    title: 'Churdhar Sanctuary Summit',
    location: 'Himachal Shivalik (11,965 ft)',
    highlight: 'High Altitude Wilderness',
    next_batch: 'Registration Live',
    headline_line1: 'HIGHEST SHIVALIK PEAK',
    cursive_text: 'untouched solitude',
    subtitle: 'Walk through glacial boulder fields and sacred deodar valleys in Himachal Pradesh with certified wilderness first responders.',
    image_url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1920&q=80',
    button_primary_text: 'Explore Upcoming Treks',
    button_primary_link: '/track',
    button_secondary_text: 'Why Trek With Us',
    button_secondary_link: '/about',
    display_order: 4,
    is_active: true
  }
];

/**
 * GET /api/hero-slides
 * Retrieves hero slides ordered by display_order
 */
export const getAllHeroSlides = async (req, res) => {
  try {
    const { admin } = req.query;

    const cacheKey = `hero_slides_${admin === 'true'}`;
    const cachedData = appCache.get(cacheKey);
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cachedData);
    }

    let query = supabase
      .from('hero_slides')
      .select('*')
      .order('display_order', { ascending: true });

    // Non-admin public calls only receive active slides
    if (admin !== 'true') {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('⚠️ Supabase hero_slides query note:', error.message);
      // Return fallback slides if table isn't created yet in database
      const fallback = admin === 'true' 
        ? DEFAULT_FALLBACK_SLIDES 
        : DEFAULT_FALLBACK_SLIDES.filter(s => s.is_active);

      return res.status(200).json({
        success: true,
        source: 'fallback',
        count: fallback.length,
        data: fallback
      });
    }

    // If table exists but has no records, provide seed fallback
    if (!data || data.length === 0) {
      return res.status(200).json({
        success: true,
        source: 'empty_fallback',
        count: DEFAULT_FALLBACK_SLIDES.length,
        data: DEFAULT_FALLBACK_SLIDES
      });
    }

    const responsePayload = {
      success: true,
      source: 'database',
      count: data.length,
      data
    };

    appCache.set(cacheKey, responsePayload, 600);
    res.setHeader('X-Cache', 'MISS');

    res.status(200).json(responsePayload);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve hero slides',
      details: err.message
    });
  }
};

/**
 * GET /api/hero-slides/:id
 * Retrieves a single slide by ID
 */
export const getHeroSlideById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      const match = DEFAULT_FALLBACK_SLIDES.find(s => s.id === id);
      if (match) {
        return res.status(200).json({ success: true, data: match });
      }
      return res.status(404).json({ success: false, error: 'Slide not found' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * POST /api/hero-slides
 * Create a new hero slide (Cloudinary image_url required)
 */
export const createHeroSlide = async (req, res) => {
  try {
    const {
      title,
      location,
      highlight,
      next_batch,
      headline_line1,
      cursive_text,
      subtitle,
      image_url,
      button_primary_text,
      button_primary_link,
      button_secondary_text,
      button_secondary_link,
      display_order,
      is_active
    } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({
        success: false,
        error: 'Slide title and Cloudinary image_url are required.'
      });
    }

    const payload = {
      title: title.trim(),
      location: location || 'Himalayas',
      highlight: highlight || 'Featured Expedition',
      next_batch: next_batch || 'Upcoming Departure',
      headline_line1: headline_line1 || 'WALK THE UNTOUCHED TRAILS',
      cursive_text: cursive_text || 'reach your shikhar',
      subtitle: subtitle || 'Curated mountain expeditions with certified Himalayan leaders.',
      image_url: image_url.trim(),
      button_primary_text: button_primary_text || 'Explore Upcoming Treks',
      button_primary_link: button_primary_link || '/track',
      button_secondary_text: button_secondary_text || 'Why Trek With Us',
      button_secondary_link: button_secondary_link || '/about',
      display_order: Number(display_order) || 99,
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('hero_slides')
      .insert([payload])
      .select();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    appCache.clearPrefix('hero_slides_');

    res.status(201).json({
      success: true,
      message: 'Hero slide created successfully!',
      data: data[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * PUT /api/hero-slides/:id
 * Update an existing hero slide
 */
export const updateHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('hero_slides')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    appCache.clearPrefix('hero_slides_');

    res.status(200).json({
      success: true,
      message: 'Hero slide updated successfully!',
      data: data?.[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * DELETE /api/hero-slides/:id
 * Delete a slide by ID
 */
export const deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    appCache.clearPrefix('hero_slides_');

    res.status(200).json({
      success: true,
      message: `Slide #${id} deleted successfully.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * PUT /api/hero-slides/reorder
 * Batch update display_order for slides
 */
export const reorderHeroSlides = async (req, res) => {
  try {
    const { orderedIds } = req.body; // Array of IDs in new order: ['id-1', 'id-2', ...]

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, error: 'orderedIds array required' });
    }

    const updates = orderedIds.map((id, index) => 
      supabase
        .from('hero_slides')
        .update({ display_order: index + 1, updated_at: new Date().toISOString() })
        .eq('id', id)
    );

    await Promise.all(updates);

    appCache.clearPrefix('hero_slides_');

    res.status(200).json({
      success: true,
      message: 'Slides reordered successfully!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
