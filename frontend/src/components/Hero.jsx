import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Flame 
} from 'lucide-react';

export default function Hero({ onExploreClick, onAboutClick }) {
  // Ultra-HD Authentic Himalayan Trekking Photos with people/trekkers
  const trekBackdrops = [
    {
      url: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=80",
      title: "Kedarkantha Summit Ridge",
      location: "Uttarakhand (12,500 ft)",
      highlight: "Winter Snow Expedition",
      nextBatch: "22 Nov • 4 slots left"
    },
    {
      url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80",
      title: "Nag Tibba Alpine Crest",
      location: "Dehradun / Pantwari (9,915 ft)",
      highlight: "Best Weekend Trek",
      nextBatch: "Every Friday Departure"
    },
    {
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
      title: "Hatu Peak Snow Walk",
      location: "Narkanda / Shimla (11,150 ft)",
      highlight: "360° Himalayan Panorama",
      nextBatch: "Weekend Escapes Open"
    },
    {
      url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1920&q=80",
      title: "Churdhar Sanctuary Summit",
      location: "Himachal Shivalik (11,965 ft)",
      highlight: "High Altitude Wilderness",
      nextBatch: "Registration Live"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Faster background transition: 4.5 seconds for lively movement
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trekBackdrops.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [trekBackdrops.length]);

  return (
    <section className="relative w-full h-screen min-h-[640px] max-h-[960px] flex flex-col justify-between overflow-hidden px-4 sm:px-8 pt-20 pb-6 transition-all duration-500">
      
      {/* ====================================================================
          1. ULTRA-HD CINEMATIC BACKGROUND (FASTER RIGHT-TO-LEFT & ZOOM SWEEP)
         ==================================================================== */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none z-0 pointer-events-none">
        {trekBackdrops.map((slide, idx) => (
          <div
            key={idx}
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

        {/* Crisp Cinematic Mesh: Keeps photo 100% sharp while text remains legible */}
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
          3. MAIN CENTER HERO CONTENT (LIGHTER, SLEEKER, MORE REFINED FONTS)
         ==================================================================== */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center gap-3 sm:gap-4 my-auto">
        
        {/* Live Batch Alert Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-[11px] sm:text-xs font-bold text-amber-200 shadow-md">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>Upcoming: {trekBackdrops[currentSlide].title}</span>
          <span className="text-white/40">•</span>
          <span className="text-white font-semibold">{trekBackdrops[currentSlide].nextBatch}</span>
        </div>

        {/* Master Headline (Refined font weight: less heavy, more elegant & spacious) */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-outfit uppercase tracking-wider text-white leading-[1.12] drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
          Walk the untouched trails <br />
          <span className="font-brush lowercase text-3xl sm:text-5xl md:text-6xl text-amber-300 block mt-1 sm:mt-2 transform -rotate-1 font-normal drop-shadow-[0_2px_14px_rgba(252,211,77,0.45)]">
            reach your shikhar
          </span>
        </h1>

        {/* Subtitle (Lighter, modern & readable) */}
        <p className="max-w-2xl text-xs sm:text-sm md:text-base font-normal text-white/85 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] px-2">
          Curated mountain expeditions with certified Himalayan leaders across 
          <span className="font-semibold text-amber-200"> Shimla</span>, 
          <span className="font-semibold text-amber-200"> Dehradun</span>, and the high peaks. Small batches, verified alpine gear, zero compromises on safety.
        </p>

        {/* Primary CTA Buttons with Distinct Hover Color Transformations */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-3 w-full sm:w-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm tracking-wider font-extrabold uppercase text-white bg-[#E5383B] hover:bg-neutral-950 hover:text-[#FFD700] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#FFD700]/50"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Upcoming Treks</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onAboutClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm tracking-wider font-extrabold uppercase text-[#0A0A0A] bg-white hover:bg-[#E5383B] hover:text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-transparent hover:border-white"
          >
            <ShieldCheck className="w-4 h-4 text-[#E5383B] group-hover:text-white" />
            <span>Why Trek With Us</span>
          </button>
        </div>

      </div>

      {/* ====================================================================
          4. BOTTOM BAR: LIVE MOUNTAIN INFO + SLIDE PROGRESS + TRUST BADGE
         ==================================================================== */}
      <div className="relative z-20 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/15">
        
        {/* Left: Trail Location & Altitude */}
        <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
          <MapPin className="w-3.5 h-3.5 text-[#E5383B] shrink-0" />
          <span className="font-bold text-white">{trekBackdrops[currentSlide].title}</span>
          <span className="text-white/40">•</span>
          <span className="text-amber-300">{trekBackdrops[currentSlide].location}</span>
        </div>

        {/* Center: Slide Switcher Tabs */}
        <div className="flex items-center gap-2">
          {trekBackdrops.map((slide, i) => (
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

        {/* Right: Trust & Ratings */}
        <div className="flex items-center gap-4 text-xs font-semibold text-white/90">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NIM Certified</span>
          </div>
          <span className="text-white/30">•</span>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>4.9/5 (2,400+ Trekkers)</span>
          </div>
        </div>

      </div>

    </section>
  );
}
