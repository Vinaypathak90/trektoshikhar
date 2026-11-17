import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  MapPin, 
  Flame 
} from 'lucide-react';
import { getHeroSlides, getCachedHeroSlides } from '../lib/heroApi';

export default function Hero({ onExploreClick, onAboutClick }) {
  // Initial fallback slides in case network is initializing
  const fallbackSlides = [
    {
      id: '1',
      url: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=80",
      title: "Kedarkantha Summit Ridge",
      location: "Uttarakhand (12,500 ft)",
      highlight: "Winter Snow Expedition",
      nextBatch: "22 Nov • 4 slots left",
      headlineLine1: "WALK THE UNTOUCHED TRAILS",
      cursiveText: "reach your shikhar",
      subtitle: "Curated mountain expeditions with certified Himalayan leaders across Shimla, Dehradun, and the high peaks. Small batches, verified alpine gear, zero compromises on safety."
    },
    {
      id: '2',
      url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80",
      title: "Nag Tibba Alpine Crest",
      location: "Dehradun / Pantwari (9,915 ft)",
      highlight: "Best Weekend Trek",
      nextBatch: "Every Friday Departure",
      headlineLine1: "EXPERIENCE THE RIDGE WALK",
      cursiveText: "serenity above clouds",
      subtitle: "Fast weekend summit escape from Delhi & Dehradun with certified NIM mountain guides. High-altitude camp overlooking snow ranges."
    },
    {
      id: '3',
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
      title: "Hatu Peak Snow Walk",
      location: "Narkanda / Shimla (11,150 ft)",
      highlight: "360° Himalayan Panorama",
      nextBatch: "Weekend Escapes Open",
      headlineLine1: "SHIMLA ALPINE ESCAPE",
      cursiveText: "wander amidst pines",
      subtitle: "Dense oak forests and ancient pine trails leading to panoramic Greater Himalayan vistas across Shrikhand Mahadev range."
    },
    {
      id: '4',
      url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1920&q=80",
      title: "Churdhar Sanctuary Summit",
      location: "Himachal Shivalik (11,965 ft)",
      highlight: "High Altitude Wilderness",
      nextBatch: "Registration Live",
      headlineLine1: "HIGHEST SHIVALIK PEAK",
      cursiveText: "untouched solitude",
      subtitle: "Walk through glacial boulder fields and sacred deodar valleys in Himachal Pradesh with certified wilderness first responders."
    }
  ];

  const [slides, setSlides] = useState(() => {
    const cached = getCachedHeroSlides();
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached.map((d) => ({
        id: d.id,
        url: d.image_url || d.url,
        title: d.title,
        location: d.location,
        highlight: d.highlight,
        nextBatch: d.next_batch || d.nextBatch,
        headlineLine1: d.headline_line1 || d.headlineLine1,
        cursiveText: d.cursive_text || d.cursiveText,
        subtitle: d.subtitle,
        buttonPrimaryText: d.button_primary_text || d.buttonPrimaryText,
        buttonPrimaryLink: d.button_primary_link || d.buttonPrimaryLink,
        buttonSecondaryText: d.button_secondary_text || d.buttonSecondaryText,
        buttonSecondaryLink: d.button_secondary_link || d.buttonSecondaryLink
      }));
    }
    return fallbackSlides;
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch dynamic slides from Database / Backend API
  useEffect(() => {
    let isMounted = true;

    async function loadDynamicSlides() {
      try {
        const data = await getHeroSlides(false);
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d) => ({
            id: d.id,
            url: d.image_url || d.url,
            title: d.title,
            location: d.location,
            highlight: d.highlight,
            nextBatch: d.next_batch || d.nextBatch,
            headlineLine1: d.headline_line1 || d.headlineLine1 || "WALK THE UNTOUCHED TRAILS",
            cursiveText: d.cursive_text || d.cursiveText || "reach your shikhar",
            subtitle: d.subtitle || "Curated mountain expeditions with certified Himalayan leaders across Shimla, Dehradun, and the high peaks.",
            buttonPrimaryText: d.button_primary_text || "Explore Upcoming Treks",
            buttonSecondaryText: d.button_secondary_text || "Why Trek With Us"
          }));
          setSlides(mapped);
        }
      } catch (err) {
        console.warn("Using default fallback slides:", err);
      }
    }

    loadDynamicSlides();
    return () => { isMounted = false; };
  }, []);

  // Slide transition timer: 4.5 seconds for lively movement
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide] || slides[0] || fallbackSlides[0];

  return (
    <section className="relative w-full h-screen min-h-[640px] max-h-[960px] flex flex-col justify-between overflow-hidden px-4 sm:px-8 pt-20 pb-6 transition-all duration-500">
      
      {/* ====================================================================
          1. ULTRA-HD CINEMATIC BACKGROUND (FASTER RIGHT-TO-LEFT & ZOOM SWEEP)
         ==================================================================== */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none z-0 pointer-events-none">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out transform-gpu ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img 
              src={slide.url} 
              alt={slide.title}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`w-full h-full object-cover object-center transform-gpu ${
                idx === currentSlide ? 'animate-luxury-right-to-left' : ''
              }`}
            />
          </div>
        ))}

        {/* Crisp Cinematic Mesh: Keeps photo sharp while text remains legible */}
        <div 
          className="absolute inset-0 w-full h-full z-15"
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.48) 75%, rgba(0,0,0,0.72) 100%)'
          }}
        />

        {/* Ambient Top & Bottom Lighting */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/55 to-transparent z-15" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-15" />
      </div>

      {/* Top Spacer maintaining exact layout position */}
      <div className="relative z-20 h-4 sm:h-6" />

      {/* ====================================================================
          3. MAIN CENTER HERO CONTENT (DYNAMIC FROM DATABASE / CRM)
         ==================================================================== */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center gap-3 sm:gap-4 my-auto">
        
        {/* Live Batch Alert Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-[11px] sm:text-xs font-bold text-amber-200 shadow-md">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>Upcoming: {activeSlide.title}</span>
          <span className="text-white/40">•</span>
          <span className="text-white font-semibold">{activeSlide.nextBatch}</span>
        </div>

        {/* Dynamic Master Headline & Brush Cursive Tagline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-outfit uppercase tracking-wider text-white leading-[1.12] drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
          {activeSlide.headlineLine1 || "Walk the untouched trails"} <br />
          <span className="font-brush lowercase text-3xl sm:text-5xl md:text-6xl text-amber-300 block mt-1 sm:mt-2 transform -rotate-1 font-normal drop-shadow-[0_2px_14px_rgba(252,211,77,0.45)]">
            {activeSlide.cursiveText || "reach your shikhar"}
          </span>
        </h1>

        {/* Dynamic Subtitle */}
        <p className="max-w-2xl text-xs sm:text-sm md:text-base font-normal text-white/85 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] px-2">
          {activeSlide.subtitle}
        </p>

        {/* Primary CTA Buttons with Distinct Hover Color Transformations (Fixed Routes) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-3 w-full sm:w-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm tracking-wider font-extrabold uppercase text-white bg-[#E5383B] hover:bg-neutral-950 hover:text-[#FFD700] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#FFD700]/50"
          >
            <Compass className="w-4 h-4" />
            <span>{activeSlide.buttonPrimaryText || "Explore Upcoming Treks"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onAboutClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm tracking-wider font-extrabold uppercase text-[#0A0A0A] bg-white hover:bg-[#E5383B] hover:text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-transparent hover:border-white group"
          >
            <ShieldCheck className="w-4 h-4 text-[#E5383B] group-hover:text-white" />
            <span>{activeSlide.buttonSecondaryText || "Why Trek With Us"}</span>
          </button>
        </div>

      </div>

      {/* ====================================================================
          4. BOTTOM BAR: LIVE MOUNTAIN INFO + SLIDE PROGRESS TABS
         ==================================================================== */}
      <div className="relative z-20 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/15">
        
        {/* Left: Trail Location & Altitude */}
        <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
          <MapPin className="w-3.5 h-3.5 text-[#E5383B] shrink-0" />
          <span className="font-bold text-white">{activeSlide.title}</span>
          <span className="text-white/40">•</span>
          <span className="text-amber-300">{activeSlide.location}</span>
        </div>

        {/* Center: Slide Switcher Tabs */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide 
                  ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50' 
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Right: Certified Trust Badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>NIM &amp; ABVIMAS Certified Leaders</span>
        </div>

      </div>

    </section>
  );
}
