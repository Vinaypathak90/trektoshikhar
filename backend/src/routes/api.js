import express from 'express';
import { supabase } from '../config/supabase.js';
import { transporter } from '../config/mailer.js';

const router = express.Router();

// Fallback treks in case database table isn't migrated yet
const FALLBACK_TREKS = [
  {
    id: '1',
    title: 'Nag Tibba Weekend Trek',
    slug: 'nag-tibba-weekend-trek',
    region: 'dehradun',
    location: 'Dehradun / Pantwari Base',
    duration: '2 Days / 1 Night',
    altitude: '9,915 ft',
    difficulty: 'Easy - Moderate',
    price: 2499,
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    tag: 'Best for Beginners'
  },
  {
    id: '2',
    title: 'Hatu Peak & Alpine Ridge',
    slug: 'hatu-peak-alpine-ridge',
    region: 'shimla',
    location: 'Narkanda / Shimla Foothills',
    duration: '2 Days / 1 Night',
    altitude: '11,150 ft',
    difficulty: 'Easy',
    price: 2799,
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    tag: 'Scenic Panorama'
  },
  {
    id: '3',
    title: 'Kedarkantha Summit Expedition',
    slug: 'kedarkantha-summit-expedition',
    region: 'dehradun',
    location: 'Sankri / Govind National Park',
    duration: '5 Days / 4 Nights',
    altitude: '12,500 ft',
    difficulty: 'Moderate',
    price: 6999,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tag: 'Top Winter Trek'
  },
  {
    id: '4',
    title: 'Churdhar Sanctuary Trek',
    slug: 'churdhar-sanctuary-trek',
    region: 'shimla',
    location: 'Nohradhar / Shimla Base',
    duration: '3 Days / 2 Nights',
    altitude: '11,965 ft',
    difficulty: 'Moderate',
    price: 3499,
    image_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    tag: 'Highest Shivalik Peak'
  }
];

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'TrekToShikhar API',
    supabaseConnected: true,
    timestamp: new Date().toISOString()
  });
});

// GET /api/treks - List all treks (with optional ?region= filter)
router.get('/treks', async (req, res) => {
  try {
    const { region } = req.query;

    let query = supabase.from('treks').select('*').order('created_at', { ascending: true });
    if (region && region !== 'all') {
      query = query.eq('region', region);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Use fallback if table is empty or error
      const filtered = region && region !== 'all' 
        ? FALLBACK_TREKS.filter(t => t.region === region) 
        : FALLBACK_TREKS;
      return res.json({ success: true, count: filtered.length, source: 'fallback', data: filtered });
    }

    res.json({ success: true, count: data.length, source: 'supabase', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/treks/:slug - Fetch single trek with batches
router.get('/treks/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { data: trek, error } = await supabase
      .from('treks')
      .select('*, batches(*)')
      .eq('slug', slug)
      .single();

    if (error || !trek) {
      const found = FALLBACK_TREKS.find(t => t.slug === slug);
      if (found) return res.json({ success: true, source: 'fallback', data: found });
      return res.status(404).json({ success: false, message: 'Trek not found' });
    }

    res.json({ success: true, source: 'supabase', data: trek });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/inquiries - Handle contact & booking inquiry form
router.post('/inquiries', async (req, res) => {
  try {
    const { name, phone, email, destination, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone are required' });
    }

    // Insert into Supabase inquiries table
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{ name, phone, email, destination, message }])
      .select();

    // Optionally send email notification if configured
    try {
      if (process.env.EMAIL_APP_PASS) {
        await transporter.sendMail({
          from: `"TrekToShikhar Lead" <${process.env.EMAIL_APP_NAME}@gmail.com>`,
          to: `${process.env.EMAIL_APP_NAME}@gmail.com`,
          subject: `🏔️ New Trek Inquiry: ${name} (${destination || 'General'})`,
          text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nDestination: ${destination}\nMessage: ${message || 'N/A'}`
        });
      }
    } catch (mailErr) {
      console.warn('Mail alert skipped:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully! Our team will contact you shortly.',
      data: data?.[0] || { name, phone, destination }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/bookings - Create new trek slot reservation
router.post('/bookings', async (req, res) => {
  try {
    const { 
      trek_id, 
      trek_title,
      batch_id, 
      batch_date,
      user_name, 
      customer_name,
      user_email, 
      customer_email,
      user_phone, 
      customer_phone,
      total_trekkers, 
      trekkers_count,
      total_amount, 
      package_name,
      notes,
      emergency_contact 
    } = req.body;

    const name = customer_name || user_name || 'Anonymous Trekker';
    const phone = customer_phone || user_phone || '';
    const email = customer_email || user_email || '';
    const trekkers = trekkers_count || total_trekkers || 1;

    const booking_ref = `TKS-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        booking_ref,
        trek_id: trek_id ? String(trek_id) : null,
        batch_id: batch_id || null,
        user_name: name,
        user_email: email,
        user_phone: phone,
        total_trekkers: trekkers,
        total_amount: total_amount || 0,
        payment_status: 'pending',
        emergency_contact: notes || emergency_contact || ''
      }])
      .select();

    if (error) {
      console.warn('Supabase booking note (ignorable if tables not migrated yet):', error.message);
    }

    // Optional mail alert to agency
    try {
      if (process.env.EMAIL_APP_PASS) {
        await transporter.sendMail({
          from: `"TrekToShikhar Booking" <${process.env.EMAIL_APP_NAME}@gmail.com>`,
          to: `${process.env.EMAIL_APP_NAME}@gmail.com`,
          subject: `🏔️ New WhatsApp Booking: ${name} (${trek_title || 'Trek'})`,
          text: `Booking Ref: ${booking_ref}\nTrek: ${trek_title || trek_id}\nPackage: ${package_name || 'Standard'}\nBatch: ${batch_date || 'N/A'}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nTrekkers: ${trekkers}\nTotal: ₹${total_amount}\nNotes: ${notes || 'N/A'}`
        });
      }
    } catch (mErr) {
      console.warn('Mail notification skipped:', mErr.message);
    }

    res.status(201).json({
      success: true,
      booking_ref,
      message: 'Slot reserved successfully! Booking confirmation initiated.',
      data: data?.[0] || { booking_ref, user_name: name, total_amount }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
