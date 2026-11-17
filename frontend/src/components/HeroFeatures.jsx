import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  Activity, 
  Tent, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Mountain,
  Users,
  Star
} from 'lucide-react';

// Animated Number Counter Hook & Component
function AnimatedCounter({ end, duration = 2000, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic curve for silky smooth counting
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOutProgress * end;

            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const formatted = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString('en-IN');

  return (
    <span ref={elementRef}>
      {formatted}{suffix}
    </span>
  );
}

export default function HeroFeatures() {
  const pillars = [
    {
      icon: Award,
      kicker: "Himalayan Mentorship",
      title: "Certified Mountain Leaders",
      desc: "Every batch is guided by certified mountaineers from NIM Uttarkashi & ABVIMAS Manali with 8+ years Himalayan trail experience.",
      badge: "NIM / ABVIMAS",
      perk: "Govt. Accredited Leaders"
    },
    {
      icon: Activity,
      kicker: "Medical Preparedness",
      title: "Medical Grade Altitude Safety",
      desc: "Equipped with high-altitude portable oxygen cylinders, oximeters, specialized first-aid kits, and trained wilderness first responders.",
      badge: "Altitude Protocol",
      perk: "Oxygen & First-Aid on Trail"
    },
    {
      icon: Tent,
      kicker: "Premium Mountain Gear",
      title: "All-Inclusive Alpine Gear",
      desc: "Waterproof 4-season alpine tents, sub-zero thermal sleeping bags, crampons, gaiters, and freshly prepared hot mountain meals.",
      badge: "Alpine Tested",
      perk: "Sub-Zero Sleeping Bags"
    },
    {
      icon: HeartHandshake,
      kicker: "Ethical Exploration",
      title: "Small Intimate Batches",
      desc: "Capped strictly at 12–15 trekkers per group. No overcrowded commercial herds, just authentic mountain camaraderie and safety.",
      badge: "Max 15 Trekkers",
      perk: "Personalized Safety & Care"
    }
  ];

  const stats = [
    { 
      icon: Mountain,
      num: 15, 
      suffix: "+", 
      label: "Himalayan Trails", 
      sub: "Shimla & Dehradun Base" 
    },
    { 
      icon: Users,
      num: 2400, 
      suffix: "+", 
      label: "Trekkers Guided", 
      sub: "Solo & Group Explorers" 
    },
    { 
      icon: ShieldCheck,
      num: 100, 
      suffix: "%", 
      label: "Certified Leaders", 
      sub: "NIM & ABVIMAS Certified" 
    },
    { 
      icon: Star,
      num: 4.9, 
      suffix: " ★", 
      decimals: 1, 
      label: "Trekkers Rating", 
      sub: "Google & Trustpilot Reviews" 
    }
  ];

  // Duplicated for seamless infinite Right-to-Left loop
  const infinitePillars = [...pillars, ...pillars];

  return (
    <section 
      id="red-section" 
      className="bg-gradient-to-b from-[#F05558] via-[#EA4548] to-[#E03A3E] text-white pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 relative overflow-hidden shadow-inner transition-colors duration-500"
    >
      {/* Soft Ambient Radial Light: Brightens the central area smoothly */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 15%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 50%, transparent 75%)'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ====================================================================
            TWO-TONE HEADLINE: CRISP WHITE + SHARP RADIANT GOLDEN CURSIVE
           ==================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          
          {/* Eyebrow Tag: White & Golden Accent */}
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#FFD700] bg-black/25 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 border border-[#FFD700]/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="text-white">Safety &amp;</span>
            <span className="text-[#FFD700]">Mountain Standards</span>
          </span>

          {/* Master Two-Tone Heading (Sharp Crisp White + Sharp Golden Cursive) */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit uppercase tracking-tight text-white leading-[1.1] drop-shadow-md">
            Built for Wanderers, <br />
            <span className="font-satisfy capitalize text-4xl sm:text-6xl lg:text-7xl block mt-2 sm:mt-3 text-[#FFD700] tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
              backed by certified mountain safety
            </span>
          </h2>

          <p className="text-white/95 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-4 drop-shadow-xs font-normal">
            We eliminate the stress of mountain logistics. Medical kits, high-altitude gear, local forest permits, and warm alpine meals are all covered by our certified leaders.
          </p>
        </div>

        {/* ====================================================================
            RIGHT-TO-LEFT MOVING CARDS (CLEAN WHITE CARDS WITH RED & GOLD ACCENTS)
            * Hover bug fixed: Icon never hides; turns bright white on red background!
           ==================================================================== */}
        <div className="relative w-full overflow-hidden py-2 mb-8 sm:mb-10">
          {/* Right-to-Left Track: Smooth 38s Loop, pauses on hover */}
          <div className="animate-cards-rtl flex gap-6 px-4 items-center">
            {infinitePillars.map((item, idx) => {
              const PillarIcon = item.icon;
              return (
                <div 
                  key={idx}
                  className="group relative w-80 sm:w-92 rounded-3xl bg-white text-[#0A0A0A] p-6 sm:p-7 shadow-2xl border border-white/90 shrink-0 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]"
                >
                  <div>
                    {/* Top Icon & Tag Badge */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Icon container: red bg on hover, icon turns pure white! */}
                      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#E5383B] transition-all duration-300 shadow-xs">
                        <PillarIcon className="w-6 h-6 text-[#E5383B] group-hover:text-white transition-colors duration-300" />
                      </div>
                      
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
                        {item.badge}
                      </span>
                    </div>

                    {/* Cursive Sub-kicker in Golden/Amber */}
                    <p className="font-cursive text-base font-bold tracking-wide text-amber-600 mb-1">
                      {item.kicker}
                    </p>

                    {/* Card Title */}
                    <h3 className="font-outfit font-extrabold text-xl text-[#0A0A0A] group-hover:text-[#E5383B] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mt-2.5">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Footer Perk */}
                  <div className="pt-4 mt-5 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item.perk}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            SEPARATE INDIVIDUAL BOXES FOR EACH COUNTER STAT
            (NO continuous ribbon — 4 sleek standalone elevated cards)
            Text style: Crisp Pure White digits + Sharp Alpine Golden labels
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div 
                key={idx}
                className="group relative rounded-2xl bg-black/25 hover:bg-black/35 backdrop-blur-md border border-white/20 hover:border-[#FFD700]/70 p-5 sm:p-6 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-between min-h-[160px]"
              >
                {/* Golden Mini-Icon Badge */}
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-[#FFD700] flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 group-hover:bg-[#FFD700] group-hover:text-black transition-all duration-300">
                  <StatIcon className="w-5 h-5 transition-colors" />
                </div>

                {/* Counter Digit: Pure Crisp White */}
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-white tracking-tight drop-shadow-md">
                  <AnimatedCounter end={stat.num} suffix={stat.suffix} decimals={stat.decimals || 0} duration={2000} />
                </p>

                {/* Label: Sharp Radiant Alpine Gold */}
                <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#FFD700] mt-2 drop-shadow-xs">
                  {stat.label}
                </p>

                {/* Subtitle: Crisp Clean White */}
                <p className="text-[11px] sm:text-xs text-white/85 font-medium mt-0.5">
                  {stat.sub}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
