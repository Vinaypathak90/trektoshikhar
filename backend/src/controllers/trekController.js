import { supabase } from '../config/supabase.js';
import { appCache } from '../utils/cache.js';

// Helper to normalize and provide both snake_case and camelCase for seamless frontend usage
const formatTrek = (row) => {
  if (!row) return null;

  const heroImages = Array.isArray(row.hero_images)
    ? row.hero_images
    : (typeof row.hero_images === 'string' ? JSON.parse(row.hero_images || '[]') : []);

  const whyMustDo = Array.isArray(row.why_must_do)
    ? row.why_must_do
    : (typeof row.why_must_do === 'string' ? JSON.parse(row.why_must_do || '[]') : []);

  const itinerary = Array.isArray(row.itinerary)
    ? row.itinerary
    : (typeof row.itinerary === 'string' ? JSON.parse(row.itinerary || '[]') : []);

  const packages = Array.isArray(row.packages)
    ? row.packages
    : (typeof row.packages === 'string' ? JSON.parse(row.packages || '[]') : []);

  const inclusions = Array.isArray(row.inclusions)
    ? row.inclusions
    : (typeof row.inclusions === 'string' ? JSON.parse(row.inclusions || '[]') : []);

  const exclusions = Array.isArray(row.exclusions)
    ? row.exclusions
    : (typeof row.exclusions === 'string' ? JSON.parse(row.exclusions || '[]') : []);

  const gearList = Array.isArray(row.gear_list)
    ? row.gear_list
    : (typeof row.gear_list === 'string' ? JSON.parse(row.gear_list || '[]') : []);

  const defaultThumb = heroImages[0] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline || '',
    heroTagline: row.tagline || '',
    region: row.region || 'dehradun',
    location: row.location || '',
    base_camp: row.base_camp || '',
    baseCamp: row.base_camp || '',
    route: row.route || 'Base to Base',
    duration: row.duration || '2 Days / 1 Night',
    altitude: row.altitude || '',
    difficulty: row.difficulty || 'Easy',
    grade: row.grade || 'Beginner Friendly',
    distance: row.distance || '',
    best_season: row.best_season || 'Oct - May',
    bestSeason: row.best_season || 'Oct - May',
    price: Number(row.price) || 0,
    original_price: row.original_price ? Number(row.original_price) : null,
    originalPrice: row.original_price ? Number(row.original_price) : null,
    tag: row.tag || 'Best for Beginners',
    rating: Number(row.rating) || 4.9,
    reviews_count: row.reviews_count || 120,
    reviewsCount: row.reviews_count || 120,
    hero_images: heroImages,
    heroImages: heroImages,
    image: defaultThumb,
    overview: row.overview || '',
    why_must_do: whyMustDo,
    whyMustDo: whyMustDo,
    itinerary: itinerary,
    packages: packages,
    inclusions: inclusions,
    exclusions: exclusions,
    gear_list: gearList,
    gearList: gearList,
    display_order: row.display_order ?? 1,
    displayOrder: row.display_order ?? 1,
    is_featured: row.is_featured ?? true,
    isFeatured: row.is_featured ?? true,
    is_active: row.is_active ?? true,
    isActive: row.is_active ?? true,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

// GET /api/treks - Fetch all treks with dynamic filters, sorting, and search
export const getAllTreks = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const regionParam = req.query.region;
    const difficultyParam = req.query.difficulty;
    const searchParam = req.query.search;
    const sortParam = req.query.sort || 'recommended';

    const cacheKey = `treks_${isAdmin}_${regionParam || 'all'}_${difficultyParam || 'all'}_${searchParam || ''}_${sortParam}`;
    const cachedData = appCache.get(cacheKey);
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cachedData);
    }

    let query = supabase.from('treks').select('*');

    if (!isAdmin) {
      query = query.eq('is_active', true);
    }

    if (regionParam && regionParam !== 'all') {
      query = query.eq('region', regionParam.toLowerCase().trim());
    }

    if (difficultyParam && difficultyParam !== 'all') {
      query = query.ilike('difficulty', `%${difficultyParam.trim()}%`);
    }

    if (searchParam && searchParam.trim()) {
      const term = searchParam.trim();
      query = query.or(`title.ilike.%${term}%,location.ilike.%${term}%,base_camp.ilike.%${term}%,altitude.ilike.%${term}%`);
    }

    // Sort order
    if (sortParam === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sortParam === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('display_order', { ascending: true }).order('created_at', { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      // If table does not exist yet in user's Supabase instance
      console.warn('⚠️ Supabase treks query error:', error.message);
      return res.status(200).json({
        success: false,
        error: error.message,
        tableNotReady: error.code === 'PGRST205',
        data: []
      });
    }

    const formattedTreks = (data || []).map(formatTrek);

    // Altitude sorting helper if requested
    if (sortParam === 'altitude-desc') {
      formattedTreks.sort((a, b) => {
        const altA = parseInt(String(a.altitude).replace(/\D/g, ''), 10) || 0;
        const altB = parseInt(String(b.altitude).replace(/\D/g, ''), 10) || 0;
        return altB - altA;
      });
    }

    // Calculate dynamic available filter options from the current database records
    const distinctRegions = Array.from(new Set(formattedTreks.map(t => t.region).filter(Boolean)));
    const dynamicRegionTabs = [
      { id: 'all', label: `All Treks` },
      ...distinctRegions.map(reg => ({
        id: reg,
        label: reg === 'dehradun' ? 'Dehradun Base' : reg === 'shimla' ? 'Shimla Base' : `${reg.charAt(0).toUpperCase() + reg.slice(1)} Base`
      }))
    ];

    const distinctDifficulties = Array.from(new Set(formattedTreks.map(t => t.difficulty).filter(Boolean)));

    const responsePayload = {
      success: true,
      data: formattedTreks,
      availableRegions: dynamicRegionTabs,
      availableDifficulties: distinctDifficulties,
      total: formattedTreks.length
    };

    // Cache in RAM for 10 minutes (600s)
    appCache.set(cacheKey, responsePayload, 600);
    res.setHeader('X-Cache', 'MISS');

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Error fetching treks:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch treks: ' + error.message,
      data: []
    });
  }
};

// GET /api/treks/:slug - Get single trek by slug or id
export const getTrekBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const cacheKey = `trek_single_${slug}`;
    const cachedTrek = appCache.get(cacheKey);
    if (cachedTrek) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cachedTrek);
    }

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    let query = supabase.from('treks').select('*');

    if (isUUID) {
      query = query.or(`id.eq.${slug},slug.eq.${slug}`).limit(1);
    } else {
      query = query.eq('slug', slug).limit(1);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Trek with slug/id '${slug}' not found`
      });
    }

    const responsePayload = {
      success: true,
      data: formatTrek(data[0])
    };

    appCache.set(cacheKey, responsePayload, 600);
    res.setHeader('X-Cache', 'MISS');

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Error fetching trek:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch trek details: ' + error.message
    });
  }
};

// POST /api/treks - Create a new trek
export const createTrek = async (req, res) => {
  try {
    const body = req.body;

    const slug = (body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
      .trim();

    const trekPayload = {
      slug,
      title: body.title,
      tagline: body.tagline || body.heroTagline || '',
      region: (body.region || 'dehradun').toLowerCase(),
      location: body.location || '',
      base_camp: body.base_camp || body.baseCamp || '',
      route: body.route || 'Base to Base',
      duration: body.duration || '2 Days / 1 Night',
      altitude: body.altitude || '',
      difficulty: body.difficulty || 'Easy',
      grade: body.grade || 'Beginner Friendly',
      distance: body.distance || '',
      best_season: body.best_season || body.bestSeason || 'Oct - May',
      price: Number(body.price) || 0,
      original_price: body.original_price || body.originalPrice ? Number(body.original_price || body.originalPrice) : null,
      tag: body.tag || 'Best for Beginners',
      rating: Number(body.rating) || 4.9,
      reviews_count: Number(body.reviews_count || body.reviewsCount) || 120,
      hero_images: body.hero_images || body.heroImages || (body.image ? [body.image] : []),
      overview: body.overview || '',
      why_must_do: body.why_must_do || body.whyMustDo || [],
      itinerary: body.itinerary || [],
      packages: body.packages || [],
      inclusions: body.inclusions || [],
      exclusions: body.exclusions || [],
      gear_list: body.gear_list || body.gearList || [],
      display_order: Number(body.display_order ?? body.displayOrder ?? 1),
      is_featured: body.is_featured ?? body.isFeatured ?? true,
      is_active: body.is_active ?? body.isActive ?? true,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('treks')
      .insert([trekPayload])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    appCache.clearPrefix('treks_');
    appCache.clearPrefix('trek_single_');

    return res.status(201).json({
      success: true,
      data: formatTrek(data[0])
    });
  } catch (error) {
    console.error('Error creating trek:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create trek: ' + error.message
    });
  }
};

// PUT /api/treks/:id - Update an existing trek (accepts UUID, slug, or numeric fallback ID)
export const updateTrek = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const updatePayload = {
      updated_at: new Date().toISOString()
    };

    if (body.title !== undefined) updatePayload.title = body.title;
    if (body.slug !== undefined) updatePayload.slug = body.slug;
    if (body.tagline !== undefined || body.heroTagline !== undefined) updatePayload.tagline = body.tagline || body.heroTagline;
    if (body.region !== undefined) updatePayload.region = body.region.toLowerCase();
    if (body.location !== undefined) updatePayload.location = body.location;
    if (body.base_camp !== undefined || body.baseCamp !== undefined) updatePayload.base_camp = body.base_camp || body.baseCamp;
    if (body.route !== undefined) updatePayload.route = body.route;
    if (body.duration !== undefined) updatePayload.duration = body.duration;
    if (body.altitude !== undefined) updatePayload.altitude = body.altitude;
    if (body.difficulty !== undefined) updatePayload.difficulty = body.difficulty;
    if (body.grade !== undefined) updatePayload.grade = body.grade;
    if (body.distance !== undefined) updatePayload.distance = body.distance;
    if (body.best_season !== undefined || body.bestSeason !== undefined) updatePayload.best_season = body.best_season || body.bestSeason;
    if (body.price !== undefined) updatePayload.price = Number(body.price);
    if (body.original_price !== undefined || body.originalPrice !== undefined) updatePayload.original_price = body.original_price ? Number(body.original_price) : body.originalPrice ? Number(body.originalPrice) : null;
    if (body.tag !== undefined) updatePayload.tag = body.tag;
    if (body.rating !== undefined) updatePayload.rating = Number(body.rating);
    if (body.reviews_count !== undefined || body.reviewsCount !== undefined) updatePayload.reviews_count = Number(body.reviews_count || body.reviewsCount);
    if (body.hero_images !== undefined || body.heroImages !== undefined) updatePayload.hero_images = body.hero_images || body.heroImages;
    if (body.overview !== undefined) updatePayload.overview = body.overview;
    if (body.why_must_do !== undefined || body.whyMustDo !== undefined) updatePayload.why_must_do = body.why_must_do || body.whyMustDo;
    if (body.itinerary !== undefined) updatePayload.itinerary = body.itinerary;
    if (body.packages !== undefined) updatePayload.packages = body.packages;
    if (body.inclusions !== undefined) updatePayload.inclusions = body.inclusions;
    if (body.exclusions !== undefined) updatePayload.exclusions = body.exclusions;
    if (body.gear_list !== undefined || body.gearList !== undefined) updatePayload.gear_list = body.gear_list || body.gearList;
    if (body.display_order !== undefined || body.displayOrder !== undefined) updatePayload.display_order = Number(body.display_order ?? body.displayOrder);
    if (body.is_featured !== undefined || body.isFeatured !== undefined) updatePayload.is_featured = body.is_featured ?? body.isFeatured;
    if (body.is_active !== undefined || body.isActive !== undefined) updatePayload.is_active = body.is_active ?? body.isActive;

    // Find the target record in Supabase:
    // 1. By UUID if provided
    // 2. By slug (either route param or body.slug)
    let targetId = null;
    if (isUUID) {
      targetId = id;
    } else {
      const matchSlug = body.slug || id;
      const { data: existing } = await supabase
        .from('treks')
        .select('id')
        .or(`slug.eq.${id},slug.eq.${matchSlug}`)
        .limit(1);

      if (existing && existing.length > 0) {
        targetId = existing[0].id;
      }
    }

    if (targetId) {
      const { data, error } = await supabase
        .from('treks')
        .update(updatePayload)
        .eq('id', targetId)
        .select();

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      if (data && data.length > 0) {
        appCache.clearPrefix('treks_');
        appCache.clearPrefix('trek_single_');
        return res.status(200).json({
          success: true,
          data: formatTrek(data[0])
        });
      }
    }

    // If not found, gracefully create the trek so changes are never lost!
    const insertPayload = {
      ...updatePayload,
      slug: (body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : `trek-${Date.now().toString(36)}`)).trim(),
      title: body.title || 'New Mountain Trek',
      region: (body.region || 'dehradun').toLowerCase(),
      location: body.location || '',
      base_camp: body.base_camp || body.baseCamp || '',
      duration: body.duration || '2 Days / 1 Night',
      altitude: body.altitude || '',
      difficulty: body.difficulty || 'Easy',
      price: Number(body.price) || 2499
    };

    const { data: inserted, error: insertErr } = await supabase
      .from('treks')
      .insert([insertPayload])
      .select();

    if (insertErr) {
      return res.status(400).json({
        success: false,
        error: insertErr.message
      });
    }

    appCache.clearPrefix('treks_');
    appCache.clearPrefix('trek_single_');

    return res.status(200).json({
      success: true,
      data: formatTrek(inserted[0])
    });
  } catch (error) {
    console.error('Error updating trek:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update trek: ' + error.message
    });
  }
};

// DELETE /api/treks/:id - Delete a trek
export const deleteTrek = async (req, res) => {
  try {
    const { id } = req.params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabase.from('treks').delete();
    if (isUUID) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    appCache.clearPrefix('treks_');
    appCache.clearPrefix('trek_single_');

    return res.status(200).json({
      success: true,
      message: 'Trek deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting trek:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete trek: ' + error.message
    });
  }
};

// PUT /api/treks/reorder - Reorder treks
export const reorderTreks = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, error: 'orderedIds must be an array' });
    }

    const updates = orderedIds.map((id, index) =>
      supabase.from('treks').update({ display_order: index + 1 }).eq('id', id)
    );

    await Promise.all(updates);

    appCache.clearPrefix('treks_');
    appCache.clearPrefix('trek_single_');

    return res.status(200).json({
      success: true,
      message: 'Treks reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering treks:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to reorder treks: ' + error.message
    });
  }
};
