import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Save,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Star,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Database,
  Copy,
  Check,
  ShieldCheck,
  MessageSquareQuote
} from 'lucide-react';
import GoogleReviewsMarquee from '../components/GoogleReviewsMarquee';
import {
  AVATAR_COLOR_OPTIONS,
  DEFAULT_REVIEWS_SETTINGS,
  DEFAULT_REVIEWS_LIST,
  getReviewsData,
  updateReviewsSettings,
  createReview,
  updateReview,
  deleteReview,
  reorderReviews,
  resetReviewsData
} from '../lib/reviewsApi';

const EMPTY_REVIEW_FORM = {
  name: '',
  avatar_bg: 'bg-blue-600',
  avatar_text: '',
  time_ago: '1 month ago',
  trek_tag: 'Nag Tibba Weekend Trek',
  rating: 5,
  review: '',
  is_verified: true,
  verified_label: 'Verified Stay & Trail',
  is_active: true
};

export default function ReviewsModule() {
  const [settings, setSettings] = useState(DEFAULT_REVIEWS_SETTINGS);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS_LIST);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingCard, setSavingCard] = useState(false);
  const [hasUnsavedSettings, setHasUnsavedSettings] = useState(false);
  const [tableNotReady, setTableNotReady] = useState(false);
  const [source, setSource] = useState('database');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Add / Edit Review Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [cardForm, setCardForm] = useState(EMPTY_REVIEW_FORM);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getReviewsData({ admin: true });
      if (res) {
        setSettings(res.settings || DEFAULT_REVIEWS_SETTINGS);
        setReviews(res.reviews || DEFAULT_REVIEWS_LIST);
        setTableNotReady(Boolean(res.tableNotReady));
        setSource(res.source || 'database');
        setHasUnsavedSettings(false);
      }
    } catch (err) {
      showToast('error', 'Failed to load reviews: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const handleSettingChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedSettings(true);
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await updateReviewsSettings(settings);
      if (res?.data) setSettings(res.data);
      setTableNotReady(Boolean(res?.tableNotReady));
      setSource(res?.source || 'database');
      setHasUnsavedSettings(false);
      showToast('success', res?.message || 'Header settings synced live!');
    } catch (err) {
      showToast('error', err.message || 'Failed to save header settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const openAddModal = () => {
    setEditingReviewId(null);
    setCardForm({ ...EMPTY_REVIEW_FORM });
    setModalOpen(true);
  };

  const openEditModal = (rev) => {
    setEditingReviewId(rev.id);
    setCardForm({
      name: rev.name || '',
      avatar_bg: rev.avatar_bg || rev.avatarBg || 'bg-blue-600',
      avatar_text: rev.avatar_text || rev.avatarText || '',
      time_ago: rev.time_ago || rev.timeAgo || 'Recently',
      trek_tag: rev.trek_tag || rev.trekTag || '',
      rating: Number(rev.rating) || 5,
      review: rev.review || '',
      is_verified: rev.is_verified !== undefined ? Boolean(rev.is_verified) : rev.isVerified !== false,
      verified_label: rev.verified_label || rev.verifiedLabel || 'Verified Stay & Trail',
      is_active: rev.is_active !== undefined ? Boolean(rev.is_active) : rev.isActive !== false
    });
    setModalOpen(true);
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!cardForm.name.trim() || !cardForm.review.trim()) {
      showToast('error', 'Reviewer name and review content are required.');
      return;
    }

    setSavingCard(true);
    try {
      if (editingReviewId) {
        const res = await updateReview(editingReviewId, cardForm);
        showToast('success', res?.message || 'Review updated live!');
      } else {
        const res = await createReview({
          ...cardForm,
          display_order: reviews.length + 1
        });
        showToast('success', res?.message || 'New review published live!');
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to save review');
    } finally {
      setSavingCard(false);
    }
  };

  const handleToggleReviewActive = async (rev) => {
    const currentActive = rev.is_active !== undefined ? rev.is_active : rev.isActive !== false;
    try {
      await updateReview(rev.id, { is_active: !currentActive });
      showToast('success', !currentActive ? 'Review shown live!' : 'Review hidden from website.');
      await loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to update visibility');
    }
  };

  const handleDeleteReview = async (rev) => {
    if (!window.confirm(`Delete review by "${rev.name}"?`)) return;
    try {
      await deleteReview(rev.id);
      showToast('success', `Deleted review by ${rev.name}`);
      await loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete review');
    }
  };

  const handleMoveReview = async (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= reviews.length) return;
    const reordered = [...reviews];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    setReviews(reordered);

    try {
      await reorderReviews(reordered.map((r) => r.id));
      showToast('success', 'Review order synced live!');
    } catch (err) {
      showToast('error', err.message || 'Failed to reorder reviews');
      await loadData();
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset Google Reviews header & cards back to default 8 verified reviews?')) return;
    setLoading(true);
    try {
      const res = await resetReviewsData();
      if (res?.settings) setSettings(res.settings);
      if (Array.isArray(res?.reviews)) setReviews(res.reviews);
      setHasUnsavedSettings(false);
      showToast('success', 'Reset to default verified Google reviews!');
    } catch (err) {
      showToast('error', err.message || 'Failed to reset reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySqlPath = () => {
    navigator.clipboard?.writeText('backend/database/google_reviews.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const filteredReviews = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.trek_tag || r.trekTag || '').toLowerCase().includes(q) ||
        (r.review || '').toLowerCase().includes(q)
    );
  }, [reviews, searchQuery]);

  const activeCount = reviews.filter((r) => r.is_active !== false && r.isActive !== false).length;

  return (
    <div className="space-y-6 animate-editorial-fade">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-extrabold animate-fade-in ${
            toast.type === 'success'
              ? 'bg-neutral-950 text-white border-emerald-500/40'
              : 'bg-red-600 text-white border-red-400'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ============================================================
          1. MODULE HEADER BAR
         ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#E5383B] mb-1.5">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Module 4 • Verified Google Reviews Marquee</span>
          </div>
          <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight">
            Google Reviews &amp; Ratings Manager
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Manage the EXCELLENT rating header, total review count badge, and all scrolling trekker testimonials dynamically across Homepage &amp; Catalog pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 cursor-pointer transition"
            title="Refresh from Backend"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleResetDefaults}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:brightness-110 text-white text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Review</span>
          </button>
        </div>
      </div>

      {/* Optional Supabase Table Hint Banner */}
      {tableNotReady && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-outfit font-extrabold text-sm text-amber-950">
                Using Local Sync Fallback — Supabase Tables Pending
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                All edits save and sync live right now! For permanent cloud PostgreSQL sync, run{' '}
                <code className="px-1.5 py-0.5 rounded bg-amber-100 font-bold">
                  backend/database/google_reviews.sql
                </code>{' '}
                in Supabase SQL Editor.
              </p>
            </div>
          </div>
          <button
            onClick={handleCopySqlPath}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 cursor-pointer transition"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Path Copied' : 'Copy SQL Path'}</span>
          </button>
        </div>
      )}

      {/* ============================================================
          2. LIVE MARQUEE PREVIEW
         ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-outfit font-black text-sm uppercase tracking-wider text-neutral-800">
              Live Frontend Marquee Preview
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
              {activeCount} Active of {reviews.length} Reviews • {source === 'database' ? 'Supabase' : 'Live Sync'}
            </span>
          </div>
        </div>

        <GoogleReviewsMarquee
          overrideSettings={settings}
          overrideReviews={reviews}
          previewMode={true}
        />
      </div>

      {/* ============================================================
          3. SECTION HEADER & EXCELLENT RATING SETTINGS
         ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
              Header &amp; Rating Summary Controls
            </h3>
            <p className="text-xs text-neutral-500">
              Customize the EXCELLENT title, star count, review counter text, and Google branding.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSettingChange('is_active', !settings.is_active)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                settings.is_active
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-200'
              }`}
            >
              {settings.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.is_active ? 'Section Visible' : 'Section Hidden'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer transition ${
                hasUnsavedSettings
                  ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] ring-2 ring-[#E5383B]/30'
                  : 'bg-neutral-900 hover:bg-[#E5383B]'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSettings ? 'Saving...' : hasUnsavedSettings ? 'Save Header Live' : 'Header Synced'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-neutral-700 mb-1.5">
              Top Eyebrow Pill
            </label>
            <input
              type="text"
              value={settings.badge_text || ''}
              onChange={(e) => handleSettingChange('badge_text', e.target.value)}
              placeholder="Verified Himalayan Trekker Reviews"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-neutral-700 mb-1.5">
              Main Headline *
            </label>
            <input
              type="text"
              value={settings.headline || ''}
              onChange={(e) => handleSettingChange('headline', e.target.value)}
              placeholder="EXCELLENT"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-black uppercase focus:outline-none focus:border-[#E5383B]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-neutral-700 mb-1.5">
              Header Star Rating ({settings.star_rating} / 5)
            </label>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/70">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSettingChange('star_rating', num)}
                  className="p-0.5 cursor-pointer transition hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      num <= (Number(settings.star_rating) || 5)
                        ? 'text-[#FFB800] fill-[#FFB800]'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-neutral-700 mb-1.5">
              Total Reviews Count Text (Bold)
            </label>
            <input
              type="text"
              value={settings.total_reviews_label || ''}
              onChange={(e) => handleSettingChange('total_reviews_label', e.target.value)}
              placeholder="108+ verified reviews"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-neutral-700 mb-1.5">
              Subtitle Suffix
            </label>
            <input
              type="text"
              value={settings.subtitle_suffix || ''}
              onChange={(e) => handleSettingChange('subtitle_suffix', e.target.value)}
              placeholder="across Google & trail logs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B]"
            />
          </div>

          <div className="flex items-end">
            <label className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 cursor-pointer">
              <span className="text-xs font-extrabold text-neutral-700">Show Google Wordmark</span>
              <input
                type="checkbox"
                checked={settings.show_google_logo !== false}
                onChange={(e) => handleSettingChange('show_google_logo', e.target.checked)}
                className="w-4 h-4 accent-[#E5383B] cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* ============================================================
          4. REVIEW CARDS LIST & SEARCH MANAGER
         ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
              Trekker Reviews ({filteredReviews.length})
            </h3>
            <p className="text-xs text-neutral-500">
              Add new reviews, edit ratings/text, reorder cards, or hide specific testimonials.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviewer or trek..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-neutral-50/60 focus:outline-none focus:border-[#E5383B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredReviews.map((rev, idx) => {
            const realIndex = reviews.findIndex((r) => r.id === rev.id);
            const isActive = rev.is_active !== undefined ? rev.is_active : rev.isActive !== false;
            const avatarBg = rev.avatar_bg || rev.avatarBg || 'bg-blue-600';
            const avatarText = rev.avatar_text || rev.avatarText || (rev.name?.[0] || 'T').toUpperCase();
            const stars = Math.min(5, Math.max(1, Number(rev.rating) || 5));

            return (
              <div
                key={rev.id || idx}
                className={`rounded-2xl p-5 border flex flex-col justify-between gap-4 transition ${
                  isActive
                    ? 'bg-neutral-50/60 border-neutral-200/90 hover:border-neutral-300'
                    : 'bg-neutral-100/80 border-dashed border-neutral-300 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Row: Avatar + Name + Index */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full ${avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                        {avatarText}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-[#0A0A0A] truncate">
                          {rev.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {rev.time_ago || rev.timeAgo} • {rev.trek_tag || rev.trekTag}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-neutral-200/80 text-neutral-600 shrink-0">
                      #{realIndex + 1}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < stars ? 'text-[#FFB800] fill-[#FFB800]' : 'text-neutral-300'
                        }`}
                      />
                    ))}
                    {(rev.is_verified ?? rev.isVerified ?? true) && (
                      <span className="ml-1.5 text-[10px] font-bold text-emerald-600 inline-flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Review Body */}
                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                    {rev.review}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-200/70">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveReview(realIndex, -1)}
                      disabled={realIndex <= 0 || Boolean(searchQuery)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-black disabled:opacity-35 cursor-pointer transition"
                      title="Move Earlier"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveReview(realIndex, 1)}
                      disabled={realIndex >= reviews.length - 1 || Boolean(searchQuery)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-black disabled:opacity-35 cursor-pointer transition"
                      title="Move Later"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleReviewActive(rev)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-extrabold border transition cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                      }`}
                    >
                      {isActive ? 'Live' : 'Hidden'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(rev)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold cursor-pointer transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteReview(rev)}
                      className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer transition"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          5. ADD / EDIT REVIEW PORTAL MODAL (CENTERED, NO CUTOFF)
         ============================================================ */}
      {modalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-xl h-[86vh] max-h-[640px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-neutral-950 text-white flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E5383B]">
                    Google Review Customizer
                  </span>
                  <h3 className="font-outfit font-black text-lg leading-tight">
                    {editingReviewId ? `Edit Review: ${cardForm.name}` : 'Add New Trekker Review'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form id="google-review-form" onSubmit={handleSaveCard} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Name & Avatar Initials */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-8">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Reviewer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardForm.name}
                      onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                      placeholder="e.g. Rahul Verma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Avatar Initials
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={cardForm.avatar_text}
                      onChange={(e) => setCardForm({ ...cardForm, avatar_text: e.target.value.toUpperCase() })}
                      placeholder="Auto"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-black uppercase text-center focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                </div>

                {/* Avatar Color Picker */}
                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-2">
                    Avatar Circle Color
                  </label>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {AVATAR_COLOR_OPTIONS.map((color) => {
                      const active = cardForm.avatar_bg === color.value;
                      return (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setCardForm({ ...cardForm, avatar_bg: color.value })}
                          className={`w-9 h-9 rounded-full ${color.value} text-white text-xs font-black flex items-center justify-center cursor-pointer transition ${
                            active ? 'ring-3 ring-offset-2 ring-[#E5383B] scale-110' : 'opacity-80 hover:opacity-100'
                          }`}
                          title={color.label}
                        >
                          {(cardForm.avatar_text || cardForm.name?.[0] || 'A').toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Star Rating + Time Ago + Trek Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Star Rating ({cardForm.rating} / 5)
                    </label>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/70">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setCardForm({ ...cardForm, rating: num })}
                          className="p-0.5 cursor-pointer transition hover:scale-110"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              num <= cardForm.rating
                                ? 'text-[#FFB800] fill-[#FFB800]'
                                : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Time Ago Label
                    </label>
                    <input
                      type="text"
                      value={cardForm.time_ago}
                      onChange={(e) => setCardForm({ ...cardForm, time_ago: e.target.value })}
                      placeholder="e.g. 2 months ago"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Trek Name Tag
                    </label>
                    <input
                      type="text"
                      value={cardForm.trek_tag}
                      onChange={(e) => setCardForm({ ...cardForm, trek_tag: e.target.value })}
                      placeholder="e.g. Kedarkantha Summit Ridge"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                </div>

                {/* Review Textarea */}
                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                    Review Content *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={cardForm.review}
                    onChange={(e) => setCardForm({ ...cardForm, review: e.target.value })}
                    placeholder="Write the trekker's full experience review..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm leading-relaxed focus:outline-none focus:border-[#E5383B]"
                  />
                </div>

                {/* Verified & Active Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
                    <span className="text-xs font-extrabold text-neutral-800">Verified Badge</span>
                    <input
                      type="checkbox"
                      checked={Boolean(cardForm.is_verified)}
                      onChange={(e) => setCardForm({ ...cardForm, is_verified: e.target.checked })}
                      className="w-4 h-4 accent-[#E5383B] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
                    <span className="text-xs font-extrabold text-neutral-800">Visible Live</span>
                    <input
                      type="checkbox"
                      checked={Boolean(cardForm.is_active)}
                      onChange={(e) => setCardForm({ ...cardForm, is_active: e.target.checked })}
                      className="w-4 h-4 accent-[#E5383B] cursor-pointer"
                    />
                  </label>
                </div>

                {cardForm.is_verified && (
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Verified Footer Label
                    </label>
                    <input
                      type="text"
                      value={cardForm.verified_label}
                      onChange={(e) => setCardForm({ ...cardForm, verified_label: e.target.value })}
                      placeholder="Verified Stay & Trail"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                )}
              </form>

              {/* Sticky Modal Footer */}
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="google-review-form"
                  disabled={savingCard}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer transition"
                >
                  {savingCard ? 'Saving...' : editingReviewId ? 'Update Review Live' : 'Publish Review Live'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
