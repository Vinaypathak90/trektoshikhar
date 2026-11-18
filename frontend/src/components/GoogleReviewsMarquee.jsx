import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, Sparkles, X } from 'lucide-react';
import {
  DEFAULT_REVIEWS_SETTINGS,
  DEFAULT_REVIEWS_LIST,
  getCachedReviewsPayload,
  getReviewsData
} from '../lib/reviewsApi';

// Export default list for backwards compatibility
export const REVIEWS_DATA = DEFAULT_REVIEWS_LIST;

export default function GoogleReviewsMarquee({
  overrideSettings = null,
  overrideReviews = null,
  previewMode = false
}) {
  const cached = !overrideSettings && !overrideReviews ? getCachedReviewsPayload() : null;

  const [settings, setSettings] = useState(
    () => overrideSettings || cached?.settings || DEFAULT_REVIEWS_SETTINGS
  );
  const [reviews, setReviews] = useState(
    () => overrideReviews || cached?.reviews || DEFAULT_REVIEWS_LIST
  );
  const [selectedReview, setSelectedReview] = useState(null);

  // Sync live preview props when used inside Admin Dashboard
  useEffect(() => {
    if (overrideSettings) setSettings(overrideSettings);
  }, [overrideSettings]);

  useEffect(() => {
    if (overrideReviews) setReviews(overrideReviews);
  }, [overrideReviews]);

  // Fetch live reviews & settings from backend API + listen for live admin updates
  useEffect(() => {
    if (overrideSettings || overrideReviews) return;

    let isMounted = true;

    async function loadLiveReviews() {
      const res = await getReviewsData({ admin: false });
      if (isMounted && res) {
        if (res.settings) setSettings(res.settings);
        if (Array.isArray(res.reviews)) setReviews(res.reviews);
      }
    }

    loadLiveReviews();

    const handleLiveUpdate = (e) => {
      if (isMounted && e?.detail) {
        if (e.detail.settings) setSettings(e.detail.settings);
        if (Array.isArray(e.detail.reviews)) setReviews(e.detail.reviews);
      }
    };

    window.addEventListener('tts-reviews-updated', handleLiveUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('tts-reviews-updated', handleLiveUpdate);
    };
  }, [overrideSettings, overrideReviews]);

  // Lock body scroll when full-review modal is open
  useEffect(() => {
    if (selectedReview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedReview]);

  // Hide globally if toggled off in Admin Dashboard (unless in preview mode)
  if (!previewMode && settings?.is_active === false) {
    return null;
  }

  const activeReviews = reviews.filter((r) => r.is_active !== false && r.isActive !== false);
  if (activeReviews.length === 0 && !previewMode) {
    return null;
  }

  const headerStars = Math.min(5, Math.max(1, Number(settings?.star_rating ?? 5) || 5));

  return (
    <section
      className={`bg-gradient-to-b from-neutral-50/80 via-white to-neutral-50/80 border-t border-neutral-200/90 overflow-hidden relative ${
        previewMode ? 'py-10 rounded-3xl border' : 'py-20 sm:py-24'
      }`}
    >
      {/* ====================================================================
          SECTION HEADER (DYNAMICALLY SYNCED WITH ADMIN DASHBOARD)
         ==================================================================== */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10 sm:mb-14">
        {/* Eyebrow Pill */}
        {settings?.badge_text && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-3 bg-red-50/80 px-3.5 py-1.5 rounded-full border border-red-100">
            <Sparkles className="w-3.5 h-3.5 text-[#E5383B]" />
            <span>{settings.badge_text}</span>
          </div>
        )}

        {/* Title: e.g. EXCELLENT */}
        <h2 className="text-3xl sm:text-5xl font-black font-outfit text-[#0A0A0A] tracking-tight uppercase">
          {settings?.headline || 'EXCELLENT'}
        </h2>

        {/* Dynamic Golden Amber Stars */}
        <div className="flex items-center justify-center gap-1 mt-3 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-7 h-7 sm:w-8 sm:h-8 fill-current ${
                i < headerStars
                  ? 'text-[#FFB800] drop-shadow-[0_2px_4px_rgba(255,184,0,0.35)]'
                  : 'text-neutral-200'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Subtitle: Based on 108+ verified reviews across Google & trail logs */}
        <p className="text-sm sm:text-base font-semibold text-neutral-600 mb-3">
          Based on{' '}
          <strong className="text-neutral-900 font-bold">
            {settings?.total_reviews_label || '108+ verified reviews'}
          </strong>{' '}
          {settings?.subtitle_suffix || 'across Google & trail logs'}
        </p>

        {/* Official Google Wordmark Logo */}
        {settings?.show_google_logo !== false && (
          <div className="flex items-center justify-center gap-1 text-2xl font-medium tracking-tight">
            <span className="text-[#4285F4] font-semibold">G</span>
            <span className="text-[#EA4335] font-semibold">o</span>
            <span className="text-[#FBBC05] font-semibold">o</span>
            <span className="text-[#4285F4] font-semibold">g</span>
            <span className="text-[#34A853] font-semibold">l</span>
            <span className="text-[#EA4335] font-semibold">e</span>
          </div>
        )}
      </div>

      {/* ====================================================================
          CONTINUOUS INFINITE RIGHT-TO-LEFT HORIZONTAL STRIP
          Seamless, no breaks, no gaps, no jumps
         ==================================================================== */}
      {activeReviews.length > 0 ? (
        <div className="relative w-full overflow-hidden py-4">
          {/* Left & Right Soft Fade Gradients for Luxury Edge Transition */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-r from-neutral-50/95 via-neutral-50/60 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-l from-neutral-50/95 via-neutral-50/60 to-transparent" />

          {/* Marquee Flex Wrapper: 3 identical tracks ensure 100% gapless loop */}
          <div className="flex w-max">
            {/* TRACK 1 */}
            <div className="animate-infinite-marquee-rtl flex gap-6 shrink-0 pr-6">
              {activeReviews.map((rev) => (
                <ReviewCard key={`t1-${rev.id}`} review={rev} onReadMore={setSelectedReview} />
              ))}
            </div>

            {/* TRACK 2 */}
            <div className="animate-infinite-marquee-rtl flex gap-6 shrink-0 pr-6" aria-hidden="true">
              {activeReviews.map((rev) => (
                <ReviewCard key={`t2-${rev.id}`} review={rev} onReadMore={setSelectedReview} />
              ))}
            </div>

            {/* TRACK 3 */}
            <div className="animate-infinite-marquee-rtl flex gap-6 shrink-0 pr-6" aria-hidden="true">
              {activeReviews.map((rev) => (
                <ReviewCard key={`t3-${rev.id}`} review={rev} onReadMore={setSelectedReview} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-neutral-400 font-semibold">
          No active reviews yet. Add reviews in the manager below.
        </div>
      )}

      {/* Full Review Reader Modal (Portal) */}
      {selectedReview &&
        createPortal(
          <div
            onClick={() => setSelectedReview(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full ${selectedReview.avatarBg || selectedReview.avatar_bg || 'bg-blue-600'} text-white font-black text-sm flex items-center justify-center shrink-0`}
                  >
                    {selectedReview.avatarText || selectedReview.avatar_text || 'T'}
                  </div>
                  <div>
                    <h4 className="font-outfit font-black text-base text-[#0A0A0A]">
                      {selectedReview.name}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {selectedReview.timeAgo || selectedReview.time_ago} •{' '}
                      <span className="font-semibold text-[#E5383B]">
                        {selectedReview.trekTag || selectedReview.trek_tag}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer transition"
                  aria-label="Close Review"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 fill-current ${
                      i < (Number(selectedReview.rating) || 5) ? 'text-[#FFB800]' : 'text-neutral-200'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">
                {selectedReview.review}
              </p>

              {(selectedReview.isVerified ?? selectedReview.is_verified ?? true) && (
                <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{selectedReview.verifiedLabel || selectedReview.verified_label || 'Verified Stay & Trail'}</span>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

// ----------------------------------------------------------------------
// SINGLE REVIEW CARD COMPONENT (Dynamic 1-5 Stars + Verified Badge)
// ----------------------------------------------------------------------
function ReviewCard({ review, onReadMore }) {
  const starCount = Math.min(5, Math.max(1, Number(review.rating) || 5));
  const avatarBg = review.avatarBg || review.avatar_bg || 'bg-blue-600';
  const avatarText = review.avatarText || review.avatar_text || (review.name?.[0] || 'T').toUpperCase();
  const timeAgo = review.timeAgo || review.time_ago || 'Recently';
  const trekTag = review.trekTag || review.trek_tag || 'Himalayan Expedition';
  const isVerified = review.isVerified !== undefined ? review.isVerified : review.is_verified !== false;
  const verifiedLabel = review.verifiedLabel || review.verified_label || 'Verified Stay & Trail';

  return (
    <div className="w-[340px] sm:w-[380px] shrink-0 bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex flex-col justify-between select-none">
      <div>
        {/* Card Header: Avatar + Name + Timestamp (Left), Google G (Right) */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar Circle */}
            <div className={`w-10 h-10 rounded-full ${avatarBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}>
              {avatarText}
            </div>

            {/* User Name & Time */}
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#0A0A0A] leading-tight">
                {review.name}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                {timeAgo}
              </p>
            </div>
          </div>

          {/* Google 4-Color 'G' Icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>
        </div>

        {/* Rating Stars & Blue Verified Checkmark */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 fill-current ${i < starCount ? 'text-[#FFB800]' : 'text-neutral-200'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Blue Verified Customer Checkmark Badge */}
          {isVerified && (
            <span
              className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#1A73E8] text-white shrink-0 shadow-2xs"
              title="Verified Google Reviewer"
            >
              <svg className="w-2.5 h-2.5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}

          {/* Specific Trek Badge */}
          {trekTag && (
            <span className="text-[11px] font-semibold text-neutral-500 truncate ml-1">
              • {trekTag}
            </span>
          )}
        </div>

        {/* Review Body Text */}
        <p className="text-neutral-700 text-xs sm:text-[13px] leading-relaxed line-clamp-4">
          {review.review}
        </p>
      </div>

      {/* "Read more" footer text */}
      <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onReadMore && onReadMore(review)}
          className="text-xs font-semibold text-neutral-400 hover:text-[#E5383B] cursor-pointer transition-colors"
        >
          Read more
        </button>
        {isVerified && (
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {verifiedLabel}
          </span>
        )}
      </div>
    </div>
  );
}
