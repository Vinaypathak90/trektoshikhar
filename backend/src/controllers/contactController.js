import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { appCache } from '../utils/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_PATH = path.resolve(__dirname, '../data/contact_store.json');

const CACHE_KEY_PUBLIC = 'contact_public_data';
const CACHE_KEY_ADMIN = 'contact_admin_data';

export const DEFAULT_CONTACT_SETTINGS = {
  id: 'global',
  phone: '+91 87912 18377',
  display_phone: '+91 87912 18377',
  whatsapp: '918791218377',
  email: 'bookings@trektoshikhar.com',
  hours: '7:00 AM – 10:00 PM IST (Mon – Sun)',
  emergency_line: '24/7 Active Trail Dispatch & Rescue Helpline',
  response_time: 'Within 15 minutes',
  updated_at: new Date().toISOString()
};

export const DEFAULT_OFFICES = [
  {
    id: 'office-dehradun-hq',
    name: 'Dehradun Main HQ & Garhwal Base',
    city: 'Dehradun',
    badge: 'Main Headquarters • Uttarakhand',
    address: 'Rajpur Road, Near Clock Tower, Dehradun, Uttarakhand 248001',
    landmark: 'Near Clock Tower & Gandhi Park',
    phone: '+91 87912 18377',
    email: 'bookings@trektoshikhar.com',
    hours: '7:00 AM – 9:00 PM IST',
    description: 'Primary administrative headquarters and operational staging center for Garhwal expeditions: Nag Tibba, Kedarkantha, Har Ki Dun, and Kuari Pass.',
    map_embed_url: 'https://maps.google.com/maps?q=Rajpur+Road+Dehradun+Clock+Tower&t=&z=14&ie=UTF8&iwloc=&output=embed',
    map_query: 'Rajpur Road, Clock Tower, Dehradun',
    is_main_hq: true,
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'office-haldwani-foothills',
    name: 'Haldwani Foothills Hub & Kumaon Gateway',
    city: 'Haldwani',
    badge: 'Kumaon Regional Hub • Uttarakhand',
    address: 'Nainital Road, Near Tikonia Chauraha, Haldwani, Uttarakhand 263139',
    landmark: 'Near Tikonia Chauraha & Kathgodam Rail Link',
    phone: '+91 87912 18377',
    email: 'haldwani@trektoshikhar.com',
    hours: '8:00 AM – 8:00 PM IST',
    description: 'Regional logistics hub and equipment staging center for Kumaon gateway expeditions, Pindari glacier routes, and east Himalayan trail coordination.',
    map_embed_url: 'https://maps.google.com/maps?q=Tikonia+Chauraha+Nainital+Road+Haldwani&t=&z=14&ie=UTF8&iwloc=&output=embed',
    map_query: 'Nainital Road, Haldwani',
    is_main_hq: false,
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'office-shimla-ridge',
    name: 'Shimla Ridge Base & Himachal Command',
    city: 'Shimla',
    badge: 'Himachal Expedition Base',
    address: 'The Ridge, Near Christ Church, Shimla, Himachal Pradesh 171001',
    landmark: 'The Ridge, Adjacent to Mall Road',
    phone: '+91 87912 18377',
    email: 'shimla@trektoshikhar.com',
    hours: '7:30 AM – 8:30 PM IST',
    description: 'Alpine command post for Himachal expeditions: Hatu Peak, Churdhar Sanctuary, and Spiti Valley high-altitude passes.',
    map_embed_url: 'https://maps.google.com/maps?q=The+Ridge+Christ+Church+Shimla&t=&z=14&ie=UTF8&iwloc=&output=embed',
    map_query: 'The Ridge, Shimla',
    is_main_hq: false,
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const DEFAULT_INQUIRIES = [
  {
    id: 'inq-sample-1',
    full_name: 'Rohit Sharma',
    phone: '9820145678',
    email: 'rohit.sharma@example.com',
    trek_interest: 'Kedarkantha Summit Expedition',
    trekker_count: '4',
    travel_month: 'Upcoming Weekend',
    message: 'Looking for winter batch with snow gear rental support.',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'inq-sample-2',
    full_name: 'Priya Joshi',
    phone: '9711234560',
    email: 'priya.j@example.com',
    trek_interest: 'Nag Tibba Weekend Trek',
    trekker_count: '2',
    travel_month: 'Next 15 Days',
    message: 'Pickup needed from Dehradun Railway Station on Saturday morning.',
    status: 'contacted',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    category: 'beginners',
    question: 'Are Himalayan weekend treks safe for absolute beginners with zero prior trekking experience?',
    answer: 'Yes, absolutely! Introductory treks like Nag Tibba (9,915 ft) and Hatu Peak (11,150 ft) are paced scientifically with gradual slopes and frequent hydration breaks. Certified leaders from NIM (National Institute of Mountaineering) guide every step with a relaxed pace, making them 100% beginner and family friendly.',
    display_order: 1,
    is_active: true
  },
  {
    id: 'faq-2',
    category: 'safety',
    question: 'What emergency medical protocols and oxygen backups are available on the trail?',
    answer: 'Every single expedition batch is equipped with a high-altitude emergency oxygen cylinder, portable pulse oximeter for daily acclimatization checks, and a comprehensive wilderness medical kit. All trek leaders are certified Wilderness First Responders (WFR).',
    display_order: 2,
    is_active: true
  },
  {
    id: 'faq-3',
    category: 'booking',
    question: 'How do I reach your mountain coordination desk directly for urgent booking?',
    answer: 'You can instantly connect with our lead coordinators via WhatsApp or direct phone call at +91 87912 18377. Our operations desk is active 7 days a week from 7:00 AM to 10:00 PM IST.',
    display_order: 3,
    is_active: true
  },
  {
    id: 'faq-4',
    category: 'safety',
    question: 'Why do you strictly limit batch sizes to 12–15 trekkers per expedition?',
    answer: 'We reject commercial crowd-herding. A capped batch size of 12–15 trekkers ensures a 1:6 guide-to-trekker safety ratio, personalized health monitoring, and zero trail littering.',
    display_order: 4,
    is_active: true
  }
];

// Helper to normalize map embed URLs from user input
export const normalizeMapUrl = (input) => {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (trimmed.includes('src="')) {
    const match = trimmed.match(/src=["'](.*?)["']/);
    if (match && match[1]) return match[1];
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('maps/embed') || trimmed.includes('output=embed')) {
      return trimmed;
    }
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
};

// Local JSON Store Reader & Writer
const readLocalStore = () => {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'));
      if (parsed && parsed.settings && Array.isArray(parsed.offices)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not read local contact store:', err.message);
  }
  return {
    settings: { ...DEFAULT_CONTACT_SETTINGS },
    offices: DEFAULT_OFFICES.map(o => ({ ...o })),
    inquiries: DEFAULT_INQUIRIES.map(i => ({ ...i })),
    faqs: DEFAULT_FAQS.map(f => ({ ...f }))
  };
};

const writeLocalStore = (store) => {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ Could not write local contact store:', err.message);
  }
};

const clearContactCaches = () => {
  appCache.del(CACHE_KEY_PUBLIC);
  appCache.del(CACHE_KEY_ADMIN);
};

// ============================================================================
// CONTROLLER HANDLERS
// ============================================================================

/**
 * GET /api/contact - Public view of contact details, active offices, active faqs
 */
export const getContactPublic = async (req, res) => {
  try {
    const cached = appCache.get(CACHE_KEY_PUBLIC);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }

    let settings = null;
    let offices = null;
    let faqs = null;

    // Try Supabase first
    try {
      const { data: sData } = await supabase.from('contact_settings').select('*').limit(1);
      if (sData && sData.length > 0) settings = sData[0];

      const { data: oData } = await supabase
        .from('offices')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (oData && oData.length > 0) offices = oData;

      const { data: fData } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (fData && fData.length > 0) faqs = fData;
    } catch (e) {
      // Supabase tables might not be created yet, fallback gracefully
    }

    // Fallback to local store
    const local = readLocalStore();
    const finalSettings = settings || local.settings || DEFAULT_CONTACT_SETTINGS;
    const finalOffices = (offices && offices.length > 0) 
      ? offices 
      : (local.offices || DEFAULT_OFFICES).filter(o => o.is_active !== false);
    const finalFaqs = (faqs && faqs.length > 0) 
      ? faqs 
      : (local.faqs || DEFAULT_FAQS).filter(f => f.is_active !== false);

    const payload = {
      success: true,
      settings: finalSettings,
      offices: finalOffices,
      faqs: finalFaqs
    };

    appCache.set(CACHE_KEY_PUBLIC, payload, 300);
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (error) {
    console.error('Error fetching public contact data:', error);
    const local = readLocalStore();
    return res.status(200).json({
      success: true,
      settings: local.settings,
      offices: local.offices.filter(o => o.is_active !== false),
      faqs: local.faqs.filter(f => f.is_active !== false)
    });
  }
};

/**
 * GET /api/contact/admin - Complete view for Admin CRM (includes inquiries)
 */
export const getContactAdmin = async (req, res) => {
  try {
    const cached = appCache.get(CACHE_KEY_ADMIN);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }

    let settings = null;
    let offices = null;
    let inquiries = null;
    let faqs = null;

    try {
      const { data: sData } = await supabase.from('contact_settings').select('*').limit(1);
      if (sData && sData.length > 0) settings = sData[0];

      const { data: oData } = await supabase.from('offices').select('*').order('display_order', { ascending: true });
      if (oData && oData.length > 0) offices = oData;

      const { data: iData } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (iData && iData.length > 0) inquiries = iData;

      const { data: fData } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
      if (fData && fData.length > 0) faqs = fData;
    } catch (e) {
      // Fallback
    }

    const local = readLocalStore();
    const payload = {
      success: true,
      settings: settings || local.settings || DEFAULT_CONTACT_SETTINGS,
      offices: offices || local.offices || DEFAULT_OFFICES,
      inquiries: inquiries || local.inquiries || DEFAULT_INQUIRIES,
      faqs: faqs || local.faqs || DEFAULT_FAQS
    };

    appCache.set(CACHE_KEY_ADMIN, payload, 60);
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (error) {
    console.error('Error fetching admin contact data:', error);
    const local = readLocalStore();
    return res.status(200).json({
      success: true,
      settings: local.settings,
      offices: local.offices,
      inquiries: local.inquiries,
      faqs: local.faqs
    });
  }
};

/**
 * PUT /api/contact/settings - Update primary contact settings
 */
export const updateContactSettings = async (req, res) => {
  try {
    const body = req.body || {};
    const local = readLocalStore();

    const updated = {
      ...local.settings,
      phone: body.phone || local.settings.phone,
      display_phone: body.display_phone || body.phone || local.settings.phone,
      whatsapp: body.whatsapp || local.settings.whatsapp,
      email: body.email || local.settings.email,
      hours: body.hours || local.settings.hours,
      emergency_line: body.emergency_line || local.settings.emergency_line,
      response_time: body.response_time || local.settings.response_time,
      updated_at: new Date().toISOString()
    };

    // Update local store
    local.settings = updated;
    writeLocalStore(local);

    // Update Supabase if table exists
    try {
      await supabase.from('contact_settings').upsert({ id: 'global', ...updated });
    } catch (e) {
      console.warn('Supabase contact_settings upsert skipped:', e.message);
    }

    clearContactCaches();
    return res.status(200).json({
      success: true,
      message: 'Contact settings updated successfully',
      settings: updated
    });
  } catch (error) {
    console.error('Error updating contact settings:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================================================
// OFFICES CRUD
// ============================================================================

/**
 * POST /api/contact/offices - Add a new office / base hub
 */
export const createOffice = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.city || !body.address) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Office Name, City, and Full Physical Address.'
      });
    }

    const local = readLocalStore();
    const id = body.id || `office-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const mapEmbed = normalizeMapUrl(body.map_embed_url || body.address);

    const newOffice = {
      id,
      name: body.name.trim(),
      city: body.city.trim(),
      badge: body.badge?.trim() || `${body.city.trim()} Base`,
      address: body.address.trim(),
      landmark: body.landmark?.trim() || '',
      phone: body.phone?.trim() || local.settings.phone,
      email: body.email?.trim() || local.settings.email,
      hours: body.hours?.trim() || local.settings.hours,
      description: body.description?.trim() || `Operational staging hub in ${body.city.trim()}.`,
      map_embed_url: mapEmbed,
      map_query: body.map_query?.trim() || body.address.trim(),
      is_main_hq: Boolean(body.is_main_hq),
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      display_order: Number(body.display_order ?? (local.offices.length + 1)),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    local.offices.push(newOffice);
    writeLocalStore(local);

    try {
      await supabase.from('offices').insert([newOffice]);
    } catch (e) {
      console.warn('Supabase office insert skipped:', e.message);
    }

    clearContactCaches();
    return res.status(201).json({
      success: true,
      message: `Office "${newOffice.name}" created successfully`,
      office: newOffice
    });
  } catch (error) {
    console.error('Error creating office:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * PUT /api/contact/offices/:id - Update an existing office
 */
export const updateOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const local = readLocalStore();

    const idx = local.offices.findIndex(o => o.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Office not found' });
    }

    const current = local.offices[idx];
    const mapEmbed = body.map_embed_url !== undefined 
      ? normalizeMapUrl(body.map_embed_url || body.address || current.address)
      : current.map_embed_url;

    const updated = {
      ...current,
      name: body.name !== undefined ? body.name.trim() : current.name,
      city: body.city !== undefined ? body.city.trim() : current.city,
      badge: body.badge !== undefined ? body.badge.trim() : current.badge,
      address: body.address !== undefined ? body.address.trim() : current.address,
      landmark: body.landmark !== undefined ? body.landmark.trim() : current.landmark,
      phone: body.phone !== undefined ? body.phone.trim() : current.phone,
      email: body.email !== undefined ? body.email.trim() : current.email,
      hours: body.hours !== undefined ? body.hours.trim() : current.hours,
      description: body.description !== undefined ? body.description.trim() : current.description,
      map_embed_url: mapEmbed,
      map_query: body.map_query !== undefined ? body.map_query.trim() : current.map_query,
      is_main_hq: body.is_main_hq !== undefined ? Boolean(body.is_main_hq) : current.is_main_hq,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : current.is_active,
      display_order: body.display_order !== undefined ? Number(body.display_order) : current.display_order,
      updated_at: new Date().toISOString()
    };

    local.offices[idx] = updated;
    writeLocalStore(local);

    try {
      await supabase.from('offices').update(updated).eq('id', id);
    } catch (e) {
      console.warn('Supabase office update skipped:', e.message);
    }

    clearContactCaches();
    return res.status(200).json({
      success: true,
      message: `Office "${updated.name}" updated successfully`,
      office: updated
    });
  } catch (error) {
    console.error('Error updating office:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/contact/offices/:id - Delete an office
 */
export const deleteOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const local = readLocalStore();

    local.offices = local.offices.filter(o => o.id !== id);
    writeLocalStore(local);

    try {
      await supabase.from('offices').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase office delete skipped:', e.message);
    }

    clearContactCaches();
    return res.status(200).json({
      success: true,
      message: 'Office location deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting office:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================================================
// INQUIRIES
// ============================================================================

/**
 * POST /api/contact/inquiries - Submit an inquiry from public contact form
 */
export const submitInquiry = async (req, res) => {
  try {
    const body = req.body;
    if (!body.full_name && !body.fullName) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (!body.phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    const local = readLocalStore();
    const id = `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newInquiry = {
      id,
      full_name: (body.full_name || body.fullName || '').trim(),
      phone: (body.phone || '').trim(),
      email: (body.email || '').trim(),
      trek_interest: (body.trek_interest || body.trekInterest || 'General Inquiry').trim(),
      trekker_count: String(body.trekker_count || body.trekkerCount || '2'),
      travel_month: (body.travel_month || body.travelMonth || 'Upcoming Weekend').trim(),
      message: (body.message || '').trim(),
      status: 'new',
      created_at: new Date().toISOString()
    };

    local.inquiries.unshift(newInquiry);
    writeLocalStore(local);

    try {
      await supabase.from('inquiries').insert([newInquiry]);
    } catch (e) {
      console.warn('Supabase inquiry insert skipped:', e.message);
    }

    clearContactCaches();
    return res.status(201).json({
      success: true,
      message: 'Inquiry received and logged to operations desk!',
      inquiry: newInquiry
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * PATCH /api/contact/inquiries/:id/status - Update inquiry status
 */
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const local = readLocalStore();

    const target = local.inquiries.find(i => i.id === id);
    if (!target) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    target.status = status || target.status;
    target.updated_at = new Date().toISOString();
    writeLocalStore(local);

    try {
      await supabase.from('inquiries').update({ status: target.status }).eq('id', id);
    } catch (e) {
      // Skip
    }

    clearContactCaches();
    return res.status(200).json({
      success: true,
      message: `Inquiry marked as ${target.status}`,
      inquiry: target
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/contact/inquiries/:id - Delete inquiry
 */
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const local = readLocalStore();

    local.inquiries = local.inquiries.filter(i => i.id !== id);
    writeLocalStore(local);

    try {
      await supabase.from('inquiries').delete().eq('id', id);
    } catch (e) {
      // Skip
    }

    clearContactCaches();
    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================================================
// FAQS CRUD
// ============================================================================

export const createFaq = async (req, res) => {
  try {
    const body = req.body;
    if (!body.question || !body.answer) {
      return res.status(400).json({ success: false, error: 'Question and answer are required.' });
    }

    const local = readLocalStore();
    const id = body.id || `faq-${Date.now().toString(36)}`;

    const newFaq = {
      id,
      category: body.category || 'beginners',
      question: body.question.trim(),
      answer: body.answer.trim(),
      display_order: Number(body.display_order ?? (local.faqs.length + 1)),
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      created_at: new Date().toISOString()
    };

    local.faqs.push(newFaq);
    writeLocalStore(local);

    try {
      await supabase.from('faqs').insert([newFaq]);
    } catch (e) {
      // Skip
    }

    clearContactCaches();
    return res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      faq: newFaq
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const local = readLocalStore();

    const idx = local.faqs.findIndex(f => f.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }

    const updated = {
      ...local.faqs[idx],
      category: body.category || local.faqs[idx].category,
      question: body.question !== undefined ? body.question.trim() : local.faqs[idx].question,
      answer: body.answer !== undefined ? body.answer.trim() : local.faqs[idx].answer,
      display_order: body.display_order !== undefined ? Number(body.display_order) : local.faqs[idx].display_order,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : local.faqs[idx].is_active,
      updated_at: new Date().toISOString()
    };

    local.faqs[idx] = updated;
    writeLocalStore(local);

    try {
      await supabase.from('faqs').update(updated).eq('id', id);
    } catch (e) {
      // Skip
    }

    clearContactCaches();
    return res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      faq: updated
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const local = readLocalStore();

    local.faqs = local.faqs.filter(f => f.id !== id);
    writeLocalStore(local);

    try {
      await supabase.from('faqs').delete().eq('id', id);
    } catch (e) {
      // Skip
    }

    clearContactCaches();
    return res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
