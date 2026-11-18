import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Clock,
  Compass,
  Eye,
  Flame,
  Layers,
  MapPin,
  MessageSquare,
  Mountain,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  X
} from 'lucide-react';
import {
  BLOG_HERO_SLIDES,
  BLOG_CATEGORIES,
  BLOG_POSTS
} from '../data/blogsData';
import {
  DEFAULT_BLOG_SETTINGS,
  getCachedBlogs,
  getBlogData
} from '../lib/blogApi';

const SAVED_BLOGS_KEY = 'tts_saved_blogs';

function readSavedSlugs() {
  try {
    const raw = localStorage.getItem(SAVED_BLOGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function BlogPage({ onBackToHome, onExploreTreks, onContactWhatsApp }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleBack = onBackToHome || (() => navigate('/'));
  const handleExplore = onExploreTreks || (() => navigate('/track'));
  const handleContact = onContactWhatsApp || (() => navigate('/contact'));

  const cachedBlogData = getCachedBlogs();
  const [settings, setSettings] = useState(
    () => cachedBlogData?.settings || DEFAULT_BLOG_SETTINGS
  );
  const [allPosts, setAllPosts] = useState(
    () => cachedBlogData?.posts || BLOG_POSTS
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('tag') || '');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'popular' | 'quickest'
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState(() => readSavedSlugs());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch live blog data & listen for real-time updates from Admin CMS
  useEffect(() => {
    let isMounted = true;
    async function loadLiveData() {
      const res = await getBlogData({ admin: false });
      if (isMounted && res) {
        if (res.settings) setSettings(res.settings);
        if (Array.isArray(res.posts) && res.posts.length > 0) setAllPosts(res.posts);
      }
    }
    loadLiveData();

    const handleBlogUpdate = (e) => {
      if (isMounted && e?.detail) {
        if (e.detail.settings) setSettings(e.detail.settings);
        if (Array.isArray(e.detail.posts)) setAllPosts(e.detail.posts);
      }
    };

    window.addEventListener('tts-blogs-updated', handleBlogUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('tts-blogs-updated', handleBlogUpdate);
    };
  }, []);

  // Sync tag query param if user clicked a tag from BlogDetailPage
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSearchQuery(tagParam);
      setSelectedCategory('All');
      setShowSavedOnly(false);
      setTimeout(() => {
        const el = document.getElementById('blog-journal-explorer');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  }, [searchParams]);

  const heroSlides =
    Array.isArray(settings.hero_slides) && settings.hero_slides.length > 0
      ? settings.hero_slides
      : BLOG_HERO_SLIDES;

  // Auto-advance Hero Slides every 4.5s (Exact Homepage / Gallery Engine)
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[currentSlide] || heroSlides[0] || BLOG_HERO_SLIDES[0];

  const toggleSaveSlug = (e, slug) => {
    e.stopPropagation();
    setSavedSlugs((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem(SAVED_BLOGS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: allPosts.length };
    allPosts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allPosts]);

  // Spotlight post (displayed at top when viewing unfiltered 'All' journals)
  const featuredPost = useMemo(
    () => allPosts.find((p) => p.featured) || allPosts[0],
    [allPosts]
  );

  const isDefaultBrowse =
    selectedCategory === 'All' && !searchQuery.trim() && !showSavedOnly && sortBy === 'latest';

  // Filtered & sorted posts
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = allPosts.filter((post) => {
      if (showSavedOnly && !savedSlugs.includes(post.slug)) return false;
      if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        (post.title || '').toLowerCase().includes(q) ||
        (post.subtitle || '').toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q) ||
        (post.category || '').toLowerCase().includes(q) ||
        (post.relatedTrekName || '').toLowerCase().includes(q) ||
        (post.author?.name || '').toLowerCase().includes(q) ||
        (Array.isArray(post.tags) && post.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });

    const sorted = [...list];
    if (sortBy === 'popular') {
      sorted.sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
    } else if (sortBy === 'quickest') {
      sorted.sort((a, b) => (a.readMinutes || 5) - (b.readMinutes || 5));
    }
    return sorted;
  }, [allPosts, selectedCategory, searchQuery, sortBy, showSavedOnly, savedSlugs]);

  // Grid posts (avoid duplicating the featured spotlight card in default view)
  const gridPosts = useMemo(() => {
    if (isDefaultBrowse && featuredPost) {
      return filteredPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, isDefaultBrowse, featuredPost]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('latest');
    setShowSavedOnly(false);
    if (searchParams.get('tag')) {
      setSearchParams({});
    }
  };

  const openArticle = (slug) => {
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] selection:bg-[#E5383B] selection:text-white">
      {/* ====================================================================
          1. CINEMATIC 100vh AUTO-SLIDING BLOG HERO (BRAND STANDARD ENGINE)
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
                'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.62) 72%, rgba(0,0,0,0.86) 100%)'
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/65 to-transparent z-15" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-15" />
        </div>

        {/* Top Bar inside Hero: Back to Home */}
        <div className="relative z-20 max-w-7xl w-full mx-auto pt-1.5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/45 hover:bg-[#E5383B] backdrop-blur-md border border-white/15 text-[11px] font-bold text-white/90 hover:text-white cursor-pointer group transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          {savedSlugs.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setShowSavedOnly(true);
                const el = document.getElementById('blog-journal-explorer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 hover:bg-[#FFD700] hover:text-[#0A0A0A] backdrop-blur-md border border-amber-300/40 text-[11px] font-black text-[#FFD700] cursor-pointer transition-all duration-300"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Saved List ({savedSlugs.length})</span>
            </button>
          )}
        </div>

        {/* Center Hero Content */}
        <div className="relative z-20 max-w-3xl w-full mx-auto text-center my-auto flex flex-col items-center gap-3 py-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-amber-200 shadow-md">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>{settings.hero_badge || 'Himalayan Trail Journals & Field Guides'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-wider text-white leading-[1.1] drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
            {settings.hero_title_line1 || 'STORIES FROM THE HIGH RIDGES,'}
            <span className="font-brush normal-case text-3xl sm:text-5xl md:text-6xl text-amber-300 block mt-1 transform -rotate-1 font-normal drop-shadow-[0_2px_16px_rgba(252,211,77,0.5)]">
              {settings.hero_title_cursive || 'wisdom for every climb.'}
            </span>
          </h1>

          <div className="h-[2.5px] w-24 rounded-full bg-gradient-to-r from-transparent via-[#E5383B] to-transparent shadow-[0_2px_12px_rgba(229,56,59,0.85)]" />

          <p className="max-w-2xl text-xs sm:text-sm md:text-base text-white/90 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] px-2">
            {activeSlide.caption ? `${activeSlide.caption} ` : ''}
            {settings.hero_subtitle || 'Packing checklists, winter snowcraft, acclimatization science, and raw camp stories penned by TrekToShikhar’s Shimla & Dehradun expedition leaders.'}
          </p>

          {/* Quick Glass Stats Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
              <strong className="text-[#FFD700]">{allPosts.length}</strong> Leader-Verified Guides
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
              <strong className="text-[#FFD700]">NIM &amp; ABVIMAS</strong> Field Insights
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
              <strong className="text-[#FFD700]">100%</strong> Real Trail Experience
            </span>
          </div>

          {/* Hover Text-Swap Scroll CTA */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('blog-spotlight');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#E5383B] via-[#D90429] to-[#C92A2A] hover:from-neutral-950 hover:via-neutral-900 hover:to-neutral-950 border border-white/25 hover:border-[#FFD700]/70 shadow-[0_12px_30px_rgba(229,56,59,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <Sparkles className="w-4 h-4 text-[#FFD700] shrink-0" />
              <span className="relative h-5 overflow-hidden flex flex-col justify-start">
                <span className="font-outfit font-black text-xs sm:text-sm uppercase tracking-wider text-white leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  Explore Field Journals
                </span>
                <span className="font-outfit font-black text-xs sm:text-sm uppercase tracking-wider text-[#FFD700] leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  Read Mountain Wisdom
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-white group-hover:text-[#FFD700] group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Solid Dark Obsidian Strip (Matches Home, About & Gallery) */}
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
              <Compass className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Written By Active Shikharite Trek Leaders</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. FEATURED EDITORIAL SPOTLIGHT CARD (MAGAZINE COVER STORY)
         ==================================================================== */}
      {isDefaultBrowse && featuredPost && (
        <section id="blog-spotlight" className="pt-16 pb-6 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#E5383B]">
                <Flame className="w-3.5 h-3.5" />
                <span>Editor’s Pick • Lead Field Dispatch</span>
              </span>
              <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight mt-1">
                Featured Trail Journal
              </h2>
            </div>
          </div>

          <div
            onClick={() => openArticle(featuredPost.slug)}
            className="group relative grid grid-cols-1 lg:grid-cols-12 rounded-[2rem] overflow-hidden bg-neutral-950 text-white border border-neutral-800 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.35)] hover:border-[#E5383B]/70 transition-all duration-500 cursor-pointer"
          >
            {/* Ambient Crimson Glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-45"
              style={{
                background:
                  'radial-gradient(circle at 80% 20%, rgba(229,56,59,0.28) 0%, transparent 55%)'
              }}
            />

            {/* Left 6 Cols: Dramatic Cover Photo */}
            <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-auto min-h-[340px] overflow-hidden">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:via-neutral-950/20 lg:to-neutral-950" />

              {/* Floating Top Badges */}
              <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#E5383B] text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                  {featuredPost.category}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#FFD700] text-[10px] font-extrabold uppercase tracking-wider">
                  {featuredPost.difficultyTag}
                </span>
              </div>

              {/* Save Bookmark Button */}
              <button
                type="button"
                onClick={(e) => toggleSaveSlug(e, featuredPost.slug)}
                aria-label="Bookmark article"
                className={`absolute top-5 right-5 w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  savedSlugs.includes(featuredPost.slug)
                    ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700] shadow-lg'
                    : 'bg-black/50 text-white border-white/25 hover:bg-white hover:text-[#0A0A0A]'
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${savedSlugs.includes(featuredPost.slug) ? 'fill-current' : ''}`}
                />
              </button>
            </div>

            {/* Right 6 Cols: Editorial Copy */}
            <div className="lg:col-span-6 relative z-10 p-7 sm:p-10 lg:p-12 flex flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-semibold mb-3">
                  <span className="inline-flex items-center gap-1 text-[#FFD700]">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime}
                  </span>
                  <span>•</span>
                  <span>{featuredPost.publishedAt}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-neutral-400" />
                    {featuredPost.views} reads
                  </span>
                </div>

                <h3 className="font-outfit font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight group-hover:text-[#FFD700] transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="mt-3.5 text-neutral-300 text-sm sm:text-base leading-relaxed">
                  {featuredPost.subtitle}
                </p>

                {/* Top 2 Key Takeaways Preview */}
                <div className="mt-5 space-y-2">
                  {featuredPost.keyTakeaways.slice(0, 2).map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Author + Hover Text-Swap Read Button */}
              <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#FFD700]/60"
                  />
                  <div>
                    <p className="font-outfit font-bold text-sm text-white">
                      {featuredPost.author.name}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {featuredPost.author.role}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] group-hover:from-white group-hover:to-white text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all duration-300 overflow-hidden shrink-0">
                  <span className="relative h-4 overflow-hidden flex flex-col justify-start">
                    <span className="leading-4 transition-transform duration-300 group-hover:-translate-y-full">
                      Read Full Journal
                    </span>
                    <span className="leading-4 text-[#E5383B] transition-transform duration-300 group-hover:-translate-y-full">
                      Open Field Guide
                    </span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-[#E5383B] transition-all" />
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          3. INTERACTIVE FILTER, SEARCH, SAVED READING LIST & SORT SUITE
         ==================================================================== */}
      <section
        id="blog-journal-explorer"
        className="pt-12 pb-20 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24"
      >
        <div className="rounded-3xl bg-neutral-50 border border-neutral-200/90 p-5 sm:p-6 shadow-xs mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search journals by topic, trek (e.g. Kedarkantha, Nag Tibba, AMS, layering)..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-neutral-200 focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 outline-none text-sm font-medium text-[#0A0A0A] placeholder:text-neutral-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    if (searchParams.get('tag')) setSearchParams({});
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Controls: Saved Toggle + Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowSavedOnly((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  showSavedOnly
                    ? 'bg-neutral-950 text-[#FFD700] border-neutral-950 shadow-md'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#E5383B] hover:text-[#E5383B]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current' : ''}`} />
                <span>Saved ({savedSlugs.length})</span>
              </button>

              <div className="inline-flex items-center bg-white border border-neutral-200 rounded-xl p-1 text-xs font-bold">
                {[
                  { id: 'latest', label: 'Latest' },
                  { id: 'popular', label: 'Popular' },
                  { id: 'quickest', label: 'Quick Read' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSortBy(opt.id)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      sortBy === opt.id
                        ? 'bg-[#E5383B] text-white shadow-xs'
                        : 'text-neutral-600 hover:text-[#0A0A0A]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-4 pt-4 border-t border-neutral-200/80 flex flex-wrap items-center gap-2">
            {BLOG_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    active
                      ? 'bg-neutral-950 text-white shadow-md ring-2 ring-[#E5383B]/40'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:border-[#E5383B] hover:text-[#E5383B]'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      active ? 'bg-[#E5383B] text-white' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}

            {(selectedCategory !== 'All' || searchQuery || showSavedOnly || sortBy !== 'latest') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-auto inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold text-[#E5383B] hover:bg-[#E5383B]/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Heading & Count */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight">
              {showSavedOnly
                ? 'Your Saved Trail Reading List'
                : selectedCategory === 'All'
                  ? 'All Himalayan Field Journals'
                  : `${selectedCategory}`}
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">
              Showing <strong className="text-[#0A0A0A]">{gridPosts.length}</strong>{' '}
              {gridPosts.length === 1 ? 'journal' : 'journals'}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
          </div>
        </div>

        {/* ====================================================================
            4. STYLISH CREATIVE BLOG CARDS GRID
           ==================================================================== */}
        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {gridPosts.map((post) => {
              const isSaved = savedSlugs.includes(post.slug);
              return (
                <article
                  key={post.id}
                  onClick={() => openArticle(post.slug)}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-neutral-200/90 shadow-xs hover:shadow-[0_24px_54px_-12px_rgba(229,56,59,0.22)] hover:border-[#E5383B] hover:-translate-y-2 transition-all duration-350 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Card Cover Image */}
                    <div className="relative h-56 overflow-hidden bg-neutral-900">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/20" />

                      {/* Top Floating Category + Save Button */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#E5383B]/95 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                          {post.category}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleSaveSlug(e, post.slug)}
                          aria-label={isSaved ? 'Remove from saved list' : 'Save article'}
                          className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700] shadow-md'
                              : 'bg-black/45 text-white border-white/25 hover:bg-white hover:text-[#0A0A0A]'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Overlay: Related Trek Pill + Read Time */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 text-[11px] text-white">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 font-bold truncate max-w-[68%]">
                          <Mountain className="w-3 h-3 text-[#FFD700] shrink-0" />
                          <span className="truncate">{post.relatedTrekName}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 font-bold text-[#FFD700] shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 mb-2.5">
                        <span className="uppercase tracking-wider text-[#E5383B]">
                          {post.seasonTag}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views} reads
                        </span>
                      </div>

                      <h3 className="font-outfit font-black text-xl text-[#0A0A0A] leading-snug group-hover:text-[#E5383B] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="mt-2.5 text-neutral-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Clickable Topic Tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery(tag);
                              setSelectedCategory('All');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-[#E5383B]/10 hover:text-[#E5383B] text-neutral-600 text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Author & Read CTA */}
                  <div className="px-6 py-4 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#0A0A0A] truncate">
                          {post.author.name}
                        </p>
                        <p className="text-[10px] text-neutral-500">{post.publishedAt}</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-black text-[#E5383B] group-hover:translate-x-1 transition-transform shrink-0">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-neutral-50 border border-dashed border-neutral-300 p-12 text-center">
            <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-outfit font-black text-xl text-[#0A0A0A]">
              {showSavedOnly ? 'No Saved Journals Yet' : 'No Matching Journals Found'}
            </h3>
            <p className="text-neutral-500 text-sm mt-1 max-w-md mx-auto">
              {showSavedOnly
                ? 'Tap the bookmark icon on any trail guide to save it here for offline reading before your trek.'
                : 'Try a different keyword like "winter", "Nag Tibba", "fitness", or reset all filters.'}
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-[#E5383B] text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All Trail Journals</span>
            </button>
          </div>
        )}

        {/* ====================================================================
            5. SHIKHAR QUICK FIELD CHEAT-SHEET STRIP (CREATIVE INTERACTIVE CARDS)
           ==================================================================== */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#E5383B]">
              <Compass className="w-3.5 h-3.5" />
              <span>Quick Mountain Field Rules</span>
            </span>
            <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight mt-1">
              3 Golden Pillars Every Shikharite Swears By
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Layers,
                badge: 'Layering Science',
                title: 'The 3-Layer Sub-Zero Rule',
                desc: 'Wicking base + warm fleece/down mid + windproof shell beats one heavy cotton jacket every single time.',
                slug: 'essential-winter-trek-gear-checklist-3-layer-system',
                cta: 'Open Gear Checklist'
              },
              {
                icon: ShieldCheck,
                badge: 'Altitude Safety',
                title: 'Climb High, Sleep Low & Hydrate',
                desc: 'Drink 3.5L water daily, walk at a conversational pace, and attend every camp SpO2 check with your leader.',
                slug: 'acclimatization-and-ams-staying-safe-above-10000-feet',
                cta: 'Read AMS Protocol'
              },
              {
                icon: Mountain,
                badge: 'Zero-Leave Escapes',
                title: '48-Hour 10,000 ft Summits',
                desc: 'Friday night out of Delhi or Chandigarh, Sunday night back home — with a real Himalayan summit in between.',
                slug: 'why-nag-tibba-and-hatu-peak-are-indias-best-weekend-escapes',
                cta: 'Compare Weekend Treks'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => openArticle(item.slug)}
                  className="group text-left p-6 rounded-3xl bg-neutral-50 hover:bg-neutral-950 border border-neutral-200 hover:border-[#E5383B] transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#E5383B]/10 group-hover:bg-[#E5383B] text-[#E5383B] group-hover:text-white flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-[#FFD700] transition-colors">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-outfit font-black text-lg text-[#0A0A0A] group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 group-hover:text-neutral-300 leading-relaxed transition-colors">
                      {item.desc}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#E5383B] group-hover:text-[#FFD700] transition-colors">
                    <span>{item.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. FULL-BLEED DARK OBSIDIAN BOTTOM CTA SECTION (BRAND STANDARD)
         ==================================================================== */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 bg-neutral-900 text-white border-t border-neutral-800">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[780px] h-[280px] pointer-events-none opacity-45 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(229,56,59,0.28) 0%, rgba(255,215,0,0.08) 50%, transparent 75%)'
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="rounded-[2rem] bg-neutral-950/90 backdrop-blur-md border border-neutral-800 p-8 sm:p-14 text-center shadow-2xl space-y-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-black uppercase tracking-[0.2em] text-[#FFD700]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>{settings.cta_badge || 'Once a Shikharite, Always a Shikharite'}</span>
            </span>

            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              {settings.cta_heading || 'Ready To Turn Reading Into Your Next Summit?'}
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {settings.cta_subtitle || 'Join our small-batch Himalayan departures from Shimla & Dehradun — guided by the very leaders who wrote these field journals.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
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
                type="button"
                onClick={handleContact}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-[#FFD700] hover:text-[#0A0A0A] text-white border border-white/20 hover:border-[#FFD700] font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 overflow-hidden"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="relative h-5 overflow-hidden flex flex-col justify-start">
                  <span className="leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Ask a Trek Leader
                  </span>
                  <span className="leading-5 font-black text-[#0A0A0A] transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Get Free Trail Advice
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
