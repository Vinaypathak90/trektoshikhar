-- ========================================================
-- TrekToShikhar Database Schema (PostgreSQL for Supabase)
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Treks Table
CREATE TABLE IF NOT EXISTS public.treks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    region VARCHAR(50) NOT NULL, -- 'dehradun' | 'shimla' | 'other'
    location VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    altitude VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL, -- 'Easy' | 'Moderate' | 'Difficult'
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    tag VARCHAR(100),
    description TEXT,
    itinerary JSONB DEFAULT '[]'::jsonb,
    inclusions TEXT[] DEFAULT ARRAY[]::TEXT[],
    exclusions TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Batches Table
CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trek_id UUID REFERENCES public.treks(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_slots INTEGER DEFAULT 15,
    booked_slots INTEGER DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'open', -- 'open' | 'fast_filling' | 'sold_out'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_ref VARCHAR(50) UNIQUE NOT NULL,
    trek_id UUID REFERENCES public.treks(id),
    batch_id UUID REFERENCES public.batches(id),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50) NOT NULL,
    total_trekkers INTEGER DEFAULT 1,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'paid' | 'cancelled'
    emergency_contact VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Inquiries / Contact Form Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    destination VARCHAR(100),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new', -- 'new' | 'contacted' | 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.treks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Read policies for public
CREATE POLICY "Public read treks" ON public.treks FOR SELECT USING (true);
CREATE POLICY "Public read batches" ON public.batches FOR SELECT USING (true);
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- ========================================================
-- Seed Initial Treks (Shimla & Dehradun)
-- ========================================================
INSERT INTO public.treks (title, slug, region, location, duration, altitude, difficulty, price, image_url, tag, description)
VALUES 
(
    'Nag Tibba Weekend Trek',
    'nag-tibba-weekend-trek',
    'dehradun',
    'Dehradun / Pantwari Base',
    '2 Days / 1 Night',
    '9,915 ft',
    'Easy - Moderate',
    2499.00,
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    'Best for Beginners',
    'Highest peak in the lesser Himalayan region of Uttarakhand with breathtaking views of Bandarpoonch, Swargarohini, and Gangotri peaks.'
),
(
    'Hatu Peak & Alpine Ridge',
    'hatu-peak-alpine-ridge',
    'shimla',
    'Narkanda / Shimla Foothills',
    '2 Days / 1 Night',
    '11,150 ft',
    'Easy',
    2799.00,
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'Scenic Panorama',
    'Surrounded by dense deodar and apple orchards in Narkanda, offering a 360-degree panorama of the snow-clad peaks.'
),
(
    'Kedarkantha Summit Expedition',
    'kedarkantha-summit-expedition',
    'dehradun',
    'Sankri / Govind National Park',
    '5 Days / 4 Nights',
    '12,500 ft',
    'Moderate',
    6999.00,
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    'Top Winter Trek',
    'Indias undisputed champion of winter snow treks, featuring the stunning Juda Ka Talab alpine lake and a thrilling summit push.'
),
(
    'Churdhar Sanctuary Trek',
    'churdhar-sanctuary-trek',
    'shimla',
    'Nohradhar / Shimla Base',
    '3 Days / 2 Nights',
    '11,965 ft',
    'Moderate',
    3499.00,
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    'Highest Shivalik Peak',
    'The highest peak in the outside Himalayan range with the revered shrine of Shirgul Maharaj on the summit ridge.'
)
ON CONFLICT (slug) DO NOTHING;
