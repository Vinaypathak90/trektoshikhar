import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { 
  Mountain, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Award, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  Compass,
  CheckCircle2,
  ChevronRight,
  Camera,
  BookOpen,
  Tent,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState('all');

  const treks = [
    {
      id: 1,
      title: "Nag Tibba Weekend Trek",
      region: "dehradun",
      location: "Dehradun / Mussoorie Base",
      duration: "2 Days / 1 Night",
      altitude: "9,915 ft",
      difficulty: "Easy - Moderate",
      price: "₹2,499",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      tag: "Best for Beginners"
    },
    {
      id: 2,
      title: "Hatu Peak & Alpine Ridge",
      region: "shimla",
      location: "Narkanda / Shimla Foothills",
      duration: "2 Days / 1 Night",
      altitude: "11,150 ft",
      difficulty: "Easy",
      price: "₹2,799",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      tag: "Scenic Panorama"
    },
    {
      id: 3,
      title: "Kedarkantha Summit Expedition",
      region: "dehradun",
      location: "Sankri / Govind Wildlife",
      duration: "5 Days / 4 Nights",
      altitude: "12,500 ft",
      difficulty: "Moderate",
      price: "₹6,999",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      tag: "Top Winter Trek"
    },
    {
      id: 4,
      title: "Churdhar Sanctuary Trek",
      region: "shimla",
      location: "Chopal / Shimla Base",
      duration: "3 Days / 2 Nights",
      altitude: "11,965 ft",
      difficulty: "Moderate",
      price: "₹3,499",
      image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",
      tag: "Highest Shivalik Peak"
    }
  ];

  const galleryImages = [
    { title: "Kedarkantha Sunrise Summit", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
    { title: "Nag Tibba Base Camp Fire", url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80" },
    { title: "Shimla Snow Ridge Walk", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" },
    { title: "Alpine Tent Life", url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80" },
    { title: "Churdhar Peak Silhouette", url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80" },
    { title: "Dehradun Forest Trails", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80" },
  ];

  const blogs = [
    {
      id: 1,
      title: "First Time Trekking in Himalayas? Top 7 Rookie Mistakes to Avoid",
      readTime: "4 min read",
      category: "Guide",
      date: "Nov 2026",
      snippet: "From packing heavy cotton sweaters to ignoring hydration: here is everything certified guides want you to know before your first mountain trip."
    },
    {
      id: 2,
      title: "Why Nag Tibba & Hatu Peak are India's Best Weekend Escapes",
      readTime: "5 min read",
      category: "Destinations",
      date: "Oct 2026",
      snippet: "Quick access from Delhi, Chandigarh, and Dehradun with zero leaves required. Experience real 10,000 ft snowscapes in 48 hours."
    },
    {
      id: 3,
      title: "Essential Winter Trek Gear Checklist: The 3-Layer System",
      readTime: "6 min read",
      category: "Gear",
      date: "Oct 2026",
      snippet: "How base layers, fleece insulation, and waterproof windbreakers keep you toasty even at sub-zero summit temperatures."
    }
  ];

  const filteredTreks = selectedRegion === 'all' 
    ? treks 
    : treks.filter(t => t.region === selectedRegion);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] selection:bg-[#E5383B] selection:text-white">
      {/* 1. TOP NAVBAR */}
      <Navbar onBookClick={() => scrollToSection('treks')} />

      {/* 2. DYNAMIC HERO SECTION WITH RIGHT-TO-LEFT MOVING ZOOMABLE IMAGES */}
      <Hero 
        onExploreClick={() => scrollToSection('treks')}
        onAboutClick={() => scrollToSection('about-us')}
      />

      {/* 3. BIG BOLD RED BANNER WITH STATS */}
      <section id="red-section" className="bg-[#E5383B] py-20 px-6 text-white text-center relative z-10 shadow-inner">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-white/80 bg-white/10 px-4 py-1.5 rounded-full mb-4">
            • 100% Certified Himalayan Mountaineers •
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Built for Wanderers, Backed by Certified Mountain Safety
          </h2>
          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We eliminate the stress of mountain logistics. Medical kits, high-altitude gear, local forest permits, and warm alpine meals are all covered.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black">15+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80 mt-1">Himalayan Summits</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black">2,400+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80 mt-1">Trekkers Guided</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black">100%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80 mt-1">Certified Leaders</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black">4.9 ★</p>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80 mt-1">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TREKS SECTION (#treks) */}
      <section id="treks" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Curated Mountain Itineraries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight">
              Featured Mountain Treks
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Select your preferred base camp in Shimla or Dehradun to view upcoming batch dates.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="inline-flex p-1 bg-neutral-100 rounded-xl border border-neutral-200/80 text-xs font-bold self-start md:self-auto">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedRegion === 'all' 
                  ? 'bg-white text-[#0A0A0A] shadow-xs' 
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              All Treks
            </button>
            <button
              onClick={() => setSelectedRegion('dehradun')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedRegion === 'dehradun' 
                  ? 'bg-white text-[#E5383B] shadow-xs' 
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Dehradun Base
            </button>
            <button
              onClick={() => setSelectedRegion('shimla')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedRegion === 'shimla' 
                  ? 'bg-white text-[#E5383B] shadow-xs' 
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Shimla Base
            </button>
          </div>
        </div>

        {/* Treks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTreks.map((trek) => (
            <div
              key={trek.id}
              className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <img
                    src={trek.image}
                    alt={trek.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/95 backdrop-blur-md text-[#0A0A0A] shadow-xs">
                    {trek.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-xs font-black bg-[#E5383B] text-white shadow-md">
                    {trek.price} <span className="text-[10px] font-normal opacity-90">/person</span>
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E5383B]" />
                    <span className="truncate">{trek.location}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-[#0A0A0A] group-hover:text-[#E5383B] transition-colors mb-3">
                    {trek.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{trek.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mountain className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{trek.altitude}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => alert(`Selected trek: ${trek.title}. Booking slot module coming in next step!`)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-[#E5383B] hover:text-white transition-all flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                >
                  <span>Book Batch Slot</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ABOUT US SECTION (#about-us) */}
      <section id="about-us" className="py-24 px-4 sm:px-6 bg-neutral-50/70 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>Our Heritage & Philosophy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight mb-5">
                We believe the summit belongs to everyone willing to walk.
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                TrekToShikhar was founded with a singular purpose: connecting city wanderers to pristine Himalayan trails without compromising on safety, hospitality, or local environmental ethics.
              </p>

              <div className="space-y-3.5">
                {[
                  "NIM & ABVIMAS Certified Himalayan Mountaineering Leaders",
                  "Medical Grade Safety: High-altitude oxygen cylinders & pulse monitors",
                  "All-inclusive mountain equipment (High-altitude tents, sub-zero sleeping bags)",
                  "Strict Leave No Trace (LNT) eco-friendly trail conservation"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E5383B]/10 text-[#E5383B] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-neutral-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-[#E5383B] mb-3" />
                  <h4 className="font-bold text-base text-[#0A0A0A] mb-1">Safety First</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Zero compromise on medical and altitude acclimatization checks.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
                  <Tent className="w-8 h-8 text-neutral-800 mb-3" />
                  <h4 className="font-bold text-base text-[#0A0A0A] mb-1">Alpine Camps</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Clean waterproof dual-layer tents with thermal sleeping mats.
                  </p>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
                  <Users className="w-8 h-8 text-[#E5383B] mb-3" />
                  <h4 className="font-bold text-base text-[#0A0A0A] mb-1">Small Groups</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Max 12-15 trekkers per batch for personal guidance & safety.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0A0A0A] text-white shadow-xl">
                  <HeartHandshake className="w-8 h-8 text-[#E5383B] mb-3" />
                  <h4 className="font-bold text-base text-white mb-1">Local Sherpas</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Direct local employment to mountain villages in Himachal & Uttarakhand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY SECTION (#gallery) */}
      <section id="gallery" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Real Moments From The Trails</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight mb-3">
            Glimpses from the Shikhar
          </h2>
          <p className="text-neutral-500 text-sm">
            Actual snapshots captured by our trekkers across Dehradun, Shimla, and Himalayan summits.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx}
              className="relative group rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-sm"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs font-bold text-white tracking-wide">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BLOG SECTION (#blog) */}
      <section id="blog" className="py-24 px-4 sm:px-6 bg-neutral-50/70 border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Mountain Knowledge</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight">
                Trekking Insights & Guides
              </h2>
              <p className="text-neutral-500 text-sm mt-1">
                Expert tips on altitude, packing gear, fitness routines, and weather patterns.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
                    <span className="font-bold text-[#E5383B] uppercase">{b.category}</span>
                    <span>{b.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-[#0A0A0A] mb-2 leading-snug hover:text-[#E5383B] transition-colors cursor-pointer">
                    {b.title}
                  </h3>
                  <p className="text-neutral-500 text-xs leading-relaxed mb-4">
                    {b.snippet}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-400">{b.date}</span>
                  <span className="text-xs font-bold text-[#E5383B] flex items-center gap-1 cursor-pointer">
                    Read Article <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-neutral-200/80 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-neutral-200" />
            <div>
              <span className="font-black text-base text-[#0A0A0A]">
                TrekTo<span className="text-[#E5383B]">Shikhar</span>
              </span>
              <p className="text-xs text-neutral-500">From the foothills to the summit.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-neutral-600">
            <a href="#home" className="hover:text-black">Home</a>
            <a href="#about-us" className="hover:text-black">About Us</a>
            <a href="#treks" className="hover:text-black">Treks</a>
            <a href="#gallery" className="hover:text-black">Gallery</a>
            <a href="#blog" className="hover:text-black">Blog</a>
          </div>

          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} TrekToShikhar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
