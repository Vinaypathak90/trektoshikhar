import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info,
  MapPin,
  Mountain,
  Clock,
  Camera,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';

/**
 * Reusable Ultra-Stylish Interactive Photo Lightbox Modal
 * Features: Multi-level Zoom (1x–3.5x), Mouse-Wheel Zoom, Drag-to-Pan,
 * Toggleable Photo Story & Metadata Panel, Thumbnail Filmstrip, Keyboard Controls.
 * Shared seamlessly between /gallery page & Homepage #gallery showcase!
 */
export default function GalleryLightboxModal({
  photos = [],
  activeIndex = null,
  onClose,
  onChangeIndex
}) {
  const navigate = useNavigate();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const isOpen = activeIndex !== null && photos[activeIndex];
  const activePhoto = isOpen ? photos[activeIndex] : null;

  // Reset zoom & pan whenever active photo changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [activeIndex]);

  // Lock body scroll + Keyboard navigation (ESC, Arrows, +, -, 0, i)
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose && onClose();
      } else if (e.key === 'ArrowRight' && photos.length > 1) {
        onChangeIndex && onChangeIndex((activeIndex + 1) % photos.length);
      } else if (e.key === 'ArrowLeft' && photos.length > 1) {
        onChangeIndex && onChangeIndex((activeIndex - 1 + photos.length) % photos.length);
      } else if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(3.5, Number((z + 0.5).toFixed(2))));
      } else if (e.key === '-') {
        setZoom((z) => {
          const next = Math.max(1, Number((z - 0.5).toFixed(2)));
          if (next === 1) setPan({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      } else if (e.key.toLowerCase() === 'i') {
        setShowInfo((v) => !v);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIndex, photos.length, onClose, onChangeIndex]);

  if (!isOpen || !activePhoto) return null;

  const handleZoomIn = () => {
    setZoom((z) => Math.min(3.5, Number((z + 0.5).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(1, Number((z - 0.5).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setZoom((z) => {
      const next = Math.min(3.5, Math.max(1, Number((z + delta).toFixed(2))));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      handleResetZoom();
    } else {
      setZoom(2.2);
    }
  };

  const handlePointerDown = (e) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const maxOffset = (zoom - 1) * 320;
    setPan({
      x: Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.panX + dx)),
      y: Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.panY + dy))
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleGoToTrek = () => {
    onClose && onClose();
    if (activePhoto.trekSlug) {
      navigate(`/track/${activePhoto.trekSlug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/track');
    }
  };

  const prevPhoto = () => {
    if (photos.length > 1 && onChangeIndex) {
      onChangeIndex((activeIndex - 1 + photos.length) % photos.length);
    }
  };

  const nextPhoto = () => {
    if (photos.length > 1 && onChangeIndex) {
      onChangeIndex((activeIndex + 1) % photos.length);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-neutral-950/95 backdrop-blur-xl flex flex-col text-white animate-fade-in select-none"
      onClick={onClose}
    >
      {/* ============================================================
          1. TOP TOOLBAR: COUNTER, TREK BADGE, ZOOM CONTROLS, INFO & CLOSE
         ============================================================ */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-16 px-4 sm:px-6 bg-black/70 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-30"
      >
        {/* Left: Frame Index + Trek Pill */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] font-black text-[#FFD700] shrink-0 tabular-nums">
            {activeIndex + 1} / {photos.length}
          </span>
          <div className="min-w-0 hidden sm:block">
            <h4 className="font-outfit font-bold text-sm text-white truncate">
              {activePhoto.title}
            </h4>
            <p className="text-[11px] text-neutral-400 truncate">
              {activePhoto.trekName} • {activePhoto.altitude}
            </p>
          </div>
        </div>

        {/* Center/Right: Interactive Zoom Controls + Details Toggle + Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="inline-flex items-center gap-1 px-1.5 py-1 rounded-xl bg-white/10 border border-white/15">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-1.5 rounded-lg hover:bg-white/15 disabled:opacity-35 cursor-pointer transition"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-black text-white min-w-[42px] text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3.5}
              className="p-1.5 rounded-lg hover:bg-white/15 disabled:opacity-35 cursor-pointer transition"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoom > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg bg-[#E5383B]/80 hover:bg-[#E5383B] text-white cursor-pointer transition ml-0.5"
                title="Reset Zoom (0)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
              showInfo
                ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700]'
                : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
            }`}
            title="Toggle Photo Story & Details (I)"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Details</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#E5383B] hover:bg-red-700 text-white shadow-lg cursor-pointer transition"
            aria-label="Close Gallery Lightbox"
            title="Close (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============================================================
          2. MAIN STAGE: ZOOMABLE IMAGE VIEWPORT + SLIDE-IN DETAILS DRAWER
         ============================================================ */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative"
      >
        {/* Left/Center: Interactive Zoom & Pan Canvas */}
        <div
          className={`flex-1 relative flex items-center justify-center overflow-hidden bg-black/50 p-4 sm:p-8 ${
            zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
          }`}
          onWheel={handleWheelZoom}
          onDoubleClick={handleDoubleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Prev Arrow */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/65 hover:bg-[#E5383B] backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-xl cursor-pointer transition-all hover:scale-105"
              title="Previous Photo (←)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Next Arrow */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/65 hover:bg-[#E5383B] backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-xl cursor-pointer transition-all hover:scale-105"
              title="Next Photo (→)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Main Zoomable Image */}
          <img
            src={activePhoto.url}
            alt={activePhoto.title}
            draggable={false}
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            className="max-h-full max-w-full object-contain rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] will-change-transform"
          />

          {/* Floating Hint Pill Bottom-Center */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-[10px] font-bold text-neutral-300 pointer-events-none flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-[#FFD700]" />
            <span>
              {zoom > 1
                ? 'Drag to pan • Double-click or press 0 to reset'
                : 'Scroll or double-click image to zoom up to 350%'}
            </span>
          </div>
        </div>

        {/* Right Side Panel (Desktop) / Bottom Scroll Panel (Mobile): Rich Story & Details */}
        {showInfo && (
          <aside className="w-full lg:w-[360px] xl:w-[390px] max-h-[40vh] lg:max-h-full overflow-y-auto bg-neutral-900/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 p-5 sm:p-6 flex flex-col justify-between gap-5 shrink-0">
            <div className="space-y-4">
              {/* Category & Altitude Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E5383B]/20 border border-[#E5383B]/40 text-[10px] font-black uppercase tracking-wider text-[#FFD700]">
                  <Sparkles className="w-3 h-3" />
                  {activePhoto.category || 'Himalayan Moment'}
                </span>
                {activePhoto.altitude && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-extrabold text-white">
                    <Mountain className="w-3 h-3 text-[#FFD700]" />
                    {activePhoto.altitude}
                  </span>
                )}
              </div>

              {/* Photo Title */}
              <h3 className="font-outfit font-black text-xl sm:text-2xl text-white leading-tight">
                {activePhoto.title}
              </h3>

              {/* Full Photo Story ("kya tha kis cheej ka tha") */}
              {activePhoto.details && (
                <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] block mb-1.5">
                    Story Behind This Frame
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                    {activePhoto.details}
                  </p>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <Mountain className="w-4 h-4 text-[#E5383B] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                      Trek Expedition
                    </span>
                    <span className="text-xs font-extrabold text-white truncate block">
                      {activePhoto.trekName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <MapPin className="w-4 h-4 text-[#FFD700] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                      Location
                    </span>
                    <span className="text-xs font-bold text-neutral-200 truncate block">
                      {activePhoto.location}
                    </span>
                  </div>
                </div>

                {activePhoto.capturedAt && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                        Captured On
                      </span>
                      <span className="text-xs font-bold text-neutral-200 truncate block">
                        {activePhoto.capturedAt}
                      </span>
                    </div>
                  </div>
                )}

                {activePhoto.photographer && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                    <Camera className="w-4 h-4 text-sky-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                        Shot By
                      </span>
                      <span className="text-xs font-bold text-neutral-200 truncate block">
                        {activePhoto.photographer}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Explore This Trek CTA */}
            {activePhoto.trekSlug && (
              <button
                type="button"
                onClick={handleGoToTrek}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-white hover:to-white text-white hover:text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Explore {activePhoto.trekName}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </aside>
        )}
      </div>

      {/* ============================================================
          3. BOTTOM INTERACTIVE THUMBNAIL FILMSTRIP
         ============================================================ */}
      {photos.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="h-20 px-4 bg-black/80 border-t border-white/10 flex items-center gap-2.5 overflow-x-auto scrollbar-none shrink-0 z-30"
        >
          {photos.map((item, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => onChangeIndex && onChangeIndex(idx)}
                className={`relative h-13 w-20 rounded-xl overflow-hidden shrink-0 transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-[#FFD700] scale-105 opacity-100 shadow-lg'
                    : 'opacity-45 hover:opacity-85 border border-white/15'
                }`}
                title={item.title}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>,
    document.body
  );
}
