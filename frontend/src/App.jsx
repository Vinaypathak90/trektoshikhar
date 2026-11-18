import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrekDetailPage from './components/TrekDetailPage';
import AllTreksPage from './components/AllTreksPage';
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import GalleryPage from './components/GalleryPage';
import GalleryLightboxModal from './components/GalleryLightboxModal';
import BlogPage from './components/BlogPage';
import BlogDetailPage from './components/BlogDetailPage';
import BookingModal from './components/BookingModal';
import { openWhatsAppBooking } from './lib/whatsapp';
import TrekCard from './components/TrekCard';
import WhyChooseSection from './components/WhyChooseSection';
import GoogleReviewsMarquee from './components/GoogleReviewsMarquee';
import FloatingContactButtons from './components/FloatingContactButtons';
import AdminDashboard from './admindashboard/AdminDashboard';
import { TREKS } from './data/treksData';
import { GALLERY_PHOTOS } from './data/galleryData';
import { BLOG_POSTS } from './data/blogsData';
import { getTreks, getCachedTreks } from './lib/trekApi';
import { getCachedGallery, getGalleryData, DEFAULT_GALLERY_SETTINGS } from './lib/galleryApi';
import { getCachedBlogs, getBlogData } from './lib/blogApi';
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
  SlidersHorizontal,
  ZoomIn
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
  const [homeLightboxIdx, setHomeLightboxIdx] = useState(null);
  const cachedGallery = getCachedGallery();
  const [liveGallerySettings, setLiveGallerySettings] = useState(
    () => cachedGallery?.settings || DEFAULT_GALLERY_SETTINGS
  );
  const [liveGalleryPhotos, setLiveGalleryPhotos] = useState(
    () => cachedGallery?.photos || GALLERY_PHOTOS
  );
  const cachedBlogs = getCachedBlogs();
  const [liveBlogs, setLiveBlogs] = useState(
    () => cachedBlogs?.posts || BLOG_POSTS
  );
  const sentinelRef = useRef(null);

  // Fetch live treks, gallery & blogs from Backend API
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
    async function loadGalleryData() {
      try {
        const res = await getGalleryData({ admin: false });
        if (res && isMounted) {
          if (res.settings) setLiveGallerySettings(res.settings);
          if (Array.isArray(res.photos) && res.photos.length > 0) setLiveGalleryPhotos(res.photos);
        }
      } catch (e) {
        console.warn('Using local fallback gallery on homepage:', e);
      }
    }
    async function loadBlogsData() {
      try {
        const res = await getBlogData({ admin: false });
        if (res && res.posts && res.posts.length > 0 && isMounted) {
          setLiveBlogs(res.posts);
        }
      } catch (e) {
        console.warn('Using local fallback blogs on homepage:', e);
      }
    }
    loadTreksData();
    loadGalleryData();
    loadBlogsData();

    const handleGalleryUpdate = (e) => {
      if (isMounted && e?.detail) {
        if (e.detail.settings) setLiveGallerySettings(e.detail.settings);
        if (Array.isArray(e.detail.photos)) setLiveGalleryPhotos(e.detail.photos);
      }
    };
    const handleBlogUpdate = (e) => {
      if (isMounted && e?.detail && Array.isArray(e.detail.posts)) {
        setLiveBlogs(e.detail.posts);
      }
    };
    window.addEventListener('tts-gallery-updated', handleGalleryUpdate);
    window.addEventListener('tts-blogs-updated', handleBlogUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('tts-gallery-updated', handleGalleryUpdate);
      window.removeEventListener('tts-blogs-updated', handleBlogUpdate);
    };
  }, []);

  // Dynamically synced featured frames from /api/gallery (fallback to first 6 active photos)
  const activeGalleryList = liveGalleryPhotos.filter((p) => p.is_active !== false && p.isActive !== false);
  const featuredOnly = activeGalleryList.filter((p) => p.featuredOnHome || p.featured_on_home);
  const featuredGalleryPhotos = (featuredOnly.length > 0 ? featuredOnly : activeGalleryList).slice(0, 6);

  // Synced featured blogs from live Backend API / SWR Cache
  const activeBlogsList = liveBlogs.filter((b) => b.is_published !== false && b.isPublished !== false);
  const homeFeaturedBlogs = activeBlogsList.filter((b) => b.featuredOnHome || b.featured_on_home);
  const homeBlogs = (homeFeaturedBlogs.length > 0 ? homeFeaturedBlogs : activeBlogsList).slice(0, 3);

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

      {/* 2.5 GLOBAL REUSABLE "WHY CHOOSE TREKTOSHIKHAR?" ANIMATED COUNTER SECTION */}
      <WhyChooseSection />

      {/* 3. NEW PREMIUM CONTINUOUS ANIMATED GOOGLE REVIEWS SECTION (Reused directly below Why Choose Section) */}
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

      {/* 5. PHOTO GALLERY SECTION (#gallery - REFERENCED DIRECTLY FROM /gallery DATA + LIGHTBOX) */}
      <section id="gallery" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>{liveGallerySettings.home_gallery_badge || 'Raw Trail Moments'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight font-outfit">
              {liveGallerySettings.home_gallery_title || 'Captured On The Trails'}
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              {liveGallerySettings.home_gallery_subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              navigate('/gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer self-start md:self-auto shrink-0 overflow-hidden"
          >
            <Camera className="w-4 h-4 text-[#FFD700] shrink-0" />
            <span className="relative h-4 overflow-hidden flex flex-col justify-start">
              <span className="leading-4 transition-transform duration-300 group-hover:-translate-y-full">
                View Full Gallery ({activeGalleryList.length})
              </span>
              <span className="leading-4 text-[#FFD700] transition-transform duration-300 group-hover:-translate-y-full">
                Explore Trek-Wise Album
              </span>
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {featuredGalleryPhotos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setHomeLightboxIdx(i)}
              className="group relative rounded-3xl overflow-hidden h-64 sm:h-72 w-full text-left bg-neutral-900 border border-neutral-200/80 shadow-xs hover:shadow-[0_22px_50px_-12px_rgba(229,56,59,0.32)] hover:border-[#E5383B] hover:-translate-y-1.5 transition-all duration-350 cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20" />

              {/* Top Altitude & Trek Pill */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] font-extrabold text-white truncate">
                  {photo.trekName}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#E5383B]/90 text-[10px] font-black text-white shrink-0">
                  {photo.altitude}
                </span>
              </div>

              {/* Hover Zoom Badge */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-[#0A0A0A] text-[11px] font-black uppercase tracking-wider shadow-xl">
                  <ZoomIn className="w-3.5 h-3.5 text-[#E5383B]" />
                  <span>Zoom &amp; Story</span>
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white group-hover:bg-black/65 transition-all">
                <p className="font-outfit font-bold text-sm leading-snug line-clamp-1 group-hover:text-[#FFD700] transition-colors">
                  {photo.title}
                </p>
                <p className="text-[11px] text-white/80 mt-0.5 truncate">
                  {photo.location} • {photo.capturedAt}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Shared Interactive Zoomable Lightbox Modal on Homepage */}
        <GalleryLightboxModal
          photos={featuredGalleryPhotos}
          activeIndex={homeLightboxIdx}
          onClose={() => setHomeLightboxIdx(null)}
          onChangeIndex={(nextIdx) => setHomeLightboxIdx(nextIdx)}
        />
      </section>

      {/* 6. BLOG & MOUNTAIN GUIDES SECTION (#blog - DARK OBSIDIAN LAST SECTION) */}
      <section id="blog" className="relative overflow-hidden py-24 px-4 sm:px-6 bg-neutral-900 text-white border-t border-neutral-800 scroll-mt-20">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[780px] h-[260px] pointer-events-none opacity-40 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(229,56,59,0.22) 0%, rgba(255,215,0,0.06) 50%, transparent 75%)'
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFD700] uppercase tracking-widest mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Himalayan Knowledge Base</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-outfit">
                Guides &amp; Trail Journals
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                Authentic field dispatches, packing advice, and high-altitude wisdom by certified guides.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                navigate('/blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-800 hover:bg-[#E5383B] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer self-start md:self-auto shrink-0 overflow-hidden border border-neutral-700/80"
            >
              <BookOpen className="w-4 h-4 text-[#FFD700] shrink-0" />
              <span className="relative h-4 overflow-hidden flex flex-col justify-start">
                <span className="leading-4 transition-transform duration-300 group-hover:-translate-y-full">
                  Explore All Journals ({BLOG_POSTS.length})
                </span>
                <span className="leading-4 text-[#FFD700] transition-transform duration-300 group-hover:-translate-y-full">
                  Read Field Guides
                </span>
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeBlogs.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  navigate(`/blog/${b.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-neutral-800/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-neutral-700/80 hover:border-[#E5383B] shadow-md hover:shadow-[0_20px_44px_-12px_rgba(229,56,59,0.3)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative h-48 overflow-hidden bg-neutral-900">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#E5383B] text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                      {b.category}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#FFD700] text-[11px] font-bold">
                      {b.readTime}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-lg text-white mb-2 leading-snug group-hover:text-[#FFD700] transition-colors line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-neutral-300 text-xs leading-relaxed line-clamp-2">
                      {b.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-neutral-700/70 bg-neutral-850/50 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-neutral-400">
                    {b.author.name} • {b.publishedAt}
                  </span>
                  <span className="text-xs font-extrabold text-[#E5383B] group-hover:text-[#FFD700] group-hover:translate-x-1 transition-all flex items-center gap-1">
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
    // Direct 1-Click WhatsApp Booking — zero intermediate forms!
    openWhatsAppBooking({ trek, pkg });
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
              onContactWhatsApp={() => handleOpenBooking(null)}
            />
          } 
        />
        <Route path="/about-us" element={<Navigate to="/about" replace />} />

        {/* Dedicated Expedition Gallery Page */}
        <Route 
          path="/gallery" 
          element={
            <GalleryPage 
              onBackToHome={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreTreks={() => {
                navigate('/track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onContactWhatsApp={() => handleOpenBooking(null)}
            />
          } 
        />

        {/* Dedicated Himalayan Field Journals & Blogs */}
        <Route 
          path="/blog" 
          element={
            <BlogPage 
              onBackToHome={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreTreks={() => {
                navigate('/track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onContactWhatsApp={() => handleOpenBooking(null)}
            />
          } 
        />
        <Route path="/blogs" element={<Navigate to="/blog" replace />} />
        <Route 
          path="/blog/:slug" 
          element={
            <BlogDetailPage 
              onBookTrek={(trek, pkg) => handleOpenBooking(trek, pkg)} 
            />
          } 
        />
        <Route 
          path="/blogs/:slug" 
          element={
            <BlogDetailPage 
              onBookTrek={(trek, pkg) => handleOpenBooking(trek, pkg)} 
            />
          } 
        />

        {/* Dedicated Contact Us Page */}
        <Route 
          path="/contact" 
          element={
            <ContactUsPage 
              onBackToHome={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenBookingModal={() => handleOpenBooking(null)}
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

      {/* 4. PERSISTENT GLOBAL FOOTER (DARK OBSIDIAN THEME ON EVERY PAGE, HIDDEN IN ADMIN) */}
      {!isAdmin && (
        <footer className="border-t border-neutral-800 py-12 px-6 bg-neutral-950 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div 
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border-2 border-[#E5383B]/50 group-hover:border-[#FFD700] group-hover:scale-105 transition-all" />
              <div>
                <span className="font-outfit font-black text-base text-white tracking-tight">
                  TrekTo<span className="text-[#E5383B]">Shikhar</span>
                </span>
                <p className="text-xs text-neutral-400">From the foothills to the summit.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs font-semibold text-neutral-300">
              <button 
                onClick={() => {
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  navigate('/about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                About Us
              </button>
              <button 
                onClick={() => {
                  navigate('/track');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                All Treks
              </button>
              <button 
                onClick={() => {
                  navigate('/contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                Contact Us
              </button>
              <button 
                onClick={() => {
                  navigate('/gallery');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                Gallery
              </button>
              <button 
                onClick={() => {
                  navigate('/blog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                Blog
              </button>
              <a
                href="tel:+918791218377"
                className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#FFD700] hover:bg-[#E5383B] hover:text-white hover:border-[#E5383B] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+91 87912 18377</span>
              </a>
            </div>

            <p className="text-xs text-neutral-500">
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