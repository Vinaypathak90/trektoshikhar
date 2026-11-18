import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Mountain,
  Trophy,
  Clock,
  Sprout,
  ShieldCheck,
  Award,
  Compass,
  MapPin,
  Flame,
  Heart,
  Star,
  Tent,
  Footprints,
  Sparkles
} from 'lucide-react';
import {
  DEFAULT_WHY_CHOOSE_DATA,
  getCachedWhyChoose,
  getWhyChooseData
} from '../lib/whyChooseApi';

// Shared Icon Registry (used by both Global Component & Admin Control Module)
export const WHY_CHOOSE_ICON_MAP = {
  Users,
  Mountain,
  Trophy,
  Clock,
  Sprout,
  ShieldCheck,
  Award,
  Compass,
  MapPin,
  Flame,
  Heart,
  Star,
  Tent,
  Footprints
};

export const WHY_CHOOSE_ICON_OPTIONS = Object.keys(WHY_CHOOSE_ICON_MAP);

/**
 * Smooth Animated Number Counter
 * Re-triggers smoothly from 0 -> target every time `isActive` flips to true
 * (e.g., when user scrolls down OR back up into view).
 */
function AnimatedCounter({
  target = 0,
  prefix = '',
  suffix = '+',
  isActive = false,
  runKey = 0,
  duration = 1450
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Reset back to 0 whenever the section scrolls out of view
    if (!isActive) {
      setDisplayValue(0);
      return;
    }

    const numericTarget = Math.max(0, Number(target) || 0);
    if (numericTarget === 0) {
      setDisplayValue(0);
      return;
    }

    let startTimestamp = null;

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easeOutExpo-style curve (fast start, crisp deceleration at end)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * numericTarget);

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, isActive, runKey, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {displayValue.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

/**
 * Global Reusable "Why Choose TrekToShikhar?" Section
 * Drop `<WhyChooseSection />` on ANY page (Home, Treks, About, Contact, Detail).
 * Synced dynamically with Backend API, Supabase, & Admin Dashboard.
 */
export default function WhyChooseSection({
  overrideData = null,
  previewMode = false,
  forceReplayKey = 0,
  className = ''
}) {
  const [sectionData, setSectionData] = useState(
    () => overrideData || getCachedWhyChoose() || DEFAULT_WHY_CHOOSE_DATA
  );
  const [isInView, setIsInView] = useState(previewMode);
  const [runKey, setRunKey] = useState(0);
  const sectionRef = useRef(null);

  // Keep synced with overrideData when used in Admin Live Preview
  useEffect(() => {
    if (overrideData) {
      setSectionData(overrideData);
    }
  }, [overrideData]);

  // Allow Admin Preview to manually replay counter animation
  useEffect(() => {
    if (previewMode && forceReplayKey > 0) {
      setIsInView(false);
      const timer = setTimeout(() => {
        setIsInView(true);
        setRunKey((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [forceReplayKey, previewMode]);

  // Stale-While-Revalidate live fetch + instant event listener for Admin updates
  useEffect(() => {
    if (overrideData) return;

    let isMounted = true;

    async function fetchLive() {
      const res = await getWhyChooseData();
      if (isMounted && res?.data) {
        setSectionData(res.data);
      }
    }

    fetchLive();

    const handleLiveUpdate = (e) => {
      if (isMounted && e?.detail) {
        setSectionData(e.detail);
      }
    };

    window.addEventListener('tts-why-choose-updated', handleLiveUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('tts-why-choose-updated', handleLiveUpdate);
    };
  }, [overrideData]);

  // Re-triggering IntersectionObserver:
  // Resets when section leaves viewport completely, replays when scrolling back up OR down!
  useEffect(() => {
    if (previewMode) {
      setIsInView(true);
      return;
    }

    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
            setIsInView((wasInView) => {
              if (!wasInView) {
                setRunKey((k) => k + 1);
              }
              return true;
            });
          } else if (!entry.isIntersecting) {
            setIsInView(false);
          }
        });
      },
      {
        threshold: [0, 0.12],
        rootMargin: '0px 0px -30px 0px'
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [previewMode]);

  // Hide globally if disabled in Admin Dashboard (except in preview mode)
  if (!previewMode && sectionData?.is_active === false) {
    return null;
  }

  const stats = Array.isArray(sectionData?.stats) ? sectionData.stats : [];
  if (stats.length === 0) return null;

  // Dynamic responsive grid class depending on card count
  const getGridColsClass = (count) => {
    if (count === 1) return 'grid-cols-1 max-w-xs mx-auto';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto';
    if (count === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    if (count === 6) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
  };

  return (
    <section
      ref={sectionRef}
      id="why-choose-shikhar"
      className={`relative overflow-hidden border-y border-neutral-800 bg-neutral-900 text-white ${
        previewMode ? 'py-10 px-4 rounded-3xl border' : 'py-16 sm:py-22 px-4 sm:px-6'
      } ${className}`}
    >
      {/* Subtle Dark Alpine Ambient Glow Backdrop */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[820px] h-[280px] pointer-events-none opacity-45 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(229, 56, 59, 0.22) 0%, rgba(255, 215, 0, 0.06) 50%, transparent 75%)'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ============================================================
            1. SECTION HEADER WITH SIGNATURE RED ACCENT UNDERLINE
           ============================================================ */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          {sectionData.badge_text && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-[#FFD700]/30 text-[11px] font-black uppercase tracking-[0.18em] text-[#FFD700] mb-3.5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>{sectionData.badge_text}</span>
            </div>
          )}

          <h2 className="font-outfit font-black text-3xl sm:text-4xl md:text-[42px] text-white tracking-tight leading-[1.15]">
            {sectionData.title || 'Why Choose TrekToShikhar?'}
          </h2>

          {sectionData.subtitle && (
            <p className="mt-3 text-neutral-300 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
              {sectionData.subtitle}
            </p>
          )}

          {/* Signature Tapered Crimson Accent Line */}
          <div className="mt-6 flex items-center justify-center">
            <div className="h-[3px] w-24 sm:w-28 rounded-full bg-gradient-to-r from-transparent via-[#E5383B] to-transparent shadow-[0_2px_14px_rgba(229,56,59,0.75)]" />
          </div>
        </div>

        {/* ============================================================
            2. STYLISH ANIMATED COUNTER STAT CARDS GRID (DARK THEME)
           ============================================================ */}
        <div className={`grid ${getGridColsClass(stats.length)} gap-4 sm:gap-5`}>
          {stats.map((item, idx) => {
            const IconComponent = WHY_CHOOSE_ICON_MAP[item.icon] || Mountain;
            const isHighlighted = Boolean(item.is_highlighted);

            return (
              <div
                key={item.id || idx}
                className={`group relative rounded-2xl sm:rounded-3xl bg-neutral-800/80 backdrop-blur-sm p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-350 ease-out transform-gpu hover:-translate-y-2 cursor-default overflow-hidden ${
                  isHighlighted
                    ? 'border-[1.5px] border-[#E5383B] bg-neutral-800/95 shadow-[0_14px_38px_-10px_rgba(229,56,59,0.38)] hover:shadow-[0_22px_50px_-10px_rgba(229,56,59,0.5)]'
                    : 'border border-neutral-700/80 shadow-md hover:border-[#E5383B] hover:bg-neutral-800 hover:shadow-[0_20px_46px_-12px_rgba(229,56,59,0.35)]'
                }`}
              >
                {/* Subtle Hover Top Red Accent Bar */}
                <div
                  className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E5383B] to-transparent transition-opacity duration-300 ${
                    isHighlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                />

                {/* Icon Container with Crimson Theme Glow */}
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-[#E5383B]/15 text-[#E5383B] ring-1 ring-[#E5383B]/35 group-hover:bg-[#E5383B] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_8px_22px_rgba(229,56,59,0.5)]'
                      : 'bg-white/5 text-[#E5383B] border border-white/10 group-hover:bg-[#E5383B] group-hover:text-white group-hover:border-[#E5383B] group-hover:scale-110 group-hover:shadow-[0_8px_22px_rgba(229,56,59,0.45)]'
                  }`}
                >
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
                </div>

                {/* Animated Live Counter Number (Golden Accent matching Milestones) */}
                <div className="font-outfit font-black text-2xl sm:text-[28px] xl:text-[31px] text-[#FFD700] tracking-tight leading-none transition-transform duration-300 group-hover:scale-105">
                  <AnimatedCounter
                    target={item.target_number}
                    prefix={item.prefix || ''}
                    suffix={item.suffix ?? '+'}
                    isActive={isInView}
                    runKey={runKey}
                    duration={1350 + idx * 120}
                  />
                </div>

                {/* Primary Stat Label */}
                <h3 className="font-outfit font-extrabold text-sm sm:text-[15px] text-white mt-2.5 leading-snug">
                  {item.label}
                </h3>

                {/* Secondary Description Subtext */}
                {item.sublabel && (
                  <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed max-w-[190px]">
                    {item.sublabel}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
