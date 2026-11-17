import React from 'react';
import { ChevronRight, MessageSquare, Eye } from 'lucide-react';

// Automatically optimize thumbnail dimensions for 60fps buttery decoding
const getThumbnailUrl = (url) => {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    return url.replace(/w=\d+/, 'w=640').replace(/q=\d+/, 'q=75');
  }
  return url;
};

export default function TrekCard({ trek, onSelectTrek, onBookTrek }) {
  if (!trek) return null;

  const thumbUrl = getThumbnailUrl(trek.heroImages[0]);

  return (
    <div
      onClick={() => onSelectTrek(trek)}
      className="group relative rounded-3xl overflow-hidden cursor-pointer h-[440px] sm:h-[460px] flex flex-col justify-between bg-neutral-900 border border-neutral-200/80 shadow-[0_10px_25px_-5px_rgba(229,56,59,0.14),0_6px_14px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-3 hover:scale-[1.018] hover:shadow-[0_26px_60px_-10px_rgba(229,56,59,0.48),0_14px_28px_-6px_rgba(0,0,0,0.55)] hover:border-[#E5383B] hover:ring-2 hover:ring-[#E5383B]/30 transition-all duration-350 ease-out transform-gpu will-change-transform"
    >
      {/* 1. Full-Height Background Image with Hover Zoom Animation */}
      <img
        src={thumbUrl}
        alt={trek.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115 group-hover:brightness-105 z-0 transform-gpu"
      />

      {/* 2. Top Scrim & Floating Price Badge (Exactly like reference: 'From 15000 INR') */}
      <div className="relative z-20 pt-4 px-4 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/50 backdrop-blur-md text-white border border-white/20 shadow-sm">
          {trek.tag}
        </span>

        {/* Reference Style Price Box */}
        <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase tracking-wider shadow-lg border border-white/25 backdrop-blur-md group-hover:scale-105 group-hover:shadow-[0_4px_18px_rgba(229,56,59,0.65)] transition-all duration-300">
          From {trek.price.toLocaleString('en-IN')} INR
        </span>
      </div>

      {/* 3. Bottom Dark Overlay Section (Matching Reference Screenshot Layout & Fields) */}
      <div className="relative z-20 mt-auto bg-gradient-to-t from-[#0A1128]/98 via-[#0A1128]/90 to-transparent pt-12 pb-5 px-5 text-white">
        
        {/* Trek Title */}
        <h3 className="font-outfit font-black text-lg sm:text-xl text-center text-white group-hover:text-[#FFD700] transition-colors leading-tight drop-shadow-md mb-2.5 line-clamp-1">
          {trek.title}
        </h3>

        {/* 3-Column Stats Row with Dividers: Days | Altitude | Km */}
        <div className="grid grid-cols-3 text-center py-2 border-y border-white/20 my-2">
          
          {/* Column 1: Days */}
          <div className="flex flex-col items-center justify-center">
            <span className="font-outfit font-black text-sm sm:text-base text-white leading-none">
              {trek.days || trek.duration.split('/')[0].trim()}
            </span>
          </div>

          {/* Column 2: Altitude */}
          <div className="flex flex-col items-center justify-center border-x border-white/20 px-1">
            <span className="font-outfit font-black text-sm sm:text-base text-amber-300 leading-none">
              {trek.altitude}
            </span>
            <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider mt-0.5">
              Altitude
            </span>
          </div>

          {/* Column 3: Distance */}
          <div className="flex flex-col items-center justify-center">
            <span className="font-outfit font-black text-sm sm:text-base text-white leading-none">
              {trek.distanceKm || trek.distance.split(' ')[0] + ' Km'}
            </span>
          </div>

        </div>

        {/* Transit Route (e.g. Haldwani to Haldwani / Dehradun to Dehradun) */}
        <p className="text-center text-xs font-bold text-white/90 tracking-wide mt-1.5 drop-shadow-xs">
          {trek.route || `${trek.baseCamp} to ${trek.baseCamp}`}
        </p>

        {/* Hover Action CTAs (Smoothly appear on mouse hover with dynamic color change) */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectTrek(trek);
            }}
            className="py-2 px-2.5 rounded-xl text-xs font-extrabold text-white bg-white/15 hover:bg-white hover:text-[#0A0A0A] backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer border border-white/20"
          >
            <span>Itinerary</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookTrek(trek);
            }}
            className="py-2 px-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:bg-gradient-to-r hover:from-neutral-950 hover:to-neutral-900 hover:text-[#25D366] shadow-md transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer border border-transparent hover:border-[#25D366]/40"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
            <span>Book</span>
          </button>
        </div>

      </div>
    </div>
  );
}
