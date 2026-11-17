import React from 'react';
import { Star, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

export const REVIEWS_DATA = [
  {
    id: 1,
    name: "Ashish Agarwal",
    avatarBg: "bg-blue-600",
    avatarText: "A",
    timeAgo: "8 months ago",
    trekTag: "Nag Tibba Weekend Trek",
    review: "Trek To Shikhar provided brilliant experience for my first trek. They had amazing facilities, warm four-season tents, and provided guidance of utmost quality. The certified NIM guides were patient and motivating throughout the summit climb. Highly recommend!",
  },
  {
    id: 2,
    name: "mayank bhardwaj",
    avatarBg: "bg-emerald-600",
    avatarText: "M",
    timeAgo: "9 months ago",
    trekTag: "Nag Tibba Summit",
    review: "Nag Tibba with Trek To Shikhar was well-planned and smoothly executed. The trek leaders explained the trail well and motivated the group throughout the difficult stretches. Fresh hot meals at sub-zero base camp was a blessing.",
  },
  {
    id: 3,
    name: "Kamal Sarkar",
    avatarBg: "bg-neutral-900",
    avatarText: "KS",
    timeAgo: "9 months ago",
    trekTag: "Brahmatal Winter Expedition",
    review: "Brahmatal Trek exceeded expectations in every way! The team maintained a perfect balance of safety and enjoyment. Medical pulse oximeter checks twice daily and reliable high-altitude sleeping bags kept us warm at -5°C.",
  },
  {
    id: 4,
    name: "Priya Sharma",
    avatarBg: "bg-rose-500",
    avatarText: "P",
    timeAgo: "6 months ago",
    trekTag: "Kedarkantha Summit Ridge",
    review: "Kedarkantha sunrise summit was pure magic! As a solo female trekker, I felt 100% safe and respected. Strict 12-15 batch size meant genuine personal care. Microspikes and gaiters were provided on spot for the snow trail.",
  },
  {
    id: 5,
    name: "Rahul Verma",
    avatarBg: "bg-amber-600",
    avatarText: "R",
    timeAgo: "5 months ago",
    trekTag: "Hatu Peak & Alpine Ridge",
    review: "Hatu Peak alpine ridge trail was breathtaking! Equipment was spotless—waterproof dome tents and clean thermal sleeping bags kept us warm. The certified guides are born locals with deep mountain respect. Booking Kuari Pass next!",
  },
  {
    id: 6,
    name: "Sunita Rawat",
    avatarBg: "bg-indigo-600",
    avatarText: "S",
    timeAgo: "7 months ago",
    trekTag: "Churdhar Sanctuary Trek",
    review: "Churdhar Peak sanctuary trek was thrilling! The team monitored hydration and acclimatization with immense care. Zero plastic on trail, transparent pricing, and authentic mountain hospitality. 5 stars all the way!",
  },
  {
    id: 7,
    name: "Kunal Malhotra",
    avatarBg: "bg-teal-600",
    avatarText: "K",
    timeAgo: "4 months ago",
    trekTag: "Dayara Bugyal Meadows",
    review: "Having trekked across Uttarakhand with several commercial agencies, Trek To Shikhar stands in a league of its own. Capping batches strictly at 12–15 trekkers ensures zero trail chaos and medical-grade expedition safety.",
  },
  {
    id: 8,
    name: "Tanvi Kapoor",
    avatarBg: "bg-purple-600",
    avatarText: "T",
    timeAgo: "3 months ago",
    trekTag: "Kuari Pass Expedition",
    review: "From seamless pickup at Dehradun station to reaching the summit ridge, every logistical detail was flawless. The trek leaders are genuine mountaineers who prioritize safety first. Best Himalayan trekking operator hands down!",
  }
];

export default function GoogleReviewsMarquee() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-neutral-50/80 via-white to-neutral-50/80 border-t border-neutral-200/90 overflow-hidden relative">
      
      {/* ====================================================================
          SECTION HEADER (EXACT REFERENCE SCREENSHOT REPLICATION)
         ==================================================================== */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-12 sm:mb-14">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-3 bg-red-50/80 px-3.5 py-1.5 rounded-full border border-red-100">
          <Sparkles className="w-3.5 h-3.5 text-[#E5383B]" />
          <span>Verified Himalayan Trekker Reviews</span>
        </div>

        {/* Title: EXCELLENT */}
        <h2 className="text-3xl sm:text-5xl font-black font-outfit text-[#0A0A0A] tracking-tight uppercase">
          EXCELLENT
        </h2>

        {/* 5 Golden Amber Stars */}
        <div className="flex items-center justify-center gap-1 mt-3 mb-2 text-[#FFB800]">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-[0_2px_4px_rgba(255,184,0,0.35)]" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Subtitle: Based on 108+ reviews */}
        <p className="text-sm sm:text-base font-semibold text-neutral-600 mb-3">
          Based on <strong className="text-neutral-900 font-bold">108+ verified reviews</strong> across Google &amp; trail logs
        </p>

        {/* Official Google Wordmark Logo */}
        <div className="flex items-center justify-center gap-1 text-2xl font-medium tracking-tight">
          <span className="text-[#4285F4] font-semibold">G</span>
          <span className="text-[#EA4335] font-semibold">o</span>
          <span className="text-[#FBBC05] font-semibold">o</span>
          <span className="text-[#4285F4] font-semibold">g</span>
          <span className="text-[#34A853] font-semibold">l</span>
          <span className="text-[#EA4335] font-semibold">e</span>
        </div>

      </div>

      {/* ====================================================================
          CONTINUOUS INFINITE RIGHT-TO-LEFT HORIZONTAL STRIP
          Seamless, no breaks, no gaps, no pause buttons, no jumps
         ==================================================================== */}
      <div className="relative w-full overflow-hidden py-4">
        
        {/* Left & Right Soft Fade Gradients for Luxury Edge Transition */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-r from-neutral-50/95 via-neutral-50/60 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-l from-neutral-50/95 via-neutral-50/60 to-transparent" />

        {/* Marquee Flex Wrapper: 3 identical tracks ensure 100% gapless loop */}
        <div className="flex w-max">
          
          {/* TRACK 1 */}
          <div className="animate-infinite-marquee-rtl flex gap-6 shrink-0 pr-6">
            {REVIEWS_DATA.map((rev) => (
              <ReviewCard key={`t1-${rev.id}`} review={rev} />
            ))}
          </div>

          {/* TRACK 2 */}
          <div className="animate-infinite-marquee-rtl flex gap-6 shrink-0 pr-6" aria-hidden="true">
            {REVIEWS_DATA.map((rev) => (
              <ReviewCard key={`t2-${rev.id}`} review={rev} />
            ))}
          </div>

          {/* TRACK 3 */}
          <div className="animate-infinite-marquee-rtl flex gap-6 shrink-0 pr-6" aria-hidden="true">
            {REVIEWS_DATA.map((rev) => (
              <ReviewCard key={`t3-${rev.id}`} review={rev} />
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}

// ----------------------------------------------------------------------
// SINGLE REVIEW CARD COMPONENT (Matches Reference Screenshot Style)
// ----------------------------------------------------------------------
function ReviewCard({ review }) {
  return (
    <div className="w-[340px] sm:w-[380px] shrink-0 bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex flex-col justify-between select-none">
      
      <div>
        {/* Card Header: Avatar + Name + Timestamp (Left), Google G (Right) */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar Circle */}
            <div className={`w-10 h-10 rounded-full ${review.avatarBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}>
              {review.avatarText}
            </div>
            
            {/* User Name & Time */}
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#0A0A0A] leading-tight">
                {review.name}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                {review.timeAgo}
              </p>
            </div>
          </div>

          {/* Google 4-Color 'G' Icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
        </div>

        {/* Rating Stars & Blue Verified Checkmark */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center gap-0.5 text-[#FFB800]">
            {[...Array(review.rating)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Blue Verified Customer Checkmark Badge */}
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#1A73E8] text-white shrink-0 shadow-2xs" title="Verified Google Reviewer">
            <svg className="w-2.5 h-2.5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>

          {/* Specific Trek Badge */}
          <span className="text-[11px] font-semibold text-neutral-500 truncate ml-1">
            • {review.trekTag}
          </span>
        </div>

        {/* Review Body Text */}
        <p className="text-neutral-700 text-xs sm:text-[13px] leading-relaxed line-clamp-4">
          {review.review}
        </p>
      </div>

      {/* "Read more" footer text in gray (matching screenshot) */}
      <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors">
          Read more
        </span>
        <span className="text-[11px] text-neutral-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Verified Stay &amp; Trail
        </span>
      </div>

    </div>
  );
}
