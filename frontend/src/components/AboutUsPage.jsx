import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  ShieldCheck,
  HeartHandshake,
  Mountain,
  Compass,
  Users,
  MapPin,
  Activity,
  Tent,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Heart,
  Utensils,
  Sprout,
  X,
  Quote,
  Calendar,
  Eye,
  Flame,
  Star
} from 'lucide-react';
import WhyChooseSection from './WhyChooseSection';
import GoogleReviewsMarquee from './GoogleReviewsMarquee';
import { getHeroSlides, getCachedHeroSlides } from '../lib/heroApi';
import {
  DEFAULT_ABOUT_SETTINGS,
  DEFAULT_TEAM_MEMBERS,
  getCachedAboutUs,
  getAboutUs
} from '../lib/aboutUsApi';

// Export default team list for backwards compatibility
export const TEAM_MEMBERS = DEFAULT_TEAM_MEMBERS;

// Icon Registry for Dynamic Pillar Cards
export const PILLAR_ICON_MAP = {
  HeartHandshake,
  Award,
  Activity,
  Tent,
  Utensils,
  Sprout,
  ShieldCheck,
  Mountain,
  Compass,
  Users,
  Heart,
  Flame,
  Star,
  Sparkles
};

export const PILLAR_ICON_OPTIONS = Object.keys(PILLAR_ICON_MAP);

// Fallback Cinematic Himalayan Slides
const ABOUT_FALLBACK_SLIDES = [
  {
    id: 'about-1',
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=85',
    title: 'Kedarkantha Summit Ridge',
    location: 'Uttarakhand (12,500 ft)'
  },
  {
    id: 'about-2',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85',
    title: 'Nag Tibba Alpine Crest',
    location: 'Dehradun / Pantwari (9,915 ft)'
  },
  {
    id: 'about-3',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
    title: 'Hatu Peak Snow Walk',
    location: 'Narkanda / Shimla (11,150 ft)'
  },
  {
    id: 'about-4',
    url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1920&q=85',
    title: 'Churdhar Sanctuary Summit',
    location: 'Himachal Shivalik (11,965 ft)'
  }
];

export default function AboutUsPage({ onBackToHome, onExploreTreks, onContactWhatsApp }) {
  const navigate = useNavigate();
  const handleBack = onBackToHome || (() => navigate('/'));
  const handleExplore = onExploreTreks || (() => navigate('/track'));
  const handleContact = onContactWhatsApp || (() => navigate('/contact'));

  const cachedAbout = getCachedAboutUs();
  const [settings, setSettings] = useState(
    () => cachedAbout?.settings || DEFAULT_ABOUT_SETTINGS
  );
  const [teamMembers, setTeamMembers] = useState(
    () => cachedAbout?.team || DEFAULT_TEAM_MEMBERS
  );
  const [activeMemberIndex, setActiveMemberIndex] = useState(null);

  // Global Hero Slides state (used when use_global_hero_slides is true)
  const [globalSlides, setGlobalSlides] = useState(() => {
    const cached = getCachedHeroSlides();
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached.map((d) => ({
        id: d.id,
        url: d.image_url || d.url,
        title: d.title || 'Himalayan Expedition',
        location: d.location || 'Uttarakhand & Himachal'
      }));
    }
    return ABOUT_FALLBACK_SLIDES;
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Live Sync About Us Settings + Meet The Team from Backend API
  useEffect(() => {
    let isMounted = true;

    async function loadAbout() {
      const res = await getAboutUs({ admin: false });
      if (isMounted && res) {
        if (res.settings) setSettings(res.settings);
        if (Array.isArray(res.team)) setTeamMembers(res.team);
      }
    }

    loadAbout();

    const handleLiveUpdate = (e) => {
      if (isMounted && e?.detail) {
        if (e.detail.settings) setSettings(e.detail.settings);
        if (Array.isArray(e.detail.team)) setTeamMembers(e.detail.team);
      }
    };

    window.addEventListener('tts-about-us-updated', handleLiveUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('tts-about-us-updated', handleLiveUpdate);
    };
  }, []);

  // Sync Global Hero Slides from Module 1
  useEffect(() => {
    let isMounted = true;
    async function loadSlides() {
      try {
        const data = await getHeroSlides(false);
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setGlobalSlides(
            data.map((d) => ({
              id: d.id,
              url: d.image_url || d.url,
              title: d.title || 'Himalayan Expedition',
              location: d.location || 'Uttarakhand & Himachal'
            }))
          );
        }
      } catch {
        // Keep fallback
      }
    }
    loadSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  // Decide active slide deck (Custom About Us slides vs Global Hero slides)
  const customSlides = Array.isArray(settings.custom_hero_slides)
    ? settings.custom_hero_slides.filter((s) => s && (s.url || s.image_url))
    : [];

  const heroSlides =
    settings.use_global_hero_slides === false && customSlides.length > 0
      ? customSlides.map((s, idx) => ({
          id: s.id || `custom-${idx}`,
          url: s.url || s.image_url,
          title: s.title || 'Himalayan Trail',
          location: s.location || 'Himalayas'
        }))
      : globalSlides;

  // Auto-advance every 4.5 seconds (matching Homepage Hero)
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Reset slide index cleanly if deck shrinks
  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0);
    }
  }, [heroSlides.length, currentSlide]);

  const activeSlide = heroSlides[currentSlide] || heroSlides[0] || ABOUT_FALLBACK_SLIDES[0];

  const activeTeam = teamMembers.filter((m) => m.is_active !== false && m.isActive !== false);
  const storyChapters = Array.isArray(settings.story_chapters) && settings.story_chapters.length > 0
    ? settings.story_chapters
    : DEFAULT_ABOUT_SETTINGS.story_chapters;
  const whyChoosePillars = Array.isArray(settings.pillars) && settings.pillars.length > 0
    ? settings.pillars
    : DEFAULT_ABOUT_SETTINGS.pillars;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Lock background scroll & support ESC / Arrow keys when Team Member Popup is open
  useEffect(() => {
    if (activeMemberIndex === null) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveMemberIndex(null);
      if (e.key === 'ArrowRight' && activeTeam.length > 0) {
        setActiveMemberIndex((prev) => (prev + 1) % activeTeam.length);
      }
      if (e.key === 'ArrowLeft' && activeTeam.length > 0) {
        setActiveMemberIndex((prev) => (prev - 1 + activeTeam.length) % activeTeam.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMemberIndex, activeTeam.length]);

  const activeMember = activeMemberIndex !== null ? activeTeam[activeMemberIndex] : null;

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] selection:bg-[#E5383B] selection:text-white">
      {/* ====================================================================
          1. CINEMATIC AUTO-SLIDING HERO SECTION (EXACT HOMEPAGE 100vh FIT)
         ==================================================================== */}
      <section className="relative w-full min-h-screen md:h-screen md:min-h-[600px] md:max-h-[920px] flex flex-col justify-between overflow-hidden px-4 sm:px-8 pt-20 pb-6 text-white bg-neutral-950">
        {/* Ultra-HD Auto-Sliding Background Images with Ken Burns Right-to-Left Sweep */}
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

          {/* Crisp Cinematic Mesh */}
          <div
            className="absolute inset-0 w-full h-full z-15"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 72%, rgba(0,0,0,0.82) 100%)'
            }}
          />

          {/* Ambient Top & Bottom Lighting */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-15" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-15" />
        </div>

        {/* Top Bar inside Hero: Back to Home Link */}
        <div className="relative z-20 max-w-7xl w-full mx-auto pt-1.5">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/45 hover:bg-[#E5383B] backdrop-blur-md border border-white/15 text-[11px] font-bold text-white/90 hover:text-white cursor-pointer group transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Center Hero Content: Compact Single-Screen Fit matching Homepage Hero */}
        <div className="relative z-20 max-w-3xl w-full mx-auto text-center my-auto flex flex-col items-center gap-2.5 sm:gap-3 py-2">
          {/* Eyebrow Pill */}
          {settings.hero_badge && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-amber-200 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{settings.hero_badge}</span>
            </div>
          )}

          {/* Master Headline & Brush Cursive Tagline */}
          <h1 className="text-xl sm:text-3xl md:text-[38px] font-black font-outfit uppercase tracking-wider text-white leading-[1.1] drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
            {settings.hero_title_line1}
            <span className="font-brush normal-case text-2xl sm:text-4xl md:text-[46px] text-amber-300 block mt-0.5 sm:mt-1 transform -rotate-1 font-normal drop-shadow-[0_2px_14px_rgba(252,211,77,0.5)]">
              {settings.hero_title_cursive}
            </span>
          </h1>

          {/* Signature Crimson Tapered Divider */}
          <div className="flex items-center justify-center my-0.5">
            <div className="h-[2.5px] w-24 rounded-full bg-gradient-to-r from-transparent via-[#E5383B] to-transparent shadow-[0_2px_12px_rgba(229,56,59,0.85)]" />
          </div>

          {/* Glassmorphic Brand Intro Card */}
          <div className="w-full rounded-2xl sm:rounded-3xl bg-black/50 backdrop-blur-md border border-white/15 px-5 py-4 sm:px-7 sm:py-5 shadow-2xl text-center space-y-2.5">
            <p className="text-white text-xs sm:text-sm md:text-[15px] leading-relaxed font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
              {settings.hero_intro_para1}
            </p>

            <p className="text-white/85 text-[11px] sm:text-xs md:text-[13.5px] leading-relaxed">
              {settings.hero_intro_para2}
            </p>

            {/* Interactive Hover Text-Swap Button */}
            {settings.hero_pledge_text && (
              <div className="pt-1.5 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('meet-the-team');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] via-[#D90429] to-[#C92A2A] hover:from-neutral-950 hover:via-neutral-900 hover:to-neutral-950 border border-white/25 hover:border-[#FFD700]/70 shadow-[0_10px_28px_rgba(229,56,59,0.45)] hover:shadow-[0_12px_30px_rgba(255,215,0,0.28)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <Heart className="w-4 h-4 text-[#FFD700] fill-[#FFD700] shrink-0 group-hover:scale-125 transition-transform duration-300" />
                  <span className="relative h-5 overflow-hidden flex flex-col justify-start">
                    <span className="font-outfit font-black text-xs sm:text-sm tracking-wide text-white leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                      {settings.hero_pledge_text}
                    </span>
                    <span className="font-outfit font-black text-xs sm:text-sm tracking-wide text-[#FFD700] leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full flex items-center justify-center gap-1.5">
                      <span>{settings.hero_pledge_hover_text || 'Meet Your Mountain Family'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Live Mountain Trail Info + Slide Switcher Tabs (Solid Dark Obsidian Strip) */}
        <div className="relative z-20 -mx-4 sm:-mx-8 -mb-6 px-4 sm:px-8 py-2.5 sm:py-3 bg-neutral-950/90 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Left: Trail Location & Altitude */}
            <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-neutral-900/90 px-3.5 py-1 rounded-xl border border-neutral-800">
              <MapPin className="w-3.5 h-3.5 text-[#E5383B] shrink-0" />
              <span className="font-bold text-white">{activeSlide.title}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-[#FFD700]">{activeSlide.location}</span>
            </div>

            {/* Center: Interactive Slide Switcher Dots */}
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

            {/* Right: Certified Trust Pill */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-200 bg-neutral-900/90 px-3.5 py-1 rounded-xl border border-neutral-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NIM &amp; ABVIMAS Certified Leaders</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. OUR STORY SECTION (DYNAMICALLY SYNCED WITH ADMIN)
         ==================================================================== */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 5 Columns: Layered Mountain Photo Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 aspect-[4/5] group">
                <img
                  src={settings.story_image_url || DEFAULT_ABOUT_SETTINGS.story_image_url}
                  alt="Trek To Shikhar Community on Himalayan Trail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                {/* Floating Bottom Story Caption */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] block">
                    {settings.story_caption_tag}
                  </span>
                  <p className="font-outfit font-bold text-sm sm:text-base mt-0.5">
                    {settings.story_caption_title}
                  </p>
                </div>
              </div>

              {/* Floating Red Trust Pill */}
              <div className="hidden sm:flex items-center gap-3 absolute -top-5 -right-5 px-5 py-3.5 rounded-2xl bg-[#E5383B] text-white shadow-[0_14px_32px_rgba(229,56,59,0.4)] border-2 border-white">
                <Mountain className="w-6 h-6 shrink-0" />
                <div>
                  <span className="font-outfit font-black text-lg leading-none block">
                    {settings.story_batch_title}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                    {settings.story_batch_subtitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Our Story Chapters */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#E5383B] uppercase tracking-[0.18em] mb-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{settings.story_badge}</span>
                </div>
                <h2 className="font-outfit font-black text-3xl sm:text-4xl md:text-[42px] text-[#0A0A0A] tracking-tight leading-[1.14]">
                  {settings.story_heading}{' '}
                  <span className="text-[#E5383B]">{settings.story_highlight_word}</span>
                </h2>
                <p className="text-neutral-600 text-sm sm:text-base mt-3 leading-relaxed">
                  {settings.story_subtitle}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {storyChapters.map((ch, idx) => (
                  <div
                    key={idx}
                    className="group p-5 sm:p-6 rounded-2xl bg-neutral-50/80 hover:bg-white border border-neutral-200/80 hover:border-[#E5383B]/45 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E5383B] text-white text-[10px] font-black uppercase tracking-wider">
                        {ch.year}
                      </span>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">
                        {ch.tag}
                      </span>
                    </div>
                    <h3 className="font-outfit font-black text-lg text-[#0A0A0A] group-hover:text-[#E5383B] transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-1.5">
                      {ch.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. MEET THE TEAM (GLASSMORPHISM ELEVATED PHOTO CARDS -> POPUP MODAL)
         ==================================================================== */}
      {activeTeam.length > 0 && (
        <section
          id="meet-the-team"
          className="relative overflow-hidden py-20 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-neutral-100/90 via-red-50/35 to-neutral-100/90 border-t border-neutral-200/80 scroll-mt-16"
        >
          {/* Soft Ambient Color Orbs Behind Cards so Glassmorphism Shines */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-45 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(229,56,59,0.22) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.22) 0%, transparent 70%)' }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/75 backdrop-blur-md border border-[#E5383B]/25 text-[11px] font-black uppercase tracking-[0.18em] text-[#E5383B] mb-3 shadow-2xs">
                <Users className="w-3.5 h-3.5" />
                <span>{settings.team_badge}</span>
              </div>
              <h2 className="font-outfit font-black text-3xl sm:text-4xl md:text-[42px] text-[#0A0A0A] tracking-tight">
                {settings.team_heading}
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base mt-2.5 leading-relaxed">
                {settings.team_subtitle}
              </p>
              <div className="mt-5 flex items-center justify-center">
                <div className="h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-[#E5383B] to-transparent" />
              </div>
            </div>

            {/* Interactive Frosted Glass Team Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeTeam.map((member, idx) => (
                <button
                  key={member.id || idx}
                  type="button"
                  onClick={() => setActiveMemberIndex(idx)}
                  className="group relative text-left rounded-3xl overflow-hidden bg-white/65 backdrop-blur-xl border border-white/85 ring-1 ring-neutral-200/70 shadow-[0_14px_38px_-12px_rgba(15,23,42,0.14)] -translate-y-1.5 hover:-translate-y-5 hover:scale-[1.025] hover:bg-white/90 hover:border-[#E5383B] hover:ring-[#E5383B]/35 hover:shadow-[0_32px_65px_-14px_rgba(229,56,59,0.36)] transition-all duration-400 ease-out transform-gpu cursor-pointer flex flex-col focus:outline-none focus:ring-2 focus:ring-[#E5383B]"
                >
                  {/* Portrait Photo */}
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={member.photo}
                      alt={member.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/15 to-transparent" />

                    {/* Frosted Glass Experience Pill Top-Left */}
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-lg border border-white/30 text-[10px] font-extrabold uppercase tracking-wider text-[#FFD700] shadow-md">
                      {member.experience}
                    </span>

                    {/* Hover Glass "View Profile" Pill */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25 backdrop-blur-[3px]">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E5383B]/95 backdrop-blur-md border border-white/30 text-white text-xs font-black uppercase tracking-wider shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Full Profile</span>
                      </span>
                    </div>

                    {/* Frosted Glass Floating Name & Role Card Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-lg group-hover:bg-black/55 group-hover:border-[#FFD700]/40 transition-all duration-300">
                      <h3 className="font-outfit font-black text-lg leading-tight group-hover:text-[#FFD700] transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-white/90 mt-0.5 truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Translucent Glass Card Footer with Hover Text Swap */}
                  <div className="p-4 flex items-center justify-between gap-2 bg-white/60 backdrop-blur-lg border-t border-white/70">
                    <span className="text-[11px] font-bold text-neutral-600 truncate">
                      {member.shortTag || member.short_tag}
                    </span>
                    <span className="relative h-4 overflow-hidden flex flex-col justify-start shrink-0">
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-[#E5383B] leading-4 transition-transform duration-300 group-hover:-translate-y-full">
                        <span>Read Bio</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-[#0A0A0A] leading-4 transition-transform duration-300 group-hover:-translate-y-full">
                        <span>Open Story</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#E5383B]" />
                      </span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          4. GLOBAL "WHY CHOOSE TREKTOSHIKHAR?" ANIMATED COUNTER SECTION
             (Dynamically synced via Admin About Us Hub -> Counters Tab!)
         ==================================================================== */}
      <WhyChooseSection />

      {/* ====================================================================
          5. "WHY YOU SHOULD CHOOSE TREKTOSHIKHAR FOR YOUR NEXT SHIKHAR ADVENTURE?"
         ==================================================================== */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-[#E5383B]/20 text-[11px] font-black uppercase tracking-[0.18em] text-[#E5383B] mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{settings.pillars_badge}</span>
            </div>
            <h2 className="font-outfit font-black text-3xl sm:text-4xl md:text-[42px] text-[#0A0A0A] tracking-tight leading-[1.15]">
              {settings.pillars_heading_prefix}{' '}
              <span className="text-[#E5383B]">{settings.pillars_heading_brand}</span>{' '}
              {settings.pillars_heading_suffix}
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base mt-3 leading-relaxed">
              {settings.pillars_subtitle}
            </p>
            <div className="mt-5 flex items-center justify-center">
              <div className="h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-[#E5383B] to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoosePillars.map((item, idx) => {
              const IconComp = PILLAR_ICON_MAP[item.icon] || HeartHandshake;
              return (
                <div
                  key={item.num || idx}
                  className="group relative p-7 rounded-3xl bg-neutral-50/75 hover:bg-white border border-neutral-200/90 hover:border-[#E5383B] shadow-2xs hover:shadow-[0_20px_46px_-14px_rgba(229,56,59,0.22)] hover:-translate-y-1.5 transition-all duration-350 flex flex-col justify-between overflow-hidden"
                >
                  {/* Watermark Number */}
                  <span className="absolute top-4 right-5 font-outfit font-black text-4xl text-neutral-200/75 group-hover:text-red-100 transition-colors select-none">
                    {item.num || String(idx + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <div className="w-13 h-13 rounded-2xl bg-red-50 text-[#E5383B] border border-red-100 group-hover:bg-[#E5383B] group-hover:text-white group-hover:scale-110 flex items-center justify-center mb-5 transition-all duration-300 shadow-2xs">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <h3 className="font-outfit font-black text-lg sm:text-xl text-[#0A0A0A] leading-snug mb-2.5 pr-8">
                      {item.title}
                    </h3>

                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-neutral-200/70 flex items-center gap-1.5 text-xs font-extrabold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.footer_tag || 'TrekToShikhar Promise'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. GLOBAL VERIFIED GOOGLE REVIEWS MARQUEE (DYNAMIC ADMIN SYNCED)
         ==================================================================== */}
      <GoogleReviewsMarquee />

      {/* ====================================================================
          7. FINAL SHIKHARITE FAMILY CTA SECTION (FULL-BLEED DARK OBSIDIAN THEME)
         ==================================================================== */}
      <section className="relative overflow-hidden py-16 sm:py-22 px-4 sm:px-6 bg-neutral-900 text-white border-t border-neutral-800">
        {/* Ambient Crimson & Gold Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(229,56,59,0.28) 0%, rgba(255,215,0,0.06) 45%, transparent 72%)'
          }}
        />

        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-neutral-950/90 text-white border border-neutral-800 hover:border-[#E5383B]/45 shadow-2xl relative overflow-hidden text-center transition-colors duration-300">
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(229,56,59,0.35) 0%, transparent 65%)'
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-[#FFD700]/30 text-[11px] font-black uppercase tracking-widest text-[#FFD700]">
              <Heart className="w-3.5 h-3.5 text-[#E5383B] fill-[#E5383B]" />
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
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-white hover:to-white hover:text-[#0A0A0A] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_12px_30px_rgba(229,56,59,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative h-5 overflow-hidden flex flex-col justify-start">
                  <span className="leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    {settings.cta_primary_text}
                  </span>
                  <span className="leading-5 text-[#E5383B] transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    {settings.cta_primary_hover_text}
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
                    {settings.cta_secondary_text}
                  </span>
                  <span className="leading-5 font-black text-[#0A0A0A] transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    {settings.cta_secondary_hover_text}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          TEAM MEMBER INTERACTIVE PROFILE POPUP MODAL (REACT PORTAL)
         ==================================================================== */}
      {activeMember &&
        createPortal(
          <div
            onClick={() => setActiveMemberIndex(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200"
            >
              {/* Top Bar with Prev/Next & Close */}
              <div className="px-5 sm:px-6 py-3.5 bg-neutral-950 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5383B]" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#FFD700]">
                    Team Shikharite • {activeMemberIndex + 1} of {activeTeam.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMemberIndex((prev) => (prev - 1 + activeTeam.length) % activeTeam.length)
                    }
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
                    title="Previous Team Member"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMemberIndex((prev) => (prev + 1) % activeTeam.length)
                    }
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
                    title="Next Team Member"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMemberIndex(null)}
                    className="p-1.5 rounded-lg bg-[#E5383B] hover:bg-red-700 text-white ml-1 cursor-pointer transition"
                    aria-label="Close Profile Modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Profile Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Left Photo Column */}
                  <div className="md:col-span-5 relative bg-neutral-900 min-h-[280px] md:min-h-full">
                    <img
                      src={activeMember.photo}
                      alt={activeMember.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E5383B] text-[10px] font-black uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {activeMember.experience}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-200 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                        <span>{activeMember.base}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Details Column */}
                  <div className="md:col-span-7 p-6 sm:p-7 space-y-5">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#E5383B]">
                        {activeMember.role}
                      </span>
                      <h3 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] mt-0.5 leading-tight">
                        {activeMember.name}
                      </h3>
                    </div>

                    {/* Personal Quote */}
                    {activeMember.quote && (
                      <div className="p-4 rounded-2xl bg-red-50/70 border-l-4 border-[#E5383B] relative">
                        <Quote className="w-4 h-4 text-[#E5383B]/40 mb-1" />
                        <p className="text-xs sm:text-sm italic font-semibold text-neutral-800 leading-relaxed">
                          &ldquo;{activeMember.quote}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Full Bio */}
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-1.5">
                        About {activeMember.name.split(' ')[0]}
                      </h4>
                      <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                        {activeMember.bio}
                      </p>
                    </div>

                    {/* Certifications List */}
                    {Array.isArray(activeMember.certifications) && activeMember.certifications.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-2">
                          Certifications &amp; Mountain Credentials
                        </h4>
                        <div className="space-y-1.5">
                          {activeMember.certifications.map((cert, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Favorite Trail & Specialty Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
                      <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                          Favorite Trail
                        </span>
                        <span className="text-xs font-extrabold text-[#0A0A0A] mt-0.5 block">
                          {activeMember.favoriteTrek || activeMember.favorite_trek}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                          Core Specialty
                        </span>
                        <span className="text-xs font-extrabold text-[#0A0A0A] mt-0.5 block">
                          {activeMember.specialty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
