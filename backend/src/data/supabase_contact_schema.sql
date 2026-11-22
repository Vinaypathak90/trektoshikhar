  -- ============================================================================
  -- TREKTOSHIKHAR CONTACT & OFFICE LOCATIONS DATABASE SCHEMA
  -- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
  -- ============================================================================

  -- 1. Contact Settings Table
  CREATE TABLE IF NOT EXISTS public.contact_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    phone TEXT DEFAULT '+91 87912 18377',
    display_phone TEXT DEFAULT '+91 87912 18377',
    whatsapp TEXT DEFAULT '918791218377',
    email TEXT DEFAULT 'bookings@trektoshikhar.com',
    hours TEXT DEFAULT '7:00 AM – 10:00 PM IST (Mon – Sun)',
    emergency_line TEXT DEFAULT '24/7 Active Trail Dispatch & Rescue Helpline',
    response_time TEXT DEFAULT 'Within 15 minutes',
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Seed default global settings
  INSERT INTO public.contact_settings (id, phone, display_phone, whatsapp, email, hours, emergency_line, response_time)
  VALUES (
    'global',
    '+91 87912 18377',
    '+91 87912 18377',
    '918791218377',
    'bookings@trektoshikhar.com',
    '7:00 AM – 10:00 PM IST (Mon – Sun)',
    '24/7 Active Trail Dispatch & Rescue Helpline',
    'Within 15 minutes'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Offices & Base Hubs Table (Dynamic Addresses & Custom Maps)
  CREATE TABLE IF NOT EXISTS public.offices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    badge TEXT DEFAULT '',
    address TEXT NOT NULL,
    landmark TEXT DEFAULT '',
    phone TEXT DEFAULT '+91 87912 18377',
    email TEXT DEFAULT 'bookings@trektoshikhar.com',
    hours TEXT DEFAULT '7:00 AM – 9:00 PM IST',
    description TEXT DEFAULT '',
    map_embed_url TEXT DEFAULT '',
    map_query TEXT DEFAULT '',
    is_main_hq BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Seed Initial Offices: Dehradun HQ & Haldwani Kumaon Hub
  INSERT INTO public.offices (id, name, city, badge, address, landmark, phone, email, hours, description, map_embed_url, map_query, is_main_hq, is_active, display_order)
  VALUES 
  (
    'office-dehradun-hq',
    'Dehradun Main HQ & Garhwal Base',
    'Dehradun',
    'Main Headquarters • Uttarakhand',
    'Rajpur Road, Near Clock Tower, Dehradun, Uttarakhand 248001',
    'Near Clock Tower & Gandhi Park',
    '+91 87912 18377',
    'bookings@trektoshikhar.com',
    '7:00 AM – 9:00 PM IST',
    'Primary administrative headquarters and operational staging center for Garhwal expeditions: Nag Tibba, Kedarkantha, Har Ki Dun, and Kuari Pass.',
    'https://maps.google.com/maps?q=Rajpur+Road+Dehradun+Clock+Tower&t=&z=14&ie=UTF8&iwloc=&output=embed',
    'Rajpur Road, Clock Tower, Dehradun',
    true,
    true,
    1
  ),
  (
    'office-haldwani-foothills',
    'Haldwani Foothills Hub & Kumaon Gateway',
    'Haldwani',
    'Kumaon Regional Hub • Uttarakhand',
    'Nainital Road, Near Tikonia Chauraha, Haldwani, Uttarakhand 263139',
    'Near Tikonia Chauraha & Kathgodam Rail Link',
    '+91 87912 18377',
    'haldwani@trektoshikhar.com',
    '8:00 AM – 8:00 PM IST',
    'Regional logistics hub and equipment staging center for Kumaon gateway expeditions, Pindari glacier routes, and east Himalayan trail coordination.',
    'https://maps.google.com/maps?q=Tikonia+Chauraha+Nainital+Road+Haldwani&t=&z=14&ie=UTF8&iwloc=&output=embed',
    'Nainital Road, Haldwani',
    false,
    true,
    2
  ),
  (
    'office-shimla-ridge',
    'Shimla Ridge Base & Himachal Command',
    'Shimla',
    'Himachal Expedition Base',
    'The Ridge, Near Christ Church, Shimla, Himachal Pradesh 171001',
    'The Ridge, Adjacent to Mall Road',
    '+91 87912 18377',
    'shimla@trektoshikhar.com',
    '7:30 AM – 8:30 PM IST',
    'Alpine command post for Himachal expeditions: Hatu Peak, Churdhar Sanctuary, and Spiti Valley high-altitude passes.',
    'https://maps.google.com/maps?q=The+Ridge+Christ+Church+Shimla&t=&z=14&ie=UTF8&iwloc=&output=embed',
    'The Ridge, Shimla',
    false,
    true,
    3
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. Inquiries Table (Website Contact Form Submissions)
  CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    trek_interest TEXT DEFAULT 'General Inquiry',
    trekker_count TEXT DEFAULT '2',
    travel_month TEXT DEFAULT 'Upcoming Weekend',
    message TEXT DEFAULT '',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 4. FAQs Table
  CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    category TEXT DEFAULT 'beginners',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Enable RLS and define public access policies (read public, write via backend service role)
  ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow public read contact_settings" ON public.contact_settings FOR SELECT USING (true);
  CREATE POLICY "Allow public read offices" ON public.offices FOR SELECT USING (is_active = true);
  CREATE POLICY "Allow public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow public read faqs" ON public.faqs FOR SELECT USING (is_active = true);
