-- ========================================================
-- TrekToShikhar: Full Treks & Expeditions Catalog Schema (PostgreSQL for Supabase)
-- Module 2: Treks, Itineraries, Packages, Why-Must-Do & Gear List
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing table if recreating cleanly
-- DROP TABLE IF EXISTS public.treks CASCADE;

-- 3. Create treks Table with rich JSONB arrays for complete dynamic control
CREATE TABLE IF NOT EXISTS public.treks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline TEXT,
    region VARCHAR(50) NOT NULL, -- 'dehradun' | 'shimla' | etc.
    location VARCHAR(255) NOT NULL,
    base_camp VARCHAR(255) NOT NULL,
    route VARCHAR(255) DEFAULT 'Base to Base',
    duration VARCHAR(100) NOT NULL,
    altitude VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    grade VARCHAR(100) DEFAULT 'Beginner Friendly',
    distance VARCHAR(100) DEFAULT '16 km Total Trek',
    best_season VARCHAR(100) DEFAULT 'Oct - May',
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    tag VARCHAR(100) DEFAULT 'Best for Beginners',
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 120,
    hero_images JSONB DEFAULT '[]'::jsonb,
    overview TEXT,
    why_must_do JSONB DEFAULT '[]'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    packages JSONB DEFAULT '[]'::jsonb,
    inclusions JSONB DEFAULT '[]'::jsonb,
    exclusions JSONB DEFAULT '[]'::jsonb,
    gear_list JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 1,
    is_featured BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.treks ENABLE ROW LEVEL SECURITY;

-- 5. Public and Admin Policies
CREATE POLICY "Public read treks" 
ON public.treks 
FOR SELECT 
USING (true);

CREATE POLICY "Admin full access treks" 
ON public.treks 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 6. Insert Seed Data: Nag Tibba, Hatu Peak, Kedarkantha, Churdhar
INSERT INTO public.treks (
    slug, title, tagline, region, location, base_camp, route, 
    duration, altitude, difficulty, grade, distance, best_season, 
    price, original_price, tag, rating, reviews_count, hero_images, 
    overview, why_must_do, itinerary, packages, inclusions, exclusions, gear_list, 
    display_order, is_featured, is_active
) VALUES 
(
    'nag-tibba-weekend-trek',
    'Nag Tibba Weekend Trek',
    'The Serpent''s Peak — Best Snow Weekend Trek Near Dehradun',
    'dehradun',
    'Dehradun / Mussoorie Base',
    'Pantwari Village',
    'Dehradun to Dehradun',
    '2 Days / 1 Night',
    '9,915 ft',
    'Easy - Moderate',
    'Beginner Friendly',
    '16 km Total Trek',
    'Oct – May (Snow in Dec–Feb)',
    2499,
    3499,
    'Best for Beginners',
    4.9,
    340,
    '["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85", "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1920&q=85", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85"]'::jsonb,
    'Nag Tibba (''Serpent''s Peak'') is the highest peak in the lower Garhwal Himalayas of Uttarakhand. Perched at 9,915 ft, it offers sweeping 360-degree views of Bandarpoonch, Swargarohini, Gangotri, and Kedarnath ranges. Perfect for working professionals from Delhi, Chandigarh, and Dehradun seeking a 2-day high-altitude adventure.',
    '[
      {"title": "Spectacular 360° Garhwal Panorama", "desc": "Gaze directly at the Himalayan giants including Swargarohini, Bandarpoonch, Black Peak, and Kedarnath peak from the Nag Tibba summit."},
      {"title": "Dense Oak & Rhododendron Canopies", "desc": "Walk through ancient moss-draped forest trails that bloom into fiery crimson rhododendrons in spring and snow wonderland in winter."},
      {"title": "Nag Devta Ancient Temple Sanctuary", "desc": "Experience mountain folk spirituality at the revered Nag Devta temple nestled amidst alpine clearing with centuries of Himalayan folklore."},
      {"title": "Zero Leaves Required (Weekend Escape)", "desc": "Leave Delhi/Dehradun on Friday evening, conquer a 10,000 ft Himalayan summit over Saturday and Sunday, and return refreshed on Monday."},
      {"title": "Ideal First-Timer Summit Experience", "desc": "Gentle ascending gradients with certified NIM leaders make it the safest introductory snow trek in India."}
    ]'::jsonb,
    '[
      {
        "day": "Day 1",
        "title": "Drive Dehradun to Pantwari & Trek to Nag Tibba Base Camp",
        "distance": "85 km Drive + 4.5 km Trek",
        "altitude": "Pantwari (4,640 ft) to Base Camp (7,600 ft)",
        "time": "3.5 hrs drive + 4 hrs trek",
        "highlights": "Kempty Falls drive, oak forests, Goat Village, sunset over Shivalik ranges.",
        "stay": "4-Season Alpine Dome Tents at Nag Tibba Base Camp",
        "meals": "Packed Lunch, Evening Mountain Snacks & Hot Dinner"
      },
      {
        "day": "Day 2",
        "title": "Summit Push to Nag Tibba (9,915 ft) & Descent to Pantwari, Drive to Dehradun",
        "distance": "3.5 km Summit Trek + 8 km Descent + 85 km Drive",
        "altitude": "Base Camp (7,600 ft) to Summit (9,915 ft) to Dehradun",
        "time": "6 hrs trek + 3.5 hrs drive",
        "highlights": "Early sunrise at summit, Himalayan ridge walk, Nag Devta temple, drive back to Dehradun by 7:30 PM.",
        "stay": "Expedition ends at Dehradun Railway Station / ISBT",
        "meals": "Early Morning Tea, Summit Packed Breakfast & Hot Lunch at Base"
      }
    ]'::jsonb,
    '[
      {
        "name": "Pantwari to Pantwari",
        "price": 2499,
        "badge": "Most Popular",
        "desc": "Ideal if you have your own vehicle or are joining us directly at Pantwari base.",
        "duration": "2 Days / 1 Night",
        "includes": ["All meals on trek", "Dome tents & sleeping bags", "NIM certified trek guide", "Forest permits & safety kit"]
      },
      {
        "name": "Dehradun to Dehradun",
        "price": 3499,
        "badge": "All-Inclusive Transport",
        "desc": "Includes round-trip private shared transport from Dehradun Railway Station.",
        "duration": "2 Days / 1 Night",
        "includes": ["Shared pickup & drop from Dehradun", "All meals on trek", "Dome tents & sleeping bags", "NIM certified trek guide", "Forest permits"]
      }
    ]'::jsonb,
    '[
      "Certified Wilderness First Responder (NIM / ABVIMAS) trek leader",
      "High-altitude 4-season waterproof dome tents on twin/triple sharing",
      "Sub-zero thermal sleeping bags (-10°C rated) and insulated foam mats",
      "All freshly prepared vegetarian meals (Day 1 Lunch to Day 2 Lunch)",
      "Medical first-aid box, portable pulse oximeter, and emergency oxygen cylinder",
      "Forest entry permits, camping fees, and sanctuary clearance",
      "Evening hot mountain soup, ginger lemon tea, and high-energy trail snacks"
    ]'::jsonb,
    '[
      "Transport from home city to Dehradun / Pantwari",
      "Personal backpack offloading on mules",
      "Personal trekking gear",
      "Emergency evacuation charges and personal travel insurance"
    ]'::jsonb,
    '[
      "Ankle-support trekking shoes with good grip",
      "Warm down jacket and thermal base layers",
      "Waterproof windcheater / poncho",
      "UV-protective polarized sunglasses",
      "2 water bottles (1 liter each)",
      "Headlamp or LED flashlight with extra batteries"
    ]'::jsonb,
    1, true, true
),
(
    'hatu-peak-alpine-ridge',
    'Hatu Peak & Alpine Ridge',
    'The Serene Cedar Sanctuary & Ancient Temple Peak of Shimla',
    'shimla',
    'Narkanda / Shimla Foothills',
    'Narkanda Foothills',
    'Shimla to Shimla',
    '2 Days / 1 Night',
    '11,150 ft',
    'Easy',
    'Scenic Family & Beginner',
    '14 km Total Ridge Walk',
    'All Year (Snow in Dec–Mar)',
    2799,
    3799,
    'Scenic Panorama',
    4.85,
    220,
    '["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85", "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1920&q=85"]'::jsonb,
    'Rising majestically above the apple capital of Narkanda, Hatu Peak stands as the second highest summit in Shimla district. Surrounded by dense Himalayan spruce, deodar cedars, and rolling apple orchards, this trail leads to the sacred wood-carved Hatu Mata Temple and offers panoramic views of the Kinnaur Kailash and Pir Panjal ranges.',
    '[
      {"title": "Ancient Wooden Hatu Mata Temple", "desc": "Marvel at the intricate Pahari woodwork of the summit temple dedicated to Mandodari and Kali at 11,150 ft."},
      {"title": "Apple Valley & Cedar Forest Trails", "desc": "Trek through world-famous Kotgarh apple country and ancient Himalayan deodar and fir trees."},
      {"title": "Kinnaur Kailash Range Vista", "desc": "Unobstructed views of snow-clad Greater Himalayan massifs including Shrikhand Mahadev and Kinnaur Kailash."}
    ]'::jsonb,
    '[
      {
        "day": "Day 1",
        "title": "Drive Shimla to Narkanda & Forest Walk to Gujjar Kotha",
        "distance": "65 km Drive + 4 km Trek",
        "altitude": "Shimla (7,200 ft) to Narkanda (8,880 ft) to Camp (9,600 ft)",
        "time": "2.5 hrs drive + 3 hrs trek",
        "highlights": "Hindustan-Tibet Road drive, dense pine forests, camping under starry alpine skies.",
        "stay": "Alpine Dome Tents near Narkanda Meadows",
        "meals": "Hot Mountain Lunch, Evening Tea & Snacks, Dinner"
      },
      {
        "day": "Day 2",
        "title": "Summit Push to Hatu Temple & Descent to Narkanda, Drive to Shimla",
        "distance": "5 km Summit Trek + 5 km Descent + 65 km Drive",
        "altitude": "Camp (9,600 ft) to Hatu Peak (11,150 ft) to Shimla",
        "time": "5 hrs trek + 2.5 hrs drive",
        "highlights": "360-degree snow panorama, Hatu Mata temple puja, apple orchard trail walk.",
        "stay": "Trip concludes at Shimla Old Bus Stand / ISBT",
        "meals": "Fresh Breakfast, Summit Trail Pack, Hot Lunch at Narkanda"
      }
    ]'::jsonb,
    '[
      {
        "name": "Narkanda to Narkanda",
        "price": 2799,
        "badge": "Base Camp Joiners",
        "desc": "Direct reporting at Narkanda base camp.",
        "duration": "2 Days / 1 Night",
        "includes": ["Camp meals", "Alpine tents & sleeping bags", "Certified guide", "Forest permits"]
      },
      {
        "name": "Shimla to Shimla",
        "price": 3899,
        "badge": "Full Transport Included",
        "desc": "Includes roundtrip private shared transfer from Shimla.",
        "duration": "2 Days / 1 Night",
        "includes": ["Shared transit from Shimla", "All camp meals", "Dome tents", "Forest permits"]
      }
    ]'::jsonb,
    '[
      "Certified Wilderness First Responder (NIM / ABVIMAS) trek leader",
      "High-altitude 4-season waterproof dome tents on twin/triple sharing",
      "Sub-zero thermal sleeping bags (-10°C rated) and insulated foam mats",
      "All freshly prepared vegetarian meals (Day 1 Lunch to Day 2 Lunch)",
      "Medical first-aid box, portable pulse oximeter, and emergency oxygen cylinder"
    ]'::jsonb,
    '[
      "Transport from home city to Shimla",
      "Personal backpack offloading on mules",
      "Personal trekking gear"
    ]'::jsonb,
    '[
      "Sturdy trekking shoes with ankle support",
      "Fleece jacket and warm windbreaker",
      "Water bottle and energy snacks",
      "Sun protection (hat, sunglasses, sunscreen)"
    ]'::jsonb,
    2, true, true
),
(
    'kedarkantha-summit-expedition',
    'Kedarkantha Summit Expedition',
    'India''s undisputed crown jewel of winter snow trekking',
    'dehradun',
    'Sankri / Govind Wildlife Sanctuary',
    'Sankri Base Village',
    'Dehradun to Dehradun',
    '5 Days / 4 Nights',
    '12,500 ft',
    'Moderate',
    'Classic Himalayan Snow',
    '20 km Total Trail',
    'Nov – April (Peak Snow Dec–Feb)',
    6999,
    8999,
    'Top Winter Trek',
    4.95,
    510,
    '["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85"]'::jsonb,
    'Standing tall at 12,500 ft within Govind Pashu Vihar National Park, Kedarkantha is India''s most iconic winter summit. Famous for its symmetrical pyramid summit peak, frozen Juda Ka Talab alpine lake, and 360-degree views of 13 Himalayan peaks including Swargarohini, Bandarpoonch, and Black Peak.',
    '[
      {"title": "Frozen Juda Ka Talab Alpine Lake", "desc": "Camp beside the mythical high-altitude lake surrounded by towering pine trees that completely freezes in peak winter."},
      {"title": "Pyramid Summit Push at Sunrise", "desc": "Climb the final snow ridge under starry skies to watch golden sunrise illuminate 13 Himalayan peaks."},
      {"title": "Thrilling Snow Glides on Descent", "desc": "Safely slide down gentle snow slopes guided by certified mountaineers on your descent to base camp."}
    ]'::jsonb,
    '[
      {
        "day": "Day 1",
        "title": "Drive Dehradun to Sankri Base Village",
        "distance": "195 km Drive",
        "altitude": "Dehradun (1,466 ft) to Sankri (6,400 ft)",
        "time": "7-8 hrs drive",
        "highlights": "Scenic drive along Yamuna and Tons rivers through Mori pine valleys.",
        "stay": "Traditional Himalayan Homestay / Guest House at Sankri",
        "meals": "Dinner at Sankri Base Camp"
      },
      {
        "day": "Day 2",
        "title": "Trek Sankri to Juda Ka Talab",
        "distance": "4 km Trek",
        "altitude": "Sankri (6,400 ft) to Juda Ka Talab (9,100 ft)",
        "time": "4-5 hrs trek",
        "highlights": "Ancient oak forests, wooden bridges, frozen alpine lake clearing.",
        "stay": "4-Season High Altitude Alpine Tents beside Juda Ka Talab",
        "meals": "Breakfast at Sankri, Trail Snacks, Hot Camp Dinner"
      },
      {
        "day": "Day 3",
        "title": "Trek Juda Ka Talab to Kedarkantha Base Camp",
        "distance": "4 km Trek",
        "altitude": "Juda Ka Talab (9,100 ft) to KK Base Camp (11,250 ft)",
        "time": "3-4 hrs trek",
        "highlights": "Open snow meadows, breathtaking panorama of Swargarohini and Bandarpoonch.",
        "stay": "Snow Camping at Kedarkantha Base Camp",
        "meals": "Breakfast, Hot Lunch, Evening Mountain Tea & Snacks, Dinner"
      },
      {
        "day": "Day 4",
        "title": "Summit Push to Kedarkantha (12,500 ft) & Descend to Hargaon / Sankri",
        "distance": "6 km Summit + 4 km Descent",
        "altitude": "Base (11,250 ft) to Summit (12,500 ft) to Hargaon (8,900 ft)",
        "time": "6-7 hrs trek",
        "highlights": "Pre-dawn 3:30 AM summit push, 360-degree sunrise view, Trishul Shiva shrine at summit.",
        "stay": "Alpine Tents at Hargaon / Sankri Homestay",
        "meals": "Early Morning Energy Drink, Packed Summit Breakfast, Hot Lunch, Dinner"
      },
      {
        "day": "Day 5",
        "title": "Drive Sankri to Dehradun",
        "distance": "195 km Drive",
        "altitude": "Sankri (6,400 ft) to Dehradun (1,466 ft)",
        "time": "7-8 hrs drive",
        "highlights": "Conclude expedition, drop-off at Dehradun Railway Station by 6:30 PM.",
        "stay": "Trip concludes at Dehradun",
        "meals": "Breakfast at Sankri Homestay"
      }
    ]'::jsonb,
    '[
      {
        "name": "Sankri to Sankri",
        "price": 6999,
        "badge": "Base Camp Joiners",
        "desc": "Direct reporting at Sankri Village base camp.",
        "duration": "5 Days / 4 Nights",
        "includes": ["4-season alpine tents", "All fresh meals on trek", "Certified NIM trek leads", "Microspikes & gaiters", "Forest permits"]
      },
      {
        "name": "Dehradun to Dehradun",
        "price": 8999,
        "badge": "All-Inclusive Transport",
        "desc": "Includes roundtrip private shared transfer from Dehradun Railway Station.",
        "duration": "5 Days / 4 Nights",
        "includes": ["Roundtrip transport from Dehradun", "All meals on trek", "Dome tents & sleeping bags", "NIM certified trek guide", "Forest permits", "Microspikes & gaiters"]
      }
    ]'::jsonb,
    '[
      "Certified Wilderness First Responder (NIM / ABVIMAS) trek leader",
      "High-altitude 4-season waterproof dome tents on twin/triple sharing",
      "Sub-zero thermal sleeping bags (-10°C rated) and insulated foam mats",
      "Microspikes and high-ankle snow gaiters for summit ridge safety",
      "All freshly prepared vegetarian meals on trail (3 meals daily + hot evening soup)",
      "Medical first-aid box, portable pulse oximeter, and emergency oxygen cylinder",
      "Govind Wildlife Sanctuary permits, camping fees, and environmental clearance"
    ]'::jsonb,
    '[
      "Transport from home city to Dehradun",
      "Personal backpack offloading on mules (available on request)",
      "Personal clothing, warm jacket, and trekking gear",
      "Insurance and emergency evacuation charges"
    ]'::jsonb,
    '[
      "Waterproof trekking shoes with deep groove grip",
      "Down feather jacket (-5°C rated) and 2 thermal inner layers",
      "Waterproof trekking pants and quick-dry t-shirts",
      "Fleece gloves + waterproof outer mittens",
      "Polarized UV sunglasses with category-3 protection",
      "2 insulated water bottles (1 liter each) + thermos flask",
      "Headlamp with fresh batteries + high-capacity power bank"
    ]'::jsonb,
    3, true, true
),
(
    'churdhar-sanctuary-trek',
    'Churdhar Sanctuary Trek',
    'The Highest Peak in the Outside Himalayas with Ancient Shiva Monolith',
    'shimla',
    'Chopal / Shimla Base',
    'Nohradhar Base Village',
    'Shimla to Shimla',
    '3 Days / 2 Nights',
    '11,965 ft',
    'Moderate',
    'Spiritual & Rugged Ridge',
    '32 km Total Trek',
    'April – Nov (Closed in Deep Winter Snow)',
    3499,
    4999,
    'Highest Shivalik Peak',
    4.9,
    180,
    '["https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1920&q=85", "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1920&q=85"]'::jsonb,
    'Churdhar (11,965 ft) is the highest peak in the southern Shivalik outer Himalayas. Famed for its massive granite stone monolith of Lord Shiva overlooking the valleys of Shimla, Sirmaur, and Solan. Walk through protected wildlife sanctuary trails inhabited by the Himalayan monal pheasant and barking deer.',
    '[
      {"title": "Colossal Granite Shiva Monolith", "desc": "Stand beside the sacred open-air Shiva idol perched on the rugged windswept granite summit crest."},
      {"title": "Churdhar Wildlife Sanctuary Canopy", "desc": "Home to the vibrant state bird Himalayan Monal, musk deer, and ancient deodar groves."},
      {"title": "Unrivaled 360-degree Shivalik Horizons", "desc": "Look out over the glittering lights of Shimla, Kalka, and the Sutlej river gorge."}
    ]'::jsonb,
    '[
      {
        "day": "Day 1",
        "title": "Drive Shimla / Solan to Nohradhar Base & Trek to Jam Nallah",
        "distance": "110 km Drive + 7 km Trek",
        "altitude": "Shimla (7,200 ft) to Nohradhar (6,800 ft) to Jam Nallah (9,400 ft)",
        "time": "4 hrs drive + 4 hrs trek",
        "highlights": "Giri river crossing, cedar forests, rocky trail.",
        "stay": "Alpine Dome Tents at Jam Nallah Meadow",
        "meals": "Packed Lunch, Hot Dinner at Camp"
      },
      {
        "day": "Day 2",
        "title": "Jam Nallah to Churdhar Summit (11,965 ft) & Return to Teesri",
        "distance": "9 km Summit Push + 4 km Descent",
        "altitude": "Jam Nallah (9,400 ft) to Summit (11,965 ft) to Teesri (10,100 ft)",
        "time": "7-8 hrs trek",
        "highlights": "Granite boulders, ancient Shirgul Maharaj temple, Shiva monolith summit.",
        "stay": "High-Altitude Tents at Teesri Ridge",
        "meals": "Fresh Breakfast, Summit Trail Pack, Hot Dinner"
      },
      {
        "day": "Day 3",
        "title": "Descent to Nohradhar & Drive Back to Shimla / Solan",
        "distance": "9 km Descent + 110 km Drive",
        "altitude": "Teesri (10,100 ft) to Nohradhar (6,800 ft) to Shimla",
        "time": "4 hrs descent + 4 hrs drive",
        "highlights": "Morning descent through deodar forest, drop-off at Shimla / Solan.",
        "stay": "Trip concludes",
        "meals": "Breakfast at Camp, Lunch at Nohradhar"
      }
    ]'::jsonb,
    '[
      {
        "name": "Nohradhar to Nohradhar",
        "price": 3499,
        "badge": "Base Joiners",
        "desc": "Reporting directly at Nohradhar base.",
        "duration": "3 Days / 2 Nights",
        "includes": ["Camp meals", "Alpine tents & sleeping bags", "Forest permits", "Certified guide"]
      },
      {
        "name": "Shimla to Shimla",
        "price": 4999,
        "badge": "Transport Included",
        "desc": "Includes roundtrip private shared transfer from Shimla.",
        "duration": "3 Days / 2 Nights",
        "includes": ["Roundtrip transport from Shimla", "All camp meals", "Dome tents & sleeping bags", "Certified guide", "Sanctuary permits"]
      }
    ]'::jsonb,
    '[
      "Certified Wilderness First Responder (NIM / ABVIMAS) trek leader",
      "High-altitude 4-season waterproof dome tents on twin/triple sharing",
      "Sub-zero thermal sleeping bags (-10°C rated) and insulated foam mats",
      "All freshly prepared vegetarian meals (Day 1 Lunch to Day 3 Lunch)",
      "Medical first-aid box, portable pulse oximeter, and emergency oxygen cylinder",
      "Sanctuary permits, camping fees, and environmental clearance"
    ]'::jsonb,
    '[
      "Transport from home city to Shimla",
      "Personal backpack offloading on mules",
      "Personal trekking gear and items"
    ]'::jsonb,
    '[
      "Sturdy trekking boots with ankle support",
      "Thermal base layers and down jacket",
      "Rain poncho or waterproof jacket",
      "Headlamp with spare batteries",
      "Personal water bottle and dry fruits"
    ]'::jsonb,
    4, true, true
);
