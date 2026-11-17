import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mountain, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Award, 
  Tent, 
  Activity, 
  Compass, 
  ChevronRight,
  Share2,
  Download
} from 'lucide-react';
import { TREKS, AGENCY_CONTACT } from '../data/treksData';

export default function TrekDetailPage({ trek: propTrek, onBack, onBookTrek }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Load trek from prop or find by slug or ID
  const trek = propTrek || TREKS.find(t => t.slug === slug || String(t.id) === slug) || TREKS[0];
  const handleBack = onBack || (() => navigate('/track'));

  if (!trek) return null;

  const [activeTab, setActiveTab] = useState('itinerary');
  const [expandedDay, setExpandedDay] = useState(0); // Day 1 open by default
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Auto-cycle through hero images smoothly
  useEffect(() => {
    if (!trek.heroImages || trek.heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % trek.heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [trek.heroImages]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [trek.id]);

  const toggleDay = (idx) => {
    setExpandedDay(expandedDay === idx ? -1 : idx);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${trek.title} — TrekToShikhar`,
        text: `Check out ${trek.title} (${trek.altitude}) in ${trek.location} with TrekToShikhar!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] pb-24 selection:bg-[#E5383B] selection:text-white pt-20 sm:pt-24">
      
      {/* ====================================================================
          1. TOP NAVIGATION / BREADCRUMB BAR (SMOOTH HOVER BUTTONS)
         ==================================================================== */}
      <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-16 z-30 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-neutral-200/90 bg-white hover:bg-[#E5383B] text-neutral-700 hover:text-white hover:border-[#E5383B] transition-all duration-300 shadow-2xs hover:shadow-md cursor-pointer group text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Treks</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Home</span>
            <span>/</span>
            <span>{trek.region === 'shimla' ? 'Shimla Base' : 'Dehradun Base'}</span>
            <span>/</span>
            <span className="font-bold text-[#0A0A0A]">{trek.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
              title="Share Trek"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onBookTrek(trek)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-neutral-950 hover:to-neutral-900 text-white hover:text-[#25D366] text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-1.5 border border-transparent hover:border-[#25D366]/40"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Book via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. DYNAMIC HERO HEADER (RIGHT-TO-LEFT MOVING ZOOMABLE IMAGES)
         ==================================================================== */}
      <section className="relative h-[68vh] min-h-[500px] max-h-[720px] overflow-hidden bg-neutral-900 text-white flex items-center justify-center">
        
        {/* Carousel Layers with Luxury Right-to-Left Sweep & Zoom Animation */}
        {trek.heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 transform-gpu ${
              idx === activeImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={img}
              alt={`${trek.title} view ${idx + 1}`}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`w-full h-full object-cover transform-gpu ${
                idx === activeImageIndex ? 'animate-luxury-right-to-left' : ''
              }`}
            />
          </div>
        ))}

        {/* Cinematic Scrim Gradient (Crystal clear image center, darker bottom for text readability) */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/35 to-black/30 pointer-events-none" />

        {/* Hero Overlay Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-30 text-center flex flex-col items-center">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-widest mb-4 border border-white/25 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-white">{trek.tag}</span>
            <span className="text-amber-300">• {trek.altitude}</span>
          </div>

          {/* Master Trek Title */}
          <h1 className="font-outfit font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-tight drop-shadow-lg">
            {trek.title}
          </h1>

          {/* Sharp Golden Cursive Subtitle */}
          <p className="font-satisfy text-2xl sm:text-4xl text-[#FFD700] mt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
            {trek.tagline}
          </p>

          <p className="text-white/90 text-xs sm:text-sm max-w-2xl mx-auto mt-4 leading-relaxed font-medium drop-shadow-xs">
            {trek.overview}
          </p>

          {/* Action Button Row with Dynamic Mouse Hover Color Transformations */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onBookTrek(trek)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-neutral-950 hover:to-neutral-900 text-white hover:text-[#25D366] font-extrabold text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 border border-transparent hover:border-[#25D366]"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Book Batch on WhatsApp</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('itinerary-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-[#E5383B] text-white hover:text-white backdrop-blur-md font-bold text-sm border border-white/30 hover:border-[#E5383B] shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
            >
              <span>View Day-Wise Itinerary</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Image Indicator Dots */}
        {trek.heroImages.length > 1 && (
          <div className="absolute bottom-5 inset-x-0 z-30 flex items-center justify-center gap-2">
            {trek.heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeImageIndex ? 'w-8 bg-[#FFD700]' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ====================================================================
          3. FLOATING QUICK FACTS BAR
         ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-30">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/90 p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
          
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Summit Altitude</span>
            <span className="font-outfit font-black text-lg sm:text-xl text-[#0A0A0A] mt-0.5">{trek.altitude}</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Duration</span>
            <span className="font-outfit font-black text-lg sm:text-xl text-[#0A0A0A] mt-0.5">{trek.duration}</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Difficulty</span>
            <span className="font-outfit font-black text-lg sm:text-xl text-[#E5383B] mt-0.5">{trek.difficulty}</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Trail</span>
            <span className="font-outfit font-black text-lg sm:text-xl text-[#0A0A0A] mt-0.5">{trek.distance}</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Base Camp</span>
            <span className="font-outfit font-black text-sm text-[#0A0A0A] mt-0.5 truncate max-w-[130px]">{trek.baseCamp}</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Starting From</span>
            <span className="font-outfit font-black text-xl sm:text-2xl text-[#E5383B] mt-0.5">₹{trek.price.toLocaleString('en-IN')}</span>
          </div>

        </div>
      </div>

      {/* ====================================================================
          4. MAIN CONTENT TABS / SECTION CONTAINER
         ==================================================================== */}
      <div id="itinerary-section" className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 scroll-mt-28">
        
        {/* Navigation Sticky Sub-tabs (Interactive Pills with Hover Glow) */}
        <div className="flex border-b border-neutral-200 overflow-x-auto gap-2 sm:gap-3 pb-3 mb-10 scrollbar-none">
          {[
            { id: 'itinerary', label: 'Day-Wise Itinerary' },
            { id: 'why', label: 'Why This Trek?' },
            { id: 'packages', label: 'Packages & Pricing' },
            { id: 'inclusions', label: 'Inclusions & Exclusions' },
            { id: 'gear', label: 'Gear Checklist' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white shadow-lg shadow-[#E5383B]/25 scale-102'
                  : 'bg-neutral-100/90 text-neutral-600 hover:bg-neutral-200 hover:text-black hover:-translate-y-0.5'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Animated Tab Content Wrapper */}
        <div key={activeTab} className="animate-tab-switch">

          {/* ====================================================================
              TAB 1: ITINERARY (TERNARY) — REVEAL ON HOVER / CLICK WITH SMOOTH EXPANSION
             ==================================================================== */}
          {activeTab === 'itinerary' && (
            <div className="space-y-8">
              <div className="max-w-3xl">
                <span className="text-xs font-bold text-[#E5383B] uppercase tracking-widest">
                  Detailed Expedition Route
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[#0A0A0A] mt-1">
                  Day-by-Day Himalayan Itinerary
                </h2>
                <p className="text-neutral-500 text-sm mt-1">
                  Hover or click any day to smoothly reveal trail highlights, altitude profiles, and stay details.
                </p>
              </div>

              {/* Day Timeline Cards with Hover & Click Smooth Expansion */}
              <div className="space-y-4">
                {trek.itinerary.map((dayItem, idx) => {
                  const isOpen = expandedDay === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setExpandedDay(idx)}
                      onClick={() => toggleDay(idx)}
                      className={`rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform-gpu ${
                        isOpen 
                          ? 'border-2 border-[#E5383B] bg-white shadow-[0_20px_45px_-10px_rgba(229,56,59,0.22)] -translate-y-1' 
                          : 'border border-neutral-200/90 bg-white shadow-xs hover:border-[#E5383B]/60 hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      {/* Header Bar */}
                      <div className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all duration-300 ${
                            isOpen 
                              ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white shadow-md shadow-[#E5383B]/30' 
                              : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {dayItem.day}
                          </span>
                          <div>
                            <h3 className={`font-outfit font-black text-base sm:text-lg transition-colors duration-200 ${
                              isOpen ? 'text-[#E5383B]' : 'text-[#0A0A0A]'
                            }`}>
                              {dayItem.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Compass className="w-3.5 h-3.5 text-neutral-400" />
                                {dayItem.distance}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Mountain className="w-3.5 h-3.5 text-neutral-400" />
                                {dayItem.altitude}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={`p-2 rounded-full transition-all duration-300 shrink-0 ${
                          isOpen ? 'bg-[#E5383B] text-white rotate-180 shadow-xs' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Smooth Height Expansion via CSS Grid Rows */}
                      <div 
                        className={`grid transition-all duration-400 ease-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-neutral-100 bg-neutral-50/50 space-y-4 animate-itinerary-details">
                            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                              <span className="text-xs font-black uppercase tracking-wider text-[#E5383B] block mb-1">
                                Key Trail Highlights
                              </span>
                              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                                {dayItem.highlights}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                                <span className="text-neutral-400 block font-bold">Estimated Time</span>
                                <span className="font-bold text-neutral-800 mt-0.5 block">{dayItem.time}</span>
                              </div>

                              <div className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                                <span className="text-neutral-400 block font-bold">Night Stay</span>
                                <span className="font-bold text-neutral-800 mt-0.5 block truncate">{dayItem.stay}</span>
                              </div>

                              <div className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                                <span className="text-neutral-400 block font-bold">Meals Included</span>
                                <span className="font-bold text-neutral-800 mt-0.5 block truncate">{dayItem.meals}</span>
                              </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBookTrek(trek);
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-extrabold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
                              >
                                <span>Book This Itinerary</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================================
              TAB 2: WHY THIS TREK? (POPUP 3D ELEVATION ON HOVER)
             ==================================================================== */}
          {activeTab === 'why' && (
            <div className="space-y-8">
              <div className="max-w-3xl">
                <span className="text-xs font-bold text-[#E5383B] uppercase tracking-widest">
                  Curated Mountain Essence
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[#0A0A0A] mt-1">
                  Why is {trek.title} a Must-Do Trek?
                </h2>
                <p className="text-neutral-500 text-sm mt-1">
                  Hover over each feature card to experience the rich mountain details.
                </p>
              </div>

              {/* Grid with 3D Popup Elevation & Glowing Crimson Shadow */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trek.whyMustDo.map((item, i) => (
                  <div
                    key={i}
                    className="group relative p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200/90 hover:border-[#E5383B] shadow-sm hover:shadow-[0_24px_50px_-8px_rgba(229,56,59,0.25),0_8px_16px_rgba(0,0,0,0.06)] hover:-translate-y-3 hover:scale-[1.02] transition-all duration-350 ease-out cursor-pointer transform-gpu will-change-transform flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E5383B] group-hover:bg-[#E5383B] group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 font-black text-base mb-4 flex items-center justify-center shadow-xs">
                        {i + 1}
                      </div>
                      <h3 className="font-outfit font-black text-lg text-[#0A0A0A] group-hover:text-[#E5383B] transition-colors duration-200 mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-bold text-[#E5383B] group-hover:translate-x-1.5 transition-transform">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Trail Feature</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================================
              TAB 3: PACKAGES & PRICING (POPUP 3D ELEVATION ON HOVER)
             ==================================================================== */}
          {activeTab === 'packages' && (
            <div className="space-y-8">
              <div className="max-w-3xl">
                <span className="text-xs font-bold text-[#E5383B] uppercase tracking-widest">
                  Transparent Pricing
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[#0A0A0A] mt-1">
                  Expedition Packages &amp; Batch Options
                </h2>
                <p className="text-neutral-500 text-sm mt-1">
                  Choose between direct base camp reporting or all-inclusive roundtrip mountain transit.
                </p>
              </div>

              {/* Grid with 3D Popup Elevation & Smooth WhatsApp Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trek.packages.map((pkg, i) => (
                  <div
                    key={i}
                    className="group relative rounded-3xl border-2 border-neutral-200 hover:border-[#E5383B] p-6 sm:p-8 bg-white shadow-md hover:shadow-[0_26px_55px_-10px_rgba(229,56,59,0.3),0_10px_20px_rgba(0,0,0,0.08)] hover:-translate-y-3.5 hover:scale-[1.02] transition-all duration-350 ease-out flex flex-col justify-between overflow-hidden cursor-pointer transform-gpu will-change-transform"
                  >
                    {pkg.badge && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200 group-hover:scale-105 transition-transform">
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <h3 className="font-outfit font-black text-2xl text-[#0A0A0A] group-hover:text-[#E5383B] transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-neutral-500 text-xs sm:text-sm mt-1.5 mb-5">
                        {pkg.desc}
                      </p>

                      <div className="mb-6">
                        <span className="text-3xl sm:text-4xl font-black font-outfit text-[#E5383B] group-hover:scale-105 transition-transform inline-block">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-neutral-500 text-xs font-medium ml-1.5">
                          / person (All taxes incl.)
                        </span>
                      </div>

                      <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                        <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                          Included in this package:
                        </span>
                        {pkg.includes.map((inc, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-neutral-100">
                      <button
                        onClick={() => onBookTrek(trek, pkg)}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-neutral-950 hover:to-neutral-900 text-white hover:text-[#25D366] font-extrabold text-sm shadow-md hover:shadow-xl hover:scale-102 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-[#25D366]"
                      >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        <span>Book on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================================
              TAB 4: INCLUSIONS & EXCLUSIONS (POPUP 3D ELEVATION ON HOVER)
             ==================================================================== */}
          {activeTab === 'inclusions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inclusions */}
              <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/50 hover:bg-emerald-50/80 border-2 border-emerald-200 hover:border-emerald-500 shadow-sm hover:shadow-[0_24px_50px_-8px_rgba(16,185,129,0.22)] hover:-translate-y-3 hover:scale-[1.015] transition-all duration-350 ease-out transform-gpu cursor-pointer">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-outfit font-black text-xl text-emerald-950">
                    What is Included in Your Trek
                  </h3>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-emerald-900/90 font-medium">
                  {trek.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 hover:bg-white border-2 border-neutral-200 hover:border-neutral-400 shadow-sm hover:shadow-[0_24px_50px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-3 hover:scale-[1.015] transition-all duration-350 ease-out transform-gpu cursor-pointer">
                <div className="flex items-center gap-2 mb-6">
                  <XCircle className="w-6 h-6 text-neutral-400" />
                  <h3 className="font-outfit font-black text-xl text-neutral-800">
                    What is Not Included
                  </h3>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-600 font-medium">
                  {trek.exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ====================================================================
              TAB 5: GEAR CHECKLIST (POPUP 3D ELEVATION ON HOVER)
             ==================================================================== */}
          {activeTab === 'gear' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 max-w-4xl mx-auto shadow-sm">
              <span className="text-xs font-bold text-[#E5383B] uppercase tracking-widest">
                Mountain Packing Essentials
              </span>
              <h3 className="font-outfit font-black text-2xl text-[#0A0A0A] mt-1 mb-4">
                Gear Checklist for {trek.title}
              </h3>
              <p className="text-neutral-500 text-sm mb-6">
                Hover over gear items to see requirements for sub-zero alpine conditions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {trek.gearList.map((gear, i) => (
                  <div 
                    key={i} 
                    className="group flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#E5383B] shadow-2xs hover:shadow-[0_12px_28px_-6px_rgba(229,56,59,0.2)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer transform-gpu"
                  >
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E5383B] group-hover:bg-[#E5383B] group-hover:text-white group-hover:scale-110 transition-all duration-300 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {i + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-neutral-800 group-hover:text-[#E5383B] transition-colors">{gear}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ====================================================================
          5. STICKY BOTTOM FLOATING BAR (WITH DYNAMIC HOVER COLOR CHANGE)
         ==================================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 py-3.5 px-4 sm:px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div>
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-bold block">
              {trek.title} • {trek.duration}
            </span>
            <span className="font-outfit font-black text-xl text-[#E5383B]">
              ₹{trek.price.toLocaleString('en-IN')}
              <span className="text-xs text-neutral-500 font-normal"> /person</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onBookTrek(trek)}
              className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-neutral-950 hover:to-neutral-900 text-white hover:text-[#25D366] font-extrabold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer border border-transparent hover:border-[#25D366]"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Book on WhatsApp</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}