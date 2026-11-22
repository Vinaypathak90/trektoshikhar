import { fetchWithAuth } from './authApi';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://trektoshikhar.onrender.com/api';

const CACHE_KEY_ABOUT = 'tts_cached_about_us_v1';

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
    shortTag: 'NIM Certified • 180+ Summits',
    short_tag: 'NIM Certified • 180+ Summits',
    quote: 'A summit lasts ten minutes, but the warmth of the people you climb with stays for a lifetime.',
    bio: 'Born with an unstoppable love for the Garhwal and Himachal ridges, Vinay founded Trek to Shikhar to break away from robotic, crowded commercial tours. He personally oversees trail safety standards, small-batch curation, and our signature "You are Family" ethos on every departure.',
    certifications: [
      'NIM Uttarkashi Basic & Advance Mountaineering',
      'Wilderness First Responder (WFR)',
      '180+ Successful Himalayan Expeditions'
    ],
    favoriteTrek: 'Kedarkantha Winter Summit & Kuari Pass',
    favorite_trek: 'Kedarkantha Winter Summit & Kuari Pass',
    specialty: 'High-Altitude Route Planning & Community Leadership',
    is_active: true
  },
  {
    id: 'team-2',
    name: 'Raghav Chauhan',
    role: 'Co-Founder & Chief Mountain Guide',
    base: 'Shimla Base Camp',
    experience: '9+ Years in Himalayas',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85',
    shortTag: 'ABVIMAS Manali • Snow Specialist',
    short_tag: 'ABVIMAS Manali • Snow Specialist',
    quote: 'In the mountains, nobody walks alone. We climb at the pace of togetherness, never haste.',
    bio: 'Raised in the cedar valleys of Himachal Pradesh, Raghav knows every ridge, wind shift, and hidden spring from Hatu Peak to Churdhar Sanctuary. Known among Shikharites for his calm voice during steep snow pushes and endless mountain folklore around the evening campfire.',
    certifications: [
      'ABVIMAS Manali Mountaineering Graduate',
      'Alpine Snow & Ice Rescue Certified',
      'Search & Rescue Volunteer — Himachal'
    ],
    favoriteTrek: 'Churdhar Sanctuary & Shrikhand Mahadev',
    favorite_trek: 'Churdhar Sanctuary & Shrikhand Mahadev',
    specialty: 'Winter Snow Navigation & Beginner Confidence Coaching',
    is_active: true
  },
  {
    id: 'team-3',
    name: 'Ananya Rawat',
    role: 'Head of Trekker Care & Safety Lead',
    base: 'Dehradun Base Camp',
    experience: '7+ Years in Himalayas',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85',
    shortTag: 'WFR Certified • Solo Female Mentor',
    short_tag: 'WFR Certified • Solo Female Mentor',
    quote: 'Comfort, safety, and feeling truly heard — that is what turns a nervous first-timer into a lifelong Shikharite.',
    bio: 'Ananya leads our medical-grade altitude protocols and solo-traveler hospitality wing. From pre-trek fitness check-ins to twice-daily SpO2 monitoring at sub-zero camps, she ensures every trekker — especially solo female explorers — feels completely safe, welcomed, and right at home.',
    certifications: [
      'Certified Wilderness First Responder (WFR)',
      'High-Altitude Acclimatization Specialist',
      'Solo Women Expedition Safety Lead'
    ],
    favoriteTrek: 'Brahmatal Frozen Lake & Har Ki Dun',
    favorite_trek: 'Brahmatal Frozen Lake & Har Ki Dun',
    specialty: 'Altitude Health Monitoring & Personalized Trekker Care',
    is_active: true
  },
  {
    id: 'team-4',
    name: 'Devendra Negi',
    role: 'Base Camp Operations & Eco-Trail Chief',
    base: 'Garhwal & Sankri Hub',
    experience: '12+ Years in Himalayas',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85',
    shortTag: 'Camp Architecture • Heal Himalaya Lead',
    short_tag: 'Camp Architecture • Heal Himalaya Lead',
    quote: 'We leave nothing behind on the mountains except gratitude and footprints that fade with the snow.',
    bio: 'The quiet heartbeat behind every spotless 4-season tent and piping-hot mountain meal at 11,000 ft. Devendra coordinates local village partnerships, sustainable mule logistics, and leads Trek to Shikhar’s Heal Himalaya cleanup drives across Uttarakhand and Himachal.',
    certifications: [
      'Leave No Trace (LNT) Master Educator',
      'High-Altitude Camp & Gear Quartermaster',
      '1,200+ Trail Cleanup Drives Coordinated'
    ],
    favoriteTrek: 'Nag Tibba & Tungnath Chandrashila',
    favorite_trek: 'Nag Tibba & Tungnath Chandrashila',
    specialty: 'Alpine Camp Hospitality & Zero-Plastic Trail Conservation',
    is_active: true
  }
];

export function getCachedAboutUs() {
  try {
    const raw = localStorage.getItem(CACHE_KEY_ABOUT);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.settings && Array.isArray(parsed.team)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setCachedAboutUs(payload) {
  try {
    if (payload && payload.settings && Array.isArray(payload.team)) {
      localStorage.setItem(CACHE_KEY_ABOUT, JSON.stringify(payload));
    }
  } catch {
    // Ignore quota errors
  }
}

function broadcastUpdate(payload) {
  window.dispatchEvent(new CustomEvent('tts-about-us-updated', { detail: payload }));
}

export async function getAboutUs(options = {}) {
  try {
    const qs = options.admin ? '?admin=true' : '';
    const res = await fetch(`${API_URL}/about-us${qs}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const json = await res.json();

    const settings = json.settings || DEFAULT_ABOUT_SETTINGS;
    const team = Array.isArray(json.team) ? json.team : DEFAULT_TEAM_MEMBERS;

    if (!options.admin) {
      setCachedAboutUs({ settings, team });
    }

    return {
      settings,
      team,
      source: json.source || 'database',
      tableNotReady: Boolean(json.tableNotReady)
    };
  } catch (err) {
    console.warn('⚠️ Fetching About Us via API failed, using cache/default:', err.message);
    const cached = getCachedAboutUs();
    return {
      settings: cached?.settings || DEFAULT_ABOUT_SETTINGS,
      team: cached?.team || DEFAULT_TEAM_MEMBERS,
      source: 'cache',
      tableNotReady: false
    };
  }
}

export async function updateAboutUsSettings(settingsPayload) {
  const res = await fetchWithAuth(`${API_URL}/about-us/settings`, {
    method: 'PUT',
    body: JSON.stringify(settingsPayload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update About Us settings');

  const fresh = await getAboutUs({ admin: false });
  broadcastUpdate({ settings: fresh.settings, team: fresh.team });
  return json;
}

export async function createTeamMember(memberData) {
  const res = await fetchWithAuth(`${API_URL}/about-us/team`, {
    method: 'POST',
    body: JSON.stringify(memberData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to add team member');

  const fresh = await getAboutUs({ admin: false });
  broadcastUpdate({ settings: fresh.settings, team: fresh.team });
  return json;
}

export async function updateTeamMember(id, memberData) {
  const res = await fetchWithAuth(`${API_URL}/about-us/team/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(memberData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update team member');

  const fresh = await getAboutUs({ admin: false });
  broadcastUpdate({ settings: fresh.settings, team: fresh.team });
  return json;
}

export async function deleteTeamMember(id) {
  const res = await fetchWithAuth(`${API_URL}/about-us/team/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to remove team member');

  const fresh = await getAboutUs({ admin: false });
  broadcastUpdate({ settings: fresh.settings, team: fresh.team });
  return json;
}

export async function reorderTeamMembers(orderedIds) {
  const res = await fetchWithAuth(`${API_URL}/about-us/team/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ orderedIds })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reorder team members');

  const fresh = await getAboutUs({ admin: false });
  broadcastUpdate({ settings: fresh.settings, team: fresh.team });
  return json;
}

export async function resetAboutUsData() {
  const res = await fetchWithAuth(`${API_URL}/about-us/reset`, {
    method: 'POST'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset About Us');

  const payload = {
    settings: json.settings || DEFAULT_ABOUT_SETTINGS,
    team: json.team || DEFAULT_TEAM_MEMBERS
  };
  setCachedAboutUs(payload);
  broadcastUpdate(payload);
  return json;
}
