import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { appCache } from '../utils/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_PATH = path.resolve(__dirname, '../data/about_us_store.json');

const CACHE_PREFIX = 'about_us_';

export const DEFAULT_ABOUT_SETTINGS = {
  id: 'global',
  hero_badge: 'About Trek To Shikhar',
  hero_title_line1: '“Not just a journey,',
  hero_title_cursive: 'but a bond that stays forever.”',
  hero_intro_para1:
    "At Trek to Shikhar, we believe that travelling is not just about reaching places, it's about the people we meet, the bonds we create, and the memories we carry forever.",
  hero_intro_para2:
    "For us, you're never just a customer. You're family. We take care of every little detail, value your comfort, and make sure you feel safe, welcomed and at home throughout your journey. Because the best journeys aren't just about where you go, but how you feel along the way.",
  hero_pledge_text: 'Once a Shikharite, Always a Shikharite.',
  hero_pledge_hover_text: 'Meet Your Mountain Family',
  use_global_hero_slides: true,
  custom_hero_slides: [],

  story_badge: 'Our Story',
  story_heading: 'From Local Mountain Trails to a Family Called',
  story_highlight_word: 'Shikharites',
  story_subtitle:
    'Every mountain range teaches humility, patience, and kinship. Here is how Trek to Shikhar grew from a handful of passionate Pahadi mountaineers into one of the most loved Himalayan trekking families.',
  story_image_url:
    'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=85',
  story_caption_tag: 'Shimla & Dehradun Mountain Hubs',
  story_caption_title: 'Small Batches • Big Hearts • Unhurried Summits',
  story_batch_title: '12–15 Max',
  story_batch_subtitle: 'Intimate Family Batches',
  story_chapters: [
    {
      year: 'Chapter 01',
      tag: 'THE SPARK',
      title: 'Born From a Simple Promise in the Foothills',
      desc: 'Trek to Shikhar started out of Shimla and Dehradun when a tight-knit circle of mountain friends noticed something heartbreaking: trekking had become an assembly line of 45-person crowds where people were treated like ticket numbers. We promised to bring back the soul of the Himalayas.'
    },
    {
      year: 'Chapter 02',
      tag: 'THE FAMILY ETHOS',
      title: 'Care in Every Detail, Warmth on Every Ridge',
      desc: 'From checking if your shoelaces are tied tight before a snow ascent, to serving extra hot ginger tea after a chilly ridge walk, we built our reputation on small, thoughtful gestures. When you feel safe and genuinely cared for, the mountains open up in a whole new way.'
    },
    {
      year: 'Chapter 03',
      tag: 'THE SHIKHARITE BOND',
      title: 'A Lifelong Tribe of Mountain Lovers',
      desc: 'What begins as strangers meeting at Dehradun station or Shimla ridge ends as lifelong friends sharing stories years later. That unbreakable bond is why our community lives by one motto: Once a Shikharite, Always a Shikharite.'
    }
  ],

  team_badge: 'The Hearts Behind Every Summit',
  team_heading: 'Meet The Team',
  team_subtitle:
    "Certified mountaineers, wilderness first responders, and warm local hosts who treat every trail like home. Click any team member's photo to know their story.",

  pillars_badge: 'The Shikharite Advantage',
  pillars_heading_prefix: 'Why You Should Choose',
  pillars_heading_brand: 'TrekToShikhar',
  pillars_heading_suffix: 'For Your Next Shikhar Adventure?',
  pillars_subtitle:
    'Because reaching a summit is only half the story — how safe, inspired, and cared for you feel along every kilometer is what truly matters.',
  pillars: [
    {
      num: '01',
      icon: 'HeartHandshake',
      title: 'You Are Family, Never Just a Booking ID',
      desc: 'We strictly cap groups at 12–15 trekkers so our leaders know your name, your pace, your comfort, and your story from pickup to summit celebration.',
      footer_tag: 'TrekToShikhar Promise'
    },
    {
      num: '02',
      icon: 'Award',
      title: 'NIM & ABVIMAS Certified Local Leaders',
      desc: 'Every expedition is led by government-certified mountaineers born and raised in the Himalayas — combining deep local wisdom with technical alpine mastery.',
      footer_tag: 'TrekToShikhar Promise'
    },
    {
      num: '03',
      icon: 'Activity',
      title: 'Medical-Grade Altitude Safety Protocol',
      desc: 'Twice-daily SpO2 pulse oximeter checks, portable high-altitude oxygen cylinders, WFR-trained leaders, and zero-rush acclimatization schedules.',
      footer_tag: 'TrekToShikhar Promise'
    },
    {
      num: '04',
      icon: 'Tent',
      title: '4-Season Expedition Gear & Hygienic Camps',
      desc: 'Rest comfortably in sub-zero temperatures with -10°C thermal sleeping bags, freshly sanitized liners, insulated mats, and waterproof 4-season dome tents.',
      footer_tag: 'TrekToShikhar Promise'
    },
    {
      num: '05',
      icon: 'Utensils',
      title: 'Fresh, Wholesome Home-Style Mountain Meals',
      desc: 'Piping-hot vegetarian meals cooked fresh at camp — evening mountain soup, ginger-lemon tea, nutritious trail snacks, and warm hospitality at every altitude.',
      footer_tag: 'TrekToShikhar Promise'
    },
    {
      num: '06',
      icon: 'Sprout',
      title: 'Zero-Plastic Trails & Heal Himalaya Mission',
      desc: 'Every trek supports local Pahadi villages and follows strict Leave No Trace principles with dedicated cleanup drives to preserve our sacred peaks.',
      footer_tag: 'TrekToShikhar Promise'
    }
  ],

  cta_badge: 'Once a Shikharite, Always a Shikharite',
  cta_heading: 'Ready For Your Next Himalayan Story?',
  cta_subtitle:
    'Join an upcoming small-batch departure out of Shimla or Dehradun — walk with certified leaders, sleep under alpine skies, and come home with a family for life.',
  cta_primary_text: 'Explore Upcoming Treks',
  cta_primary_hover_text: "Let's Climb Your Next Peak",
  cta_secondary_text: 'Talk to Our Team',
  cta_secondary_hover_text: 'Chat With Mountain Family'
};

export const DEFAULT_TEAM_MEMBERS = [
  {
    id: 'team-1',
    name: 'Vinay Pathak',
    role: 'Founder & Lead Expedition Director',
    base: 'Dehradun & Shimla Base',
    experience: '10+ Years in Himalayas',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85',
    short_tag: 'NIM Certified • 180+ Summits',
    quote: 'A summit lasts ten minutes, but the warmth of the people you climb with stays for a lifetime.',
    bio: 'Born with an unstoppable love for the Garhwal and Himachal ridges, Vinay founded Trek to Shikhar to break away from robotic, crowded commercial tours. He personally oversees trail safety standards, small-batch curation, and our signature "You are Family" ethos on every departure.',
    certifications: [
      'NIM Uttarkashi Basic & Advance Mountaineering',
      'Wilderness First Responder (WFR)',
      '180+ Successful Himalayan Expeditions'
    ],
    favorite_trek: 'Kedarkantha Winter Summit & Kuari Pass',
    specialty: 'High-Altitude Route Planning & Community Leadership',
    display_order: 1,
    is_active: true
  },
  {
    id: 'team-2',
    name: 'Raghav Chauhan',
    role: 'Co-Founder & Chief Mountain Guide',
    base: 'Shimla Base Camp',
    experience: '9+ Years in Himalayas',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85',
    short_tag: 'ABVIMAS Manali • Snow Specialist',
    quote: 'In the mountains, nobody walks alone. We climb at the pace of togetherness, never haste.',
    bio: 'Raised in the cedar valleys of Himachal Pradesh, Raghav knows every ridge, wind shift, and hidden spring from Hatu Peak to Churdhar Sanctuary. Known among Shikharites for his calm voice during steep snow pushes and endless mountain folklore around the evening campfire.',
    certifications: [
      'ABVIMAS Manali Mountaineering Graduate',
      'Alpine Snow & Ice Rescue Certified',
      'Search & Rescue Volunteer — Himachal'
    ],
    favorite_trek: 'Churdhar Sanctuary & Shrikhand Mahadev',
    specialty: 'Winter Snow Navigation & Beginner Confidence Coaching',
    display_order: 2,
    is_active: true
  },
  {
    id: 'team-3',
    name: 'Ananya Rawat',
    role: 'Head of Trekker Care & Safety Lead',
    base: 'Dehradun Base Camp',
    experience: '7+ Years in Himalayas',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85',
    short_tag: 'WFR Certified • Solo Female Mentor',
    quote: 'Comfort, safety, and feeling truly heard — that is what turns a nervous first-timer into a lifelong Shikharite.',
    bio: 'Ananya leads our medical-grade altitude protocols and solo-traveler hospitality wing. From pre-trek fitness check-ins to twice-daily SpO2 monitoring at sub-zero camps, she ensures every trekker — especially solo female explorers — feels completely safe, welcomed, and right at home.',
    certifications: [
      'Certified Wilderness First Responder (WFR)',
      'High-Altitude Acclimatization Specialist',
      'Solo Women Expedition Safety Lead'
    ],
    favorite_trek: 'Brahmatal Frozen Lake & Har Ki Dun',
    specialty: 'Altitude Health Monitoring & Personalized Trekker Care',
    display_order: 3,
    is_active: true
  },
  {
    id: 'team-4',
    name: 'Devendra Negi',
    role: 'Base Camp Operations & Eco-Trail Chief',
    base: 'Garhwal & Sankri Hub',
    experience: '12+ Years in Himalayas',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85',
    short_tag: 'Camp Architecture • Heal Himalaya Lead',
    quote: 'We leave nothing behind on the mountains except gratitude and footprints that fade with the snow.',
    bio: 'The quiet heartbeat behind every spotless 4-season tent and piping-hot mountain meal at 11,000 ft. Devendra coordinates local village partnerships, sustainable mule logistics, and leads Trek to Shikhar’s Heal Himalaya cleanup drives across Uttarakhand and Himachal.',
    certifications: [
      'Leave No Trace (LNT) Master Educator',
      'High-Altitude Camp & Gear Quartermaster',
      '1,200+ Trail Cleanup Drives Coordinated'
    ],
    favorite_trek: 'Nag Tibba & Tungnath Chandrashila',
    specialty: 'Alpine Camp Hospitality & Zero-Plastic Trail Conservation',
    display_order: 4,
    is_active: true
  }
];

const isTableMissing = (error) =>
  Boolean(
    error &&
      (error.code === 'PGRST205' ||
        error.message?.includes('does not exist') ||
        error.message?.includes('schema cache'))
  );

const parseJsonArray = (val, fallback = []) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const formatSettings = (row) => {
  const src = row || {};
  return {
    ...DEFAULT_ABOUT_SETTINGS,
    ...src,
    id: 'global',
    use_global_hero_slides:
      src.use_global_hero_slides !== undefined ? Boolean(src.use_global_hero_slides) : true,
    custom_hero_slides: parseJsonArray(src.custom_hero_slides, []),
    story_chapters: parseJsonArray(src.story_chapters, DEFAULT_ABOUT_SETTINGS.story_chapters),
    pillars: parseJsonArray(src.pillars, DEFAULT_ABOUT_SETTINGS.pillars),
    updated_at: src.updated_at || new Date().toISOString()
  };
};

const formatTeamMember = (row, idx = 0) => {
  const certs = parseJsonArray(row.certifications, []);
  return {
    id: row.id || `team-${idx + 1}`,
    name: row.name || 'Team Shikharite',
    role: row.role || 'Mountain Guide',
    base: row.base || 'Shimla & Dehradun Base',
    experience: row.experience || '5+ Years in Himalayas',
    photo:
      row.photo ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85',
    short_tag: row.short_tag || row.shortTag || 'Certified Mountain Leader',
    shortTag: row.short_tag || row.shortTag || 'Certified Mountain Leader',
    quote: row.quote || '',
    bio: row.bio || '',
    certifications: certs,
    favorite_trek: row.favorite_trek || row.favoriteTrek || 'Kedarkantha Summit',
    favoriteTrek: row.favorite_trek || row.favoriteTrek || 'Kedarkantha Summit',
    specialty: row.specialty || 'High-Altitude Trekking & Safety',
    display_order: Number(row.display_order ?? row.displayOrder ?? idx + 1),
    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
    isActive: row.is_active !== undefined ? Boolean(row.is_active) : true,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

const readLocalStore = () => {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'));
      if (parsed && parsed.settings && Array.isArray(parsed.team)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not read local about_us store:', err.message);
  }
  return {
    settings: { ...DEFAULT_ABOUT_SETTINGS },
    team: DEFAULT_TEAM_MEMBERS.map((m) => ({ ...m }))
  };
};

const writeLocalStore = (store) => {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ Could not write local about_us store:', err.message);
  }
};

/**
 * GET /api/about-us
 * Fetches About Us page settings + Meet The Team profiles
 */
export const getAboutUsData = async (req, res) => {
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

    const [settingsRes, teamRes] = await Promise.all([
      supabase.from('about_us_settings').select('*').eq('id', 'global').limit(1),
      isAdmin
        ? supabase
            .from('team_members')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true })
        : supabase
            .from('team_members')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true })
    ]);

    if (isTableMissing(settingsRes.error) || isTableMissing(teamRes.error)) {
      const local = readLocalStore();
      const sorted = [...local.team].sort(
        (a, b) => (a.display_order || 0) - (b.display_order || 0)
      );
      const filtered = isAdmin ? sorted : sorted.filter((m) => m.is_active !== false);
      const payload = {
        success: true,
        source: 'local_fallback',
        tableNotReady: true,
        settings: formatSettings(local.settings),
        team: filtered.map(formatTeamMember)
      };
      if (!isAdmin) appCache.set(cacheKey, payload, 300);
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(payload);
    }

    if (settingsRes.error || teamRes.error) {
      const local = readLocalStore();
      const filtered = isAdmin
        ? local.team
        : local.team.filter((m) => m.is_active !== false);
      return res.status(200).json({
        success: true,
        source: 'fallback',
        tableNotReady: false,
        settings: formatSettings(local.settings),
        team: filtered.map(formatTeamMember)
      });
    }

    const settings = formatSettings(settingsRes.data?.[0] || DEFAULT_ABOUT_SETTINGS);
    const team = (teamRes.data || []).map(formatTeamMember);

    const payload = {
      success: true,
      source: 'database',
      tableNotReady: false,
      settings,
      team
    };

    if (!isAdmin) appCache.set(cacheKey, payload, 600);
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (err) {
    console.error('Error fetching About Us data:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch About Us data: ' + err.message
    });
  }
};

/**
 * PUT /api/about-us/settings
 * Updates Hero Intro, Our Story, Chapters, Pillars, and Bottom CTA
 */
export const updateAboutUsSettings = async (req, res) => {
  try {
    const body = req.body || {};
    const current = readLocalStore();

    const payload = {
      ...DEFAULT_ABOUT_SETTINGS,
      ...current.settings,
      ...body,
      id: 'global',
      use_global_hero_slides:
        body.use_global_hero_slides !== undefined
          ? Boolean(body.use_global_hero_slides)
          : current.settings.use_global_hero_slides ?? true,
      custom_hero_slides: Array.isArray(body.custom_hero_slides)
        ? body.custom_hero_slides
        : current.settings.custom_hero_slides || [],
      story_chapters: Array.isArray(body.story_chapters)
        ? body.story_chapters
        : current.settings.story_chapters || DEFAULT_ABOUT_SETTINGS.story_chapters,
      pillars: Array.isArray(body.pillars)
        ? body.pillars
        : current.settings.pillars || DEFAULT_ABOUT_SETTINGS.pillars,
      updated_at: new Date().toISOString()
    };

    // Strip any extraneous keys not in DB schema
    const cleanDbPayload = {
      id: 'global',
      hero_badge: payload.hero_badge,
      hero_title_line1: payload.hero_title_line1,
      hero_title_cursive: payload.hero_title_cursive,
      hero_intro_para1: payload.hero_intro_para1,
      hero_intro_para2: payload.hero_intro_para2,
      hero_pledge_text: payload.hero_pledge_text,
      hero_pledge_hover_text: payload.hero_pledge_hover_text,
      use_global_hero_slides: payload.use_global_hero_slides,
      custom_hero_slides: payload.custom_hero_slides,
      story_badge: payload.story_badge,
      story_heading: payload.story_heading,
      story_highlight_word: payload.story_highlight_word,
      story_subtitle: payload.story_subtitle,
      story_image_url: payload.story_image_url,
      story_caption_tag: payload.story_caption_tag,
      story_caption_title: payload.story_caption_title,
      story_batch_title: payload.story_batch_title,
      story_batch_subtitle: payload.story_batch_subtitle,
      story_chapters: payload.story_chapters,
      team_badge: payload.team_badge,
      team_heading: payload.team_heading,
      team_subtitle: payload.team_subtitle,
      pillars_badge: payload.pillars_badge,
      pillars_heading_prefix: payload.pillars_heading_prefix,
      pillars_heading_brand: payload.pillars_heading_brand,
      pillars_heading_suffix: payload.pillars_heading_suffix,
      pillars_subtitle: payload.pillars_subtitle,
      pillars: payload.pillars,
      cta_badge: payload.cta_badge,
      cta_heading: payload.cta_heading,
      cta_subtitle: payload.cta_subtitle,
      cta_primary_text: payload.cta_primary_text,
      cta_primary_hover_text: payload.cta_primary_hover_text,
      cta_secondary_text: payload.cta_secondary_text,
      cta_secondary_hover_text: payload.cta_secondary_hover_text,
      updated_at: payload.updated_at
    };

    current.settings = cleanDbPayload;
    writeLocalStore(current);
    appCache.clearPrefix(CACHE_PREFIX);

    const { data, error } = await supabase
      .from('about_us_settings')
      .upsert([cleanDbPayload], { onConflict: 'id' })
      .select();

    if (isTableMissing(error)) {
      return res.status(200).json({
        success: true,
        source: 'local_fallback',
        tableNotReady: true,
        message: 'About Us content saved live! Run about_us.sql in Supabase for cloud sync.',
        data: formatSettings(cleanDbPayload)
      });
    }

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      source: 'database',
      tableNotReady: false,
      message: 'About Us page updated live!',
      data: formatSettings(data?.[0] || cleanDbPayload)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update About Us settings: ' + err.message
    });
  }
};

/**
 * POST /api/about-us/team
 * Create a new team member
 */
export const createTeamMember = async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.role) {
      return res.status(400).json({
        success: false,
        error: 'Team member name and role are required.'
      });
    }

    const local = readLocalStore();
    const certs = Array.isArray(body.certifications)
      ? body.certifications.filter(Boolean)
      : typeof body.certifications === 'string'
        ? body.certifications
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const dbPayload = {
      name: String(body.name).trim(),
      role: String(body.role).trim(),
      base: (body.base || 'Shimla & Dehradun Base').trim(),
      experience: (body.experience || '5+ Years in Himalayas').trim(),
      photo: (
        body.photo ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85'
      ).trim(),
      short_tag: (body.short_tag || body.shortTag || 'Certified Mountain Leader').trim(),
      quote: (body.quote || '').trim(),
      bio: (body.bio || '').trim(),
      certifications: certs,
      favorite_trek: (body.favorite_trek || body.favoriteTrek || 'Kedarkantha Summit').trim(),
      specialty: (body.specialty || 'High-Altitude Trekking & Safety').trim(),
      display_order:
        body.display_order !== undefined ? Number(body.display_order) : local.team.length + 1,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      updated_at: new Date().toISOString()
    };

    appCache.clearPrefix(CACHE_PREFIX);

    const { data, error } = await supabase
      .from('team_members')
      .insert([dbPayload])
      .select();

    if (isTableMissing(error)) {
      const localRec = {
        id: `team-${crypto.randomBytes(4).toString('hex')}`,
        ...dbPayload,
        created_at: new Date().toISOString()
      };
      local.team.push(localRec);
      writeLocalStore(local);
      return res.status(201).json({
        success: true,
        source: 'local_fallback',
        tableNotReady: true,
        message: 'Team member added live!',
        data: formatTeamMember(localRec)
      });
    }

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(201).json({
      success: true,
      source: 'database',
      tableNotReady: false,
      message: 'New team member published live!',
      data: formatTeamMember(data[0])
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create team member: ' + err.message
    });
  }
};

/**
 * PUT /api/about-us/team/:id
 * Update an existing team member
 */
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const updatePayload = { updated_at: new Date().toISOString() };

    if (body.name !== undefined) updatePayload.name = String(body.name).trim();
    if (body.role !== undefined) updatePayload.role = String(body.role).trim();
    if (body.base !== undefined) updatePayload.base = String(body.base).trim();
    if (body.experience !== undefined) updatePayload.experience = String(body.experience).trim();
    if (body.photo !== undefined) updatePayload.photo = String(body.photo).trim();
    if (body.short_tag !== undefined || body.shortTag !== undefined)
      updatePayload.short_tag = String(body.short_tag ?? body.shortTag).trim();
    if (body.quote !== undefined) updatePayload.quote = String(body.quote).trim();
    if (body.bio !== undefined) updatePayload.bio = String(body.bio).trim();
    if (body.certifications !== undefined) {
      updatePayload.certifications = Array.isArray(body.certifications)
        ? body.certifications.filter(Boolean)
        : String(body.certifications)
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (body.favorite_trek !== undefined || body.favoriteTrek !== undefined)
      updatePayload.favorite_trek = String(body.favorite_trek ?? body.favoriteTrek).trim();
    if (body.specialty !== undefined) updatePayload.specialty = String(body.specialty).trim();
    if (body.display_order !== undefined) updatePayload.display_order = Number(body.display_order);
    if (body.is_active !== undefined || body.isActive !== undefined)
      updatePayload.is_active = Boolean(body.is_active ?? body.isActive);

    appCache.clearPrefix(CACHE_PREFIX);

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      const { data, error } = await supabase
        .from('team_members')
        .update(updatePayload)
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        return res.status(200).json({
          success: true,
          source: 'database',
          tableNotReady: false,
          message: 'Team member updated live!',
          data: formatTeamMember(data[0])
        });
      }
      if (error && !isTableMissing(error)) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    const local = readLocalStore();
    const idx = local.team.findIndex((m) => String(m.id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, error: `Team member '${id}' not found` });
    }
    local.team[idx] = { ...local.team[idx], ...updatePayload };
    writeLocalStore(local);

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      tableNotReady: true,
      message: 'Team member updated live!',
      data: formatTeamMember(local.team[idx])
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update team member: ' + err.message
    });
  }
};

/**
 * DELETE /api/about-us/team/:id
 */
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    appCache.clearPrefix(CACHE_PREFIX);

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (!error) {
        return res.status(200).json({ success: true, message: 'Team member removed!' });
      }
      if (!isTableMissing(error)) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    const local = readLocalStore();
    local.team = local.team.filter((m) => String(m.id) !== String(id));
    writeLocalStore(local);

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      message: 'Team member removed!'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete team member: ' + err.message
    });
  }
};

/**
 * PUT /api/about-us/team/reorder
 */
export const reorderTeamMembers = async (req, res) => {
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
            .from('team_members')
            .update({ display_order: index + 1, updated_at: new Date().toISOString() })
            .eq('id', id)
        )
      );
      const firstErr = results.find((r) => r.error)?.error;
      if (!firstErr) {
        return res.status(200).json({ success: true, message: 'Team order updated live!' });
      }
      if (!isTableMissing(firstErr)) {
        return res.status(400).json({ success: false, error: firstErr.message });
      }
    }

    const local = readLocalStore();
    const orderMap = new Map(orderedIds.map((id, idx) => [String(id), idx + 1]));
    local.team = local.team
      .map((m) => ({ ...m, display_order: orderMap.get(String(m.id)) ?? m.display_order }))
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    writeLocalStore(local);

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      message: 'Team order updated live!'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to reorder team: ' + err.message
    });
  }
};

/**
 * POST /api/about-us/reset
 */
export const resetAboutUs = async (req, res) => {
  try {
    appCache.clearPrefix(CACHE_PREFIX);

    const freshLocal = {
      settings: { ...DEFAULT_ABOUT_SETTINGS, updated_at: new Date().toISOString() },
      team: DEFAULT_TEAM_MEMBERS.map((m) => ({ ...m }))
    };
    writeLocalStore(freshLocal);

    const { error: settingsErr } = await supabase
      .from('about_us_settings')
      .upsert([freshLocal.settings], { onConflict: 'id' });

    if (!isTableMissing(settingsErr)) {
      await supabase.from('team_members').delete().neq('display_order', -9999);
      const seedRows = DEFAULT_TEAM_MEMBERS.map(({ id, ...rest }) => ({
        ...rest,
        updated_at: new Date().toISOString()
      }));
      const { data: inserted } = await supabase.from('team_members').insert(seedRows).select();
      return res.status(200).json({
        success: true,
        source: 'database',
        message: 'About Us reset to defaults!',
        settings: formatSettings(freshLocal.settings),
        team: (inserted || DEFAULT_TEAM_MEMBERS).map(formatTeamMember)
      });
    }

    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      tableNotReady: true,
      message: 'About Us reset to defaults!',
      settings: formatSettings(freshLocal.settings),
      team: freshLocal.team.map(formatTeamMember)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to reset About Us: ' + err.message
    });
  }
};
