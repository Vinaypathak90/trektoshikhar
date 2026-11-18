import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Sparkles,
  MapPin,
  Mountain,
  Search,
  ZoomIn,
  Layers,
  LayoutGrid,
  Compass,
  Clock,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { GALLERY_HERO_SLIDES, GALLERY_PHOTOS } from '../data/galleryData';
import {
  DEFAULT_GALLERY_SETTINGS,
  getCachedGallery,
  getGalleryData
} from '../lib/galleryApi';
import GalleryLightboxModal from './GalleryLightboxModal';

export default function GalleryPage({ onBackToHome, onExploreTreks, onContactWhatsApp }) {
  const navigate = useNavigate();
  const handleBack = onBackToHome || (() => navigate('/'));
  const handleExplore = onExploreTreks || (() => navigate('/track'));
  const handleContact = onContactWhatsApp || (() => navigate('/contact'));

  const cachedGallery = getCachedGallery();
  const [settings, setSettings] = useState(
    () => cachedGallery?.settings || DEFAULT_GALLERY_SETTINGS
  );
  const [allPhotos, setAllPhotos] = useState(
    () => cachedGallery?.photos || GALLERY_PHOTOS
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTrek, setSelectedTrek] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' (Trek-by-Trek sections) | 'grid' (Unified wall)

  // Lightbox Modal State
  const [lightboxPhotos, setLightboxPhotos] = useState(allPhotos);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch live gallery from Backend API + listen for real-time Admin updates
  useEffect(() => {
    let isMounted = true;

    async function loadLiveGallery() {
      const res = await getGalleryData({ admin: false });
      if (isMounted && res) {
        if (res.settings) setSettings(res.settings);
        if (Array.isArray(res.photos) && res.photos.length > 0) setAllPhotos(res.photos);
      }
    }

    loadLiveGallery();

    const handleLiveUpdate = (e) => {
      if (isMounted && e?.detail) {
        if (e.detail.settings) setSettings(e.detail.settings);
        if (Array.isArray(e.detail.photos)) setAllPhotos(e.detail.photos);
      }
    };

    window.addEventListener('tts-gallery-updated', handleLiveUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('tts-gallery-updated', handleLiveUpdate);
    };
  }, []);

  const heroSlides =
    Array.isArray(settings.hero_slides) && settings.hero_slides.length > 0
      ? settings.hero_slides
      : GALLERY_HERO_SLIDES;

  // Auto-advance Hero Slides every 4.5s (Exact Homepage Hero Engine)
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (currentSlide >= heroSlides.length) setCurrentSlide(0);
  }, [heroSlides.length, currentSlide]);

  const activeSlide = heroSlides[currentSlide] || heroSlides[0] || GALLERY_HERO_SLIDES[0];

  const activePhotos = useMemo(
    () => allPhotos.filter((p) => p.is_active !== false && p.isActive !== false),
    [allPhotos]
  );

  // Build dynamic trek list with live photo counts
  const trekTabs = useMemo(() => {
    const map = new Map();
    activePhotos.forEach((p) => {
      const tName = p.trekName || p.trek_name || 'Himalayan Expedition';
      if (!map.has(tName)) {
        map.set(tName, {
          name: tName,
          slug: p.trekSlug || p.trek_slug || '',
          altitude: p.altitude,
          location: p.location,
          count: 0
        });
      }
      map.get(tName).count += 1;
    });
    return Array.from(map.values());
  }, [activePhotos]);

  // Filtered photos by Trek & Search query
  const filteredPhotos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return activePhotos.filter((p) => {
      const tName = p.trekName || p.trek_name || '';
      const matchesTrek = selectedTrek === 'all' || tName === selectedTrek;
      const matchesQuery =
        !q ||
        (p.title || '').toLowerCase().includes(q) ||
        tName.toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.details || '').toLowerCase().includes(q) ||
        (p.altitude || '').toLowerCase().includes(q);
      return matchesTrek && matchesQuery;
    });
  }, [activePhotos, selectedTrek, searchQuery]);

  // Group filtered photos by Trek for Trek-Wise Sections view
  const groupedByTrek = useMemo(() => {
    const groups = new Map();
    filteredPhotos.forEach((p) => {
      const tName = p.trekName || p.trek_name || 'Himalayan Expedition';
      if (!groups.has(tName)) {
        groups.set(tName, {
          trekName: tName,
          trekSlug: p.trekSlug || p.trek_slug || '',
          altitude: p.altitude,
          location: p.location,
          photos: []
        });
      }
      groups.get(tName).photos.push(p);
    });
    return Array.from(groups.values());
  }, [filteredPhotos]);

  const openLightboxForPhoto = (photo) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    setLightboxPhotos(filteredPhotos);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] selection:bg-[#E5383B] selection:text-white">
      {/* ====================================================================
          1. CINEMATIC 100vh AUTO-SLIDING GALLERY HERO (HOMEPAGE ENGINE)
         ==================================================================== */}
      <section className="relative w-full min-h-screen md:h-screen md:min-h-[600px] md:max-h-[920px] flex flex-col justify-between overflow-hidden px-4 sm:px-8 pt-20 pb-6 text-white bg-neutral-950">
        {/* Ultra-HD Auto-Sliding Background Images */}
        <div className="absolute inset-0 w-full h-full overflow-hidden select-none z-0 pointer-events-none">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out transform-gpu ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.title}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className={`w-full h-full object-cover object-center transform-gpu ${
                  idx === currentSlide ? 'animate-luxury-right-to-left' : ''
                }`}
              />
            </div>
          ))}

          {/* Cinematic Radial Mesh Scrim */}
          <div
            className="absolute inset-0 w-full h-full z-15"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.56) 72%, rgba(0,0,0,0.82) 100%)'
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-15" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-15" />
        </div>

        {/* Top Bar inside Hero: Back to Home */}
        <div className="relative z-20 max-w-7xl w-full mx-auto pt-1.5">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/45 hover:bg-[#E5383B] backdrop-blur-md border border-white/15 text-[11px] font-bold text-white/90 hover:text-white cursor-pointer group transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-20 max-w-3xl w-full mx-auto text-center my-auto flex flex-col items-center gap-3 py-4">
          {settings.hero_badge && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-amber-200 shadow-md">
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>{settings.hero_badge}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-wider text-white leading-[1.1] drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
            {settings.hero_title_line1}
            <span className="font-brush normal-case text-3xl sm:text-5xl md:text-6xl text-amber-300 block mt-1 transform -rotate-1 font-normal drop-shadow-[0_2px_16px_rgba(252,211,77,0.5)]">
              {settings.hero_title_cursive}
            </span>
          </h1>

          <div className="h-[2.5px] w-24 rounded-full bg-gradient-to-r from-transparent via-[#E5383B] to-transparent shadow-[0_2px_12px_rgba(229,56,59,0.85)]" />

          <p className="max-w-2xl text-xs sm:text-sm md:text-base text-white/90 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] px-2">
            {activeSlide.caption ? `${activeSlide.caption} ` : ''}
            {settings.hero_subtitle}
          </p>

          {/* Quick Glass Stats Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
              <strong className="text-[#FFD700]">{activePhotos.length}</strong> High-Altitude Frames
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
              <strong className="text-[#FFD700]">{trekTabs.length}</strong> Himalayan Treks
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
              <strong className="text-[#FFD700]">350%</strong> Interactive Zoom Lightbox
            </span>
          </div>

          {/* Hover Text-Swap Scroll CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('trek-gallery-explorer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#E5383B] via-[#D90429] to-[#C92A2A] hover:from-neutral-950 hover:via-neutral-900 hover:to-neutral-950 border border-white/25 hover:border-[#FFD700]/70 shadow-[0_12px_30px_rgba(229,56,59,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <Sparkles className="w-4 h-4 text-[#FFD700] shrink-0" />
              <span className="relative h-5 overflow-hidden flex flex-col justify-start">
                <span className="font-outfit font-black text-xs sm:text-sm uppercase tracking-wider text-white leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  Explore Trek-Wise Gallery
                </span>
                <span className="font-outfit font-black text-xs sm:text-sm uppercase tracking-wider text-[#FFD700] leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  Dive Into Mountain Stories
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-white group-hover:text-[#FFD700] group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Solid Dark Obsidian Strip (Exact Homepage/About Us Style) */}
        <div className="relative z-20 -mx-4 sm:-mx-8 -mb-6 px-4 sm:px-8 py-2.5 sm:py-3 bg-neutral-950/90 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-neutral-900/90 px-3.5 py-1 rounded-xl border border-neutral-800">
              <MapPin className="w-3.5 h-3.5 text-[#E5383B] shrink-0" />
              <span className="font-bold text-white">{activeSlide.title}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-[#FFD700]">{activeSlide.location}</span>
            </div>

            <div className="flex items-center gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentSlide
                      ? 'w-8 bg-[#FFD700] shadow-md shadow-amber-400/50'
                      : 'w-2 bg-white/35 hover:bg-white/75'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-200 bg-neutral-900/90 px-3.5 py-1 rounded-xl border border-neutral-800">
              <ZoomIn className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Click Any Photo to Zoom &amp; Read Story</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. TREK-WISE FILTER BAR, SEARCH & VIEW MODE SWITCHER
         ==================================================================== */}
      <section
        id="trek-gallery-explorer"
        className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-neutral-50 via-white to-neutral-50/70 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Control Panel Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photos by trek, peak, snow, sunrise, tent, altitude (e.g. Kedarkantha, 12,500 ft)..."
                  className="w-full pl-10 pr-16 py-3 rounded-2xl border border-neutral-200 text-xs sm:text-sm bg-neutral-50/60 focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-black cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* View Mode Switcher (Grouped by Trek vs Unified Wall) */}
              <div className="inline-flex p-1 rounded-2xl bg-neutral-100 border border-neutral-200/80 shrink-0 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('grouped')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    viewMode === 'grouped'
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>By Trek Sections</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Full Photo Wall</span>
                </button>
              </div>
            </div>

            {/* Trek Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSelectedTrek('all')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedTrek === 'all'
                    ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white shadow-md shadow-red-600/25'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All Treks ({activePhotos.length})
              </button>

              {trekTabs.map((tab) => {
                const active = selectedTrek === tab.name;
                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => setSelectedTrek(tab.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      active
                        ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white shadow-md shadow-red-600/25'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <Mountain className="w-3.5 h-3.5 opacity-80" />
                    <span>{tab.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        active ? 'bg-white/20 text-white' : 'bg-white text-neutral-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================
              3. GALLERY CONTENT: TREK-WISE GROUPED SECTIONS OR FULL PHOTO WALL
             ================================================================ */}
          {filteredPhotos.length === 0 ? (
            <div className="p-14 text-center bg-white rounded-3xl border border-neutral-200 max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#E5383B] flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-black text-xl text-[#0A0A0A]">
                No Photos Matched
              </h3>
              <p className="text-xs text-neutral-500">
                Try clearing your search keyword or viewing all Himalayan treks.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTrek('all');
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#E5383B] text-white text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : viewMode === 'grouped' ? (
            /* TREK-BY-TREK SECTIONS VIEW */
            <div className="space-y-14">
              {groupedByTrek.map((group) => (
                <div key={group.trekName} className="space-y-5">
                  {/* Trek Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
                    <div>
                      <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#E5383B] mb-1">
                        <Compass className="w-3.5 h-3.5" />
                        <span>{group.location}</span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-neutral-700">{group.altitude}</span>
                      </div>
                      <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight flex items-center gap-2.5">
                        <span>{group.trekName}</span>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-red-50 text-[#E5383B] border border-red-100">
                          {group.photos.length} {group.photos.length === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </h2>
                    </div>

                    {group.trekSlug && (
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/track/${group.trekSlug}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-extrabold transition cursor-pointer self-start sm:self-auto group"
                      >
                        <span>View Trek Itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* Trek Photos Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.photos.map((photo) => (
                      <GalleryPhotoCard
                        key={photo.id}
                        photo={photo}
                        onClick={() => openLightboxForPhoto(photo)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* UNIFIED FULL PHOTO WALL VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <GalleryPhotoCard
                  key={photo.id}
                  photo={photo}
                  onClick={() => openLightboxForPhoto(photo)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          4. FULL-BLEED DARK OBSIDIAN BOTTOM CTA SECTION (MATCHES ALL PAGES)
         ==================================================================== */}
      <section className="relative overflow-hidden py-16 sm:py-22 px-4 sm:px-6 bg-neutral-900 text-white border-t border-neutral-800">
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(229,56,59,0.28) 0%, rgba(255,215,0,0.06) 45%, transparent 72%)'
          }}
        />

        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-neutral-950/90 text-white border border-neutral-800 hover:border-[#E5383B]/45 shadow-2xl relative overflow-hidden text-center transition-colors duration-300">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-[#FFD700]/30 text-[11px] font-black uppercase tracking-widest text-[#FFD700]">
              <Camera className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>{settings.cta_badge}</span>
            </span>

            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              {settings.cta_heading}
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {settings.cta_subtitle}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={handleExplore}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-white hover:to-white text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_12px_30px_rgba(229,56,59,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative h-5 overflow-hidden flex flex-col justify-start">
                  <span className="leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Explore Upcoming Treks
                  </span>
                  <span className="leading-5 text-[#E5383B] transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Book Your Next Summit
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 group-hover:text-[#E5383B] transition-all shrink-0" />
              </button>

              <button
                onClick={handleContact}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-[#FFD700] hover:text-[#0A0A0A] text-white border border-white/20 hover:border-[#FFD700] font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 overflow-hidden"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="relative h-5 overflow-hidden flex flex-col justify-start">
                  <span className="leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Talk to Our Team
                  </span>
                  <span className="leading-5 font-black text-[#0A0A0A] transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Plan Custom Group Trek
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. INTERACTIVE ZOOMABLE LIGHTBOX POPUP WITH FULL DETAILS & FILMSTRIP
         ==================================================================== */}
      <GalleryLightboxModal
        photos={lightboxPhotos}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={(nextIdx) => setLightboxIndex(nextIdx)}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLISH GLASSMORPHISM GALLERY PHOTO CARD
// ----------------------------------------------------------------------
function GalleryPhotoCard({ photo, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative rounded-3xl overflow-hidden h-72 sm:h-80 w-full text-left bg-neutral-900 border border-neutral-200/80 shadow-sm hover:shadow-[0_24px_54px_-12px_rgba(229,56,59,0.34)] hover:border-[#E5383B] hover:-translate-y-2 transition-all duration-350 ease-out transform-gpu cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E5383B]"
    >
      {/* Ultra-HD Photo */}
      <img
        src={photo.url}
        alt={photo.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Ambient Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-black/25" />

      {/* Top Row: Category Pill + Altitude Pill */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
        <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] font-extrabold uppercase tracking-wider text-white">
          {photo.category}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-[#E5383B]/90 backdrop-blur-md border border-white/25 text-[10px] font-black text-white shadow-sm">
          {photo.altitude}
        </span>
      </div>

      {/* Center Frosted Zoom Lens Badge on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-[#0A0A0A] text-xs font-black uppercase tracking-wider shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
          <ZoomIn className="w-3.5 h-3.5 text-[#E5383B]" />
          <span>Zoom &amp; Details</span>
        </span>
      </div>

      {/* Bottom Frosted Glass Floating Info Box */}
      <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 text-white group-hover:bg-black/65 group-hover:border-[#FFD700]/40 transition-all duration-300">
        <h3 className="font-outfit font-black text-base leading-snug line-clamp-1 group-hover:text-[#FFD700] transition-colors">
          {photo.title}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-white/85">
          <span className="inline-flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-[#E5383B] shrink-0" />
            <span className="truncate">{photo.location}</span>
          </span>
          {photo.capturedAt && (
            <span className="inline-flex items-center gap-1 text-[#FFD700] font-bold shrink-0">
              <Clock className="w-3 h-3" />
              <span>{photo.capturedAt.split('•')[0].trim()}</span>
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
