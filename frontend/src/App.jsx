import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrekDetailPage from './components/TrekDetailPage';
import AllTreksPage from './components/AllTreksPage';
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import BookingModal from './components/BookingModal';
import TrekCard from './components/TrekCard';
import GoogleReviewsMarquee from './components/GoogleReviewsMarquee';
import FloatingContactButtons from './components/FloatingContactButtons';
import AdminDashboard from './admindashboard/AdminDashboard';
import { TREKS } from './data/treksData';
import { getTreks, getCachedTreks } from './lib/trekApi';
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
  HeartHandshake,
  MessageSquare,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

// ----------------------------------------------------------------------
// HOMEPAGE COMPONENT (Hero, Safety Features, Featured Treks, About Teaser, Gallery, Blog)
// ----------------------------------------------------------------------
function HomePage({ onSelectTrek, onBookTrek }) {
  const navigate = useNavigate();
  const [liveTreks, setLiveTreks] = useState(() => getCachedTreks() || TREKS);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  // Fetch live treks from Supabase API
  useEffect(() => {
    let isMounted = true;
    async function loadTreksData() {
      try {
        const res = await getTreks({ admin: false });
        if (res && res.treks && res.treks.length > 0 && isMounted) {
          setLiveTreks(res.treks);
        }
      } catch (e) {
        console.warn('Using local fallback treks on homepage:', e);
      }
    }
    loadTreksData();
    return () => { isMounted = false; };
  }, []);

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
    ? liveTreks 
    : liveTreks.filter(t => t.region === selectedRegion);

  // Maximum 9 treks on Homepage loaded progressively in batches of 3
  const maxHomeTreks = Math.min(9, filteredTreks.length);
  const hasMoreToLoad = visibleCount < maxHomeTreks;
  const isAllLoaded = visibleCount >= maxHomeTreks;
  const isPendingRef = useRef(false);

  // Reset to initial 3 cards when region filter tab changes
  useEffect(() => {
    setVisibleCount(3);
    isPendingRef.current = false;
  }, [selectedRegion]);

  // Silky Smooth Infinite Scroll: Triggers 450px in advance using RAF (Zero stutter)
  useEffect(() => {
    if (!hasMoreToLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isPendingRef.current) {
          isPendingRef.current = true;
          window.requestAnimationFrame(() => {
            setVisibleCount((prev) => {
              const next = Math.min(prev + 3, maxHomeTreks);
              setTimeout(() => {
                isPendingRef.current = false;
              }, 200);
              return next;
            });
          });
        }
      },
      { rootMargin: '450px', threshold: 0.01 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMoreToLoad, maxHomeTreks]);

  return (
    <>
      {/* 1. DYNAMIC HERO SECTION WITH LUXURY RIGHT-TO-LEFT ZOOMABLE IMAGES */}
      <Hero 
        onExploreClick={() => {
          navigate('/track');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAboutClick={() => {
          navigate('/about');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. FEATURED MOUNTAIN TREKS CATALOG SECTION (#treks) - Placed directly below Hero */}
      <section id="treks" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Curated Mountain Itineraries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight font-outfit">
              Featured Mountain Treks
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Scroll down to discover more treks dynamically. Hover for rich image zoom &amp; altitude specs.
            </p>
          </div>

          {/* Top Right Controls: Region Filter Tabs + Direct All Treks Link */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Region Tabs */}
            <div className="inline-flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200/80 text-xs font-bold self-start md:self-auto shadow-2xs">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  selectedRegion === 'all' 
                    ? 'bg-white text-[#0A0A0A] shadow-xs' 
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                All Treks
              </button>
              <button
                onClick={() => setSelectedRegion('dehradun')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  selectedRegion === 'dehradun' 
                    ? 'bg-white text-[#E5383B] shadow-xs' 
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Dehradun Base
              </button>
              <button
                onClick={() => setSelectedRegion('shimla')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  selectedRegion === 'shimla' 
                    ? 'bg-white text-[#E5383B] shadow-xs' 
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Shimla Base
              </button>
            </div>

            {/* Direct Header Link to Full Catalog */}
            <button
              onClick={() => {
                navigate('/track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase tracking-wider shadow-[0_6px_20px_rgba(229,56,59,0.35)] hover:bg-neutral-950 hover:from-neutral-950 hover:to-neutral-950 hover:text-[#FFD700] hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <span>Explore All Treks</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Treks Grid: 3-column progressive layout (Row 1: 3 -> Row 2: 6 -> Row 3: 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredTreks.slice(0, visibleCount).map((trek, idx) => {
            const isNewBatch = idx >= visibleCount - 3 && visibleCount > 3;
            return (
              <div 
                key={trek.id}
                className={isNewBatch ? "reveal-card" : "transform-gpu"}
                style={isNewBatch ? { animationDelay: `${(idx % 3) * 60}ms` } : undefined}
              >
                <TrekCard
                  trek={trek}
                  onSelectTrek={onSelectTrek}
                  onBookTrek={onBookTrek}
                />
              </div>
            );
          })}
        </div>

        {/* Smooth Pre-fetching Sentinel (Silent & Seamless without jump) */}
        {hasMoreToLoad && (
          <div ref={sentinelRef} className="py-6 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-[#E5383B] animate-spin opacity-40" />
          </div>
        )}

        {/* ====================================================================
            STYLISH EXPEDITION ARCHIVES CTA BANNER
            (Appears when all 9 homepage treks are reached, redirecting to /track)
           ==================================================================== */}
        {isAllLoaded && (
          <div className="mt-14 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-950 via-[#180406] to-neutral-950 border border-[#E5383B]/35 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 animate-editorial-fade">
            {/* Ambient Red Glow Backdrop */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background: 'radial-gradient(circle at 85% 50%, rgba(229,56,59,0.55) 0%, transparent 65%)'
              }}
            />

            <div className="text-left max-w-xl relative z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#FFD700] mb-3 bg-white/10 px-4 py-1.5 rounded-full border border-[#FFD700]/30 backdrop-blur-md">
                <Compass className="w-4 h-4 text-[#FFD700]" />
                <span>25+ Certified Mountain Expeditions</span>
              </span>
              <h3 className="text-2xl sm:text-4xl font-black font-outfit text-white leading-tight">
                Haven't Found Your Dream Trail Yet?
              </h3>
              <p className="text-neutral-300 text-xs sm:text-sm mt-2.5 leading-relaxed">
                Filter by altitude, season, difficulty, or explore exclusive winter snow departures across <strong>Shimla</strong> and <strong>Dehradun</strong> Base Camps.
              </p>
            </div>

            {/* Stylish non-basic CTA button */}
            <button
              onClick={() => {
                navigate('/track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative z-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5383B] via-[#D90429] to-[#C1121F] hover:from-white hover:via-white hover:to-white hover:text-[#0A0A0A] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_12px_35px_rgba(229,56,59,0.5)] hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3 shrink-0 group border border-white/20"
            >
              <span>Unlock All Summit Expeditions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        )}
      </section>

      {/* 3. NEW PREMIUM CONTINUOUS ANIMATED GOOGLE REVIEWS SECTION (Reused directly below Trek Listing) */}
      <GoogleReviewsMarquee />

      {/* 4. COMPACT MODERN ABOUT TEASER (#about-us on Homepage) */}
      <section id="about-us" className="py-20 px-4 sm:px-6 bg-neutral-50/70 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-7 sm:p-12 border border-neutral-200/90 shadow-sm">
            
            {/* Left 7 Columns: Story Teaser */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>Certified Himalayan Heritage</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight leading-tight font-outfit">
                Born from the Shivalik Foothills to High Glacial Summits.
              </h2>

              <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
                Headquartered out of <strong>Shimla</strong> and <strong>Dehradun</strong>, TrekToShikhar was founded by certified mountaineers who rejected commercial crowd-herding. We believe in unhurried trekking, authentic mountain hospitality, and medical-grade safety standards.
              </p>

              {/* 3 Quick Badges */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E5383B]" />
                  <span>NIM &amp; ABVIMAS Leaders</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-extrabold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#E5383B]" />
                  <span>Strict 12–15 Trekkers</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-extrabold flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero Plastic Trail Ethos</span>
                </span>
              </div>

              {/* Read Full Story Button with dynamic hover color change */}
              <div className="mt-8">
                <button
                  onClick={() => {
                    navigate('/about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-neutral-900 text-white hover:bg-[#E5383B] hover:text-white shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 font-extrabold text-xs sm:text-sm cursor-pointer group"
                >
                  <span>Read Our Full Story &amp; Mountain Standards</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Visual Image Card */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg border border-neutral-200 h-64 sm:h-80 group">
              <img
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80"
                alt="Trek Leaders at Himalayan Ridge"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Local Mountain Bases</span>
                  <h4 className="text-lg font-black font-outfit mt-0.5">Shimla &amp; Dehradun Hubs</h4>
                  <p className="text-[11px] text-white/80">Guiding solo wanderers &amp; intimate batches safely.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PHOTO GALLERY SECTION (#gallery) */}
      <section id="gallery" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Raw Trail Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight font-outfit">
            Captured On The Trails
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            Real photos clicked by our trekkers and expedition leaders in Uttarakhand and Himachal Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <div 
              key={i} 
              className="group relative rounded-2xl overflow-hidden h-60 sm:h-72 shadow-xs hover:shadow-xl transition-all"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white">
                <p className="text-xs sm:text-sm font-bold">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BLOG & MOUNTAIN GUIDES SECTION (#blog) */}
      <section id="blog" className="py-24 px-4 sm:px-6 bg-neutral-50 border-t border-neutral-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Himalayan Knowledge Base</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight font-outfit">
                Guides &amp; Trail Journals
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all flex flex-col justify-between"
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
    </>
  );
}

// ----------------------------------------------------------------------
// MAIN APP COMPONENT WITH REAL REACT-ROUTER-DOM ROUTES
// ----------------------------------------------------------------------
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTrek, setBookingTrek] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleOpenBooking = (trek = null, pkg = null) => {
    setBookingTrek(trek || TREKS[0]);
    setSelectedPackage(pkg);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] selection:bg-[#E5383B] selection:text-white">
      {/* 1. AUTO SCROLL TO TOP ON ROUTE CHANGE */}
      <ScrollToTop />

      {/* 2. PERSISTENT TOP NAVBAR WITH REAL ROUTE INTEGRATION (HIDDEN IN ADMIN) */}
      {!isAdmin && <Navbar onBookClick={() => handleOpenBooking(TREKS[0])} />}

      {/* 3. MULTI-PAGE REACT ROUTER CONFIGURATION */}
      <Routes>
        {/* Homepage */}
        <Route 
          path="/" 
          element={
            <HomePage 
              onSelectTrek={(trek) => {
                navigate(`/track/${trek.slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              onBookTrek={(trek, pkg) => handleOpenBooking(trek, pkg)} 
            />
          } 
        />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* All Treks Catalog Page */}
        <Route 
          path="/track" 
          element={
            <AllTreksPage 
              onBackToHome={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectTrek={(trek) => {
                navigate(`/track/${trek.slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBookTrek={(trek, pkg) => handleOpenBooking(trek, pkg)}
            />
          } 
        />
        <Route path="/tracks" element={<Navigate to="/track" replace />} />
        <Route path="/treks" element={<Navigate to="/track" replace />} />

        {/* Single Trek Detail Page */}
        <Route 
          path="/track/:slug" 
          element={
            <TrekDetailPage 
              onBack={() => {
                navigate('/track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBookTrek={(trek, pkg) => handleOpenBooking(trek, pkg)}
            />
          } 
        />
        <Route 
          path="/tracks/:slug" 
          element={
            <TrekDetailPage 
              onBack={() => {
                navigate('/track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBookTrek={(trek, pkg) => handleOpenBooking(trek, pkg)}
            />
          } 
        />
        <Route 
          path="/trek/:slug" 
          element={
            <TrekDetailPage 
              onBack={() => {
                navigate('/track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBookTrek={(trek, pkg) => handleOpenBooking(trek, pkg)}
            />
          } 
        />
        <Route 
          path="/treks/:slug" 
          element={
            <TrekDetailPage 
              onBack={() => {
                navigate('/track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBookTrek={(trek, pkg) => handleOpenBooking(trek, pkg)}
            />
          } 
        />

        {/* Dedicated About Us Page */}
        <Route 
          path="/about" 
          element={
            <AboutUsPage 
              onBackToHome={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreTreks={() => {
                navigate('/track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onContactWhatsApp={() => handleOpenBooking(TREKS[0])}
            />
          } 
        />
        <Route path="/about-us" element={<Navigate to="/about" replace />} />

        {/* Dedicated Contact Us Page */}
        <Route 
          path="/contact" 
          element={
            <ContactUsPage 
              onBackToHome={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenBookingModal={() => handleOpenBooking(TREKS[0])}
            />
          } 
        />
        <Route path="/contact-us" element={<Navigate to="/contact" replace />} />

        {/* Dedicated Admin Dashboard Portal */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 4. PERSISTENT GLOBAL FOOTER (HIDDEN IN ADMIN) */}
      {!isAdmin && (
        <footer className="border-t border-neutral-200/80 py-12 px-6 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div 
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img src="/logo.jpg" alt="Logo" className="w-9 h-9 rounded-full border border-neutral-200 group-hover:scale-105 transition-transform" />
              <div>
                <span className="font-black text-base text-[#0A0A0A]">
                  TrekTo<span className="text-[#E5383B]">Shikhar</span>
                </span>
                <p className="text-xs text-neutral-500">From the foothills to the summit.</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold text-neutral-600">
              <button 
                onClick={() => {
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-black cursor-pointer"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  navigate('/about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#E5383B] transition-colors cursor-pointer"
              >
                About Us
              </button>
              <button 
                onClick={() => {
                  navigate('/track');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#E5383B] transition-colors cursor-pointer"
              >
                All Treks
              </button>
              <button 
                onClick={() => {
                  navigate('/contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#E5383B] transition-colors cursor-pointer"
              >
                Contact Us
              </button>
              <button 
                onClick={() => {
                  navigate('/#gallery');
                  setTimeout(() => {
                    const el = document.getElementById('gallery');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }} 
                className="hover:text-black cursor-pointer"
              >
                Gallery
              </button>
              <button 
                onClick={() => {
                  navigate('/#blog');
                  setTimeout(() => {
                    const el = document.getElementById('blog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }} 
                className="hover:text-black cursor-pointer"
              >
                Blog
              </button>
              <a
                href="tel:+918791218377"
                className="text-[#E5383B] hover:text-[#C92A2A] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+91 87912 18377</span>
              </a>
            </div>

            <p className="text-xs text-neutral-400">
              © {new Date().getFullYear()} TrekToShikhar. All rights reserved.
            </p>
          </div>
        </footer>
      )}

      {/* 5. FLOATING PERSISTENT WHATSAPP & PHONE CALL BUTTONS (HIDDEN IN ADMIN) */}
      {!isAdmin && <FloatingContactButtons />}

      {/* 6. GLOBAL 1-CLICK WHATSAPP BOOKING MODAL */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        trek={bookingTrek}
        selectedPackage={selectedPackage}
      />
    </div>
  );
}