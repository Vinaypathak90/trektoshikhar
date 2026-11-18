-- ========================================================
-- TrekToShikhar: Why Choose Section & Animated Stats Table
-- Global Reusable Section controlled via Admin Dashboard
-- ========================================================

-- 1. Create why_choose_section table (Singleton global config + JSONB stats array)
CREATE TABLE IF NOT EXISTS public.why_choose_section (
    id TEXT PRIMARY KEY DEFAULT 'global',
    badge_text VARCHAR(150) DEFAULT 'TRUSTED HIMALAYAN EXPEDITION LEADER',
    title VARCHAR(255) NOT NULL DEFAULT 'Why Choose TrekToShikhar?',
    subtitle TEXT NOT NULL DEFAULT 'Trusted by over 5 Lakh trekkers and recognized by leading adventure bodies.',
    is_active BOOLEAN DEFAULT true,
    stats JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.why_choose_section ENABLE ROW LEVEL SECURITY;

-- 3. Policies
DROP POLICY IF EXISTS "Public read why_choose_section" ON public.why_choose_section;
CREATE POLICY "Public read why_choose_section"
ON public.why_choose_section
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Full access why_choose_section" ON public.why_choose_section;
CREATE POLICY "Full access why_choose_section"
ON public.why_choose_section
FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Seed Default Global Data
INSERT INTO public.why_choose_section (
    id,
    badge_text,
    title,
    subtitle,
    is_active,
    stats
) VALUES (
    'global',
    'TRUSTED HIMALAYAN EXPEDITION LEADER',
    'Why Choose TrekToShikhar?',
    'Trusted by over 5 Lakh trekkers and recognized by leading adventure bodies.',
    true,
    '[
      {
        "id": "stat-1",
        "icon": "Users",
        "target_number": 500000,
        "prefix": "",
        "suffix": "+",
        "label": "Happy Trekkers",
        "sublabel": "Across 60+ destinations",
        "is_highlighted": true
      },
      {
        "id": "stat-2",
        "icon": "Mountain",
        "target_number": 100,
        "prefix": "",
        "suffix": "+",
        "label": "Treks",
        "sublabel": "Multiple regions",
        "is_highlighted": false
      },
      {
        "id": "stat-3",
        "icon": "Trophy",
        "target_number": 20,
        "prefix": "",
        "suffix": "+",
        "label": "Awards",
        "sublabel": "Industry recognition",
        "is_highlighted": false
      },
      {
        "id": "stat-4",
        "icon": "Clock",
        "target_number": 16,
        "prefix": "",
        "suffix": "+",
        "label": "Years",
        "sublabel": "Of safe adventures",
        "is_highlighted": false
      },
      {
        "id": "stat-5",
        "icon": "Sprout",
        "target_number": 1238,
        "prefix": "",
        "suffix": "+",
        "label": "Heal Himalaya",
        "sublabel": "Cleanup drives conducted successfully",
        "is_highlighted": false
      }
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
