import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Camera,
  Save,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Database,
  Copy,
  Check,
  ExternalLink,
  Layers,
  MapPin,
  Sparkles,
  ZoomIn
} from 'lucide-react';
import GalleryLightboxModal from '../components/GalleryLightboxModal';
import { GALLERY_PHOTOS } from '../data/galleryData';
import {
  GALLERY_CATEGORIES,
  DEFAULT_GALLERY_SETTINGS,
  getGalleryData,
  updateGallerySettings,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  reorderGalleryPhotos,
  resetGalleryData
} from '../lib/galleryApi';
import { getTreks } from '../lib/trekApi';
import { TREKS as FALLBACK_TREKS } from '../data/treksData';

const EMPTY_PHOTO_FORM = {
  url: '',
  title: '',
  trek_name: 'Kedarkantha Summit Expedition',
  trek_slug: 'kedarkantha-summit-expedition',
  category: 'Summit Views',
  location: 'Uttarakhand / Himachal',
  altitude: '12,500 ft',
  captured_at: 'Nov 2026 • 6:30 AM',
  photographer: 'TrekToShikhar Team',
  details: '',
  featured_on_home: false,
  is_active: true
};

export default function GalleryModule() {
  const [subTab, setSubTab] = useState('photos'); // 'photos' | 'hero-settings'

  const [settings, setSettings] = useState(DEFAULT_GALLERY_SETTINGS);
  const [photos, setPhotos] = useState(GALLERY_PHOTOS);
  const [treksCatalog, setTreksCatalog] = useState(FALLBACK_TREKS);

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [hasUnsavedSettings, setHasUnsavedSettings] = useState(false);
  const [tableNotReady, setTableNotReady] = useState(false);
  const [source, setSource] = useState('database');
  const [toast, setToast] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrek, setFilterTrek] = useState('all');
  const [onlyHomeFeatured, setOnlyHomeFeatured] = useState(false);

  // Photo Add / Edit Portal Modal
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [photoForm, setPhotoForm] = useState(EMPTY_PHOTO_FORM);

  // Admin Lightbox Preview
  const [previewLightboxIdx, setPreviewLightboxIdx] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await getGalleryData({ admin: true });
      if (res) {
        setSettings(res.settings || DEFAULT_GALLERY_SETTINGS);
        setPhotos(res.photos || GALLERY_PHOTOS);
        setTableNotReady(Boolean(res.tableNotReady));
        setSource(res.source || 'database');
        setHasUnsavedSettings(false);
      }
    } catch (err) {
      showToast('error', 'Failed to load gallery: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
    getTreks({ admin: false })
      .then((res) => {
        if (res?.treks?.length > 0) setTreksCatalog(res.treks);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (photoModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [photoModalOpen]);

  const handleSettingField = (field, val) => {
    setSettings((prev) => ({ ...prev, [field]: val }));
    setHasUnsavedSettings(true);
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await updateGallerySettings(settings);
      if (res?.data) setSettings(res.data);
      setTableNotReady(Boolean(res?.tableNotReady));
      setSource(res?.source || 'database');
      setHasUnsavedSettings(false);
      showToast('success', res?.message || 'Gallery Hero & Settings synced live!');
    } catch (err) {
      showToast('error', err.message || 'Failed to save gallery settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Hero Slides Helpers
  const addHeroSlide = () => {
    const next = [
      ...(settings.hero_slides || []),
      {
        id: `gh-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
        title: 'Himalayan Summit View',
        location: 'Uttarakhand / Himachal',
        caption: 'Captured live on a TrekToShikhar mountain expedition.'
      }
    ];
    handleSettingField('hero_slides', next);
  };

  const updateHeroSlide = (idx, field, val) => {
    const next = [...(settings.hero_slides || [])];
    next[idx] = { ...next[idx], [field]: val };
    handleSettingField('hero_slides', next);
  };

  const removeHeroSlide = (idx) => {
    const next = (settings.hero_slides || []).filter((_, i) => i !== idx);
    handleSettingField('hero_slides', next);
  };

  // Photo CRUD
  const openAddPhotoModal = () => {
    setEditingPhotoId(null);
    setPhotoForm({ ...EMPTY_PHOTO_FORM });
    setPhotoModalOpen(true);
  };

  const openEditPhotoModal = (p) => {
    setEditingPhotoId(p.id);
    setPhotoForm({
      url: p.url || '',
      title: p.title || '',
      trek_name: p.trek_name || p.trekName || '',
      trek_slug: p.trek_slug ?? p.trekSlug ?? '',
      category: p.category || 'Summit Views',
      location: p.location || '',
      altitude: p.altitude || '',
      captured_at: p.captured_at || p.capturedAt || '',
      photographer: p.photographer || '',
      details: p.details || '',
      featured_on_home: Boolean(p.featured_on_home ?? p.featuredOnHome ?? false),
      is_active: p.is_active !== undefined ? Boolean(p.is_active) : p.isActive !== false
    });
    setPhotoModalOpen(true);
  };

  const handleSelectCatalogTrek = (slug) => {
    const found = treksCatalog.find((t) => t.slug === slug);
    if (found) {
      setPhotoForm((prev) => ({
        ...prev,
        trek_name: found.title,
        trek_slug: found.slug,
        altitude: found.altitude || prev.altitude,
        location: found.location || prev.location
      }));
    }
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!photoForm.url.trim() || !photoForm.title.trim()) {
      showToast('error', 'Photo URL and Title are required.');
      return;
    }

    setSavingPhoto(true);
    try {
      if (editingPhotoId) {
        await updateGalleryPhoto(editingPhotoId, photoForm);
        showToast('success', `"${photoForm.title}" updated live!`);
      } else {
        await createGalleryPhoto({ ...photoForm, display_order: photos.length + 1 });
        showToast('success', `"${photoForm.title}" published to Gallery!`);
      }
      setPhotoModalOpen(false);
      await loadGallery();
    } catch (err) {
      showToast('error', err.message || 'Failed to save photo');
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleToggleFeatured = async (p) => {
    const current = Boolean(p.featured_on_home ?? p.featuredOnHome ?? false);
    try {
      await updateGalleryPhoto(p.id, { featured_on_home: !current });
      showToast(
        'success',
        !current ? 'Featured on Homepage #gallery live!' : 'Removed from Homepage #gallery.'
      );
      await loadGallery();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleToggleActive = async (p) => {
    const current = p.is_active !== undefined ? p.is_active : p.isActive !== false;
    try {
      await updateGalleryPhoto(p.id, { is_active: !current });
      showToast('success', !current ? 'Photo visible live!' : 'Photo hidden.');
      await loadGallery();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleDeletePhoto = async (p) => {
    if (!window.confirm(`Delete "${p.title}" from Gallery?`)) return;
    try {
      await deleteGalleryPhoto(p.id);
      showToast('success', `Deleted "${p.title}"`);
      await loadGallery();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleMovePhoto = async (realIdx, dir) => {
    const target = realIdx + dir;
    if (target < 0 || target >= photos.length) return;
    const next = [...photos];
    const tmp = next[realIdx];
    next[realIdx] = next[target];
    next[target] = tmp;
    setPhotos(next);
    try {
      await reorderGalleryPhotos(next.map((p) => p.id));
      showToast('success', 'Photo order updated live!');
    } catch (err) {
      showToast('error', err.message);
      await loadGallery();
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset Gallery Hero Slides and all 15 photos back to TrekToShikhar defaults?')) return;
    setLoading(true);
    try {
      const res = await resetGalleryData();
      if (res?.settings) setSettings(res.settings);
      if (Array.isArray(res?.photos)) setPhotos(res.photos);
      setHasUnsavedSettings(false);
      showToast('success', 'Gallery reset to defaults!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySqlPath = () => {
    navigator.clipboard?.writeText('backend/database/gallery.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const uniqueTreks = useMemo(() => {
    return Array.from(new Set(photos.map((p) => p.trek_name || p.trekName).filter(Boolean)));
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return photos.filter((p) => {
      const tName = p.trek_name || p.trekName || '';
      const isFeat = Boolean(p.featured_on_home ?? p.featuredOnHome ?? false);
      const matchTrek = filterTrek === 'all' || tName === filterTrek;
      const matchFeat = !onlyHomeFeatured || isFeat;
      const matchSearch =
        !q ||
        (p.title || '').toLowerCase().includes(q) ||
        tName.toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q);
      return matchTrek && matchFeat && matchSearch;
    });
  }, [photos, filterTrek, onlyHomeFeatured, searchQuery]);

  const featuredCount = photos.filter((p) => p.featured_on_home || p.featuredOnHome).length;
  const firstHeroSlide =
    (settings.hero_slides && settings.hero_slides[0]) || DEFAULT_GALLERY_SETTINGS.hero_slides[0];

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
          1. MODULE HEADER BAR & SUB-TABS
         ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#E5383B] mb-1">
              <Camera className="w-3.5 h-3.5" />
              <span>Module 4 • Expedition Gallery &amp; Homepage Sync</span>
            </div>
            <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight">
              Expedition Gallery Manager
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">
              Upload Cloudinary trek photos, attach stories &amp; altitudes, pick Homepage Featured shots (★), and manage Gallery Hero Slides ({source === 'database' ? 'Supabase' : 'Live Sync'}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-bold transition"
            >
              <span>Preview /gallery</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={loadGallery}
              disabled={loading}
              className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 cursor-pointer transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {subTab === 'photos' ? (
              <button
                onClick={openAddPhotoModal}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:brightness-110 text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            ) : (
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer transition ${
                  hasUnsavedSettings
                    ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] ring-2 ring-[#E5383B]/30'
                    : 'bg-neutral-900 hover:bg-[#E5383B]'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSettings ? 'Saving...' : hasUnsavedSettings ? 'Save Hero Live' : 'Synced'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setSubTab('photos')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              subTab === 'photos'
                ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white shadow-md shadow-red-600/25'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>1. Expedition Photos ({photos.length}) • {featuredCount} on Home ★</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('hero-settings')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              subTab === 'hero-settings'
                ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white shadow-md shadow-red-600/25'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Hero Slider &amp; Page Copy ({settings.hero_slides?.length || 0} Slides)</span>
          </button>
        </div>
      </div>

      {/* Supabase SQL Hint Banner */}
      {tableNotReady && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-outfit font-extrabold text-sm text-amber-950">
                Using Local Sync Fallback — Gallery Supabase Tables Pending
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                All edits save and sync live right now! For permanent cloud PostgreSQL sync, run{' '}
                <code className="px-1.5 py-0.5 rounded bg-amber-100 font-bold">
                  backend/database/gallery.sql
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
            <span>{copiedSql ? 'Copied' : 'Copy SQL Path'}</span>
          </button>
        </div>
      )}

      {/* ============================================================
          SUB-TAB 1: EXPEDITION PHOTOS MANAGER
         ============================================================ */}
      {subTab === 'photos' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-5">
          {/* Search + Trek Filter + Home Featured Filter */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pb-4 border-b border-neutral-100">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search photos by title, trek, location, or category..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold bg-neutral-50/70 focus:outline-none focus:border-[#E5383B]"
              />
            </div>

            <select
              value={filterTrek}
              onChange={(e) => setFilterTrek(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 focus:outline-none focus:border-[#E5383B] cursor-pointer"
            >
              <option value="all">All Treks ({photos.length})</option>
              {uniqueTreks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setOnlyHomeFeatured((v) => !v)}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                onlyHomeFeatured
                  ? 'bg-amber-400 text-[#0A0A0A] border-amber-500 shadow-xs'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-amber-400'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyHomeFeatured ? 'fill-current' : ''}`} />
              <span>Homepage Featured ({featuredCount})</span>
            </button>
          </div>

          {/* Photo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPhotos.map((p, idx) => {
              const realIdx = photos.findIndex((item) => item.id === p.id);
              const isActive = p.is_active !== undefined ? p.is_active : p.isActive !== false;
              const isFeatured = Boolean(p.featured_on_home ?? p.featuredOnHome ?? false);

              return (
                <div
                  key={p.id || idx}
                  className={`rounded-2xl overflow-hidden border flex flex-col justify-between transition ${
                    isActive
                      ? 'bg-white border-neutral-200 shadow-2xs hover:border-neutral-300'
                      : 'bg-neutral-100 border-dashed border-neutral-300 opacity-75'
                  }`}
                >
                  <div>
                    {/* Clickable Thumbnail to Launch Zoomable Lightbox Preview */}
                    <div
                      onClick={() => setPreviewLightboxIdx(idx)}
                      className="relative h-48 bg-neutral-900 cursor-pointer group overflow-hidden"
                      title="Click to test Zoomable Lightbox"
                    >
                      <img
                        src={p.url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 text-[#FFD700] text-[10px] font-black">
                        #{realIdx + 1} • {p.altitude}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFeatured(p);
                        }}
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1 shadow-md cursor-pointer transition ${
                          isFeatured
                            ? 'bg-[#FFD700] text-[#0A0A0A]'
                            : 'bg-black/60 text-white/80 hover:bg-black/85'
                        }`}
                        title="Toggle show on Homepage #gallery"
                      >
                        <Star className={`w-3 h-3 ${isFeatured ? 'fill-current' : ''}`} />
                        <span>{isFeatured ? 'Home ★' : 'Pin Home'}</span>
                      </button>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-3 py-1.5 rounded-full bg-white/95 text-[#0A0A0A] text-[10px] font-black uppercase inline-flex items-center gap-1 shadow-xl">
                          <ZoomIn className="w-3 h-3 text-[#E5383B]" /> Preview Zoom
                        </span>
                      </div>

                      <span className="absolute bottom-2.5 left-2.5 right-2.5 text-[11px] font-extrabold text-white truncate">
                        {p.trek_name || p.trekName}
                      </span>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="font-outfit font-black text-sm text-[#0A0A0A] line-clamp-1">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {p.category} • {p.location} • {p.captured_at || p.capturedAt}
                      </p>
                      <p className="text-xs text-neutral-600 line-clamp-2 pt-1">
                        {p.details || 'No story description added.'}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Bar */}
                  <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMovePhoto(realIdx, -1)}
                        disabled={realIdx <= 0 || Boolean(searchQuery) || filterTrek !== 'all'}
                        className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-35 cursor-pointer"
                        title="Move Earlier"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMovePhoto(realIdx, 1)}
                        disabled={realIdx >= photos.length - 1 || Boolean(searchQuery) || filterTrek !== 'all'}
                        className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-35 cursor-pointer"
                        title="Move Later"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border cursor-pointer ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        {isActive ? 'Live' : 'Hidden'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditPhotoModal(p)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(p)}
                        className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer transition"
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
      )}

      {/* ============================================================
          SUB-TAB 2: GALLERY HERO SLIDER & PAGE COPY
         ============================================================ */}
      {subTab === 'hero-settings' && (
        <div className="space-y-6">
          {/* Live Interactive Gallery Hero Preview */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-outfit font-black text-sm uppercase tracking-wider text-neutral-800">
                Live Gallery Hero Preview
              </h3>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-neutral-950 text-white border border-neutral-800 shadow-lg">
              <img
                src={firstHeroSlide.url}
                alt={firstHeroSlide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.85) 100%)'
                }}
              />
              <div className="relative z-10 px-6 py-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-[10px] font-black uppercase tracking-widest text-amber-200">
                  <Sparkles className="w-3 h-3" /> {settings.hero_badge}
                </span>
                <h4 className="font-outfit font-black text-2xl sm:text-3xl uppercase tracking-wider leading-tight">
                  {settings.hero_title_line1}
                  <span className="font-brush normal-case text-3xl sm:text-4xl text-amber-300 block font-normal mt-0.5">
                    {settings.hero_title_cursive}
                  </span>
                </h4>
                <p className="text-xs text-white/90 max-w-xl leading-relaxed">
                  {firstHeroSlide.caption} {settings.hero_subtitle}
                </p>
              </div>
              <div className="relative z-10 px-4 py-2.5 bg-neutral-950/90 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#E5383B]" />
                  <strong>{firstHeroSlide.title}</strong>
                  <span className="text-[#FFD700]">• {firstHeroSlide.location}</span>
                </span>
                <span className="text-neutral-400">{settings.hero_slides?.length || 0} Slides Active</span>
              </div>
            </div>
          </div>

          {/* Hero Copy & Homepage Gallery Copy */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-5">
            <h3 className="font-outfit font-black text-lg text-[#0A0A0A] pb-3 border-b border-neutral-100">
              Gallery Hero &amp; Homepage Section Text
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Hero Badge</label>
                <input
                  type="text"
                  value={settings.hero_badge || ''}
                  onChange={(e) => handleSettingField('hero_badge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Hero Headline Line 1</label>
                <input
                  type="text"
                  value={settings.hero_title_line1 || ''}
                  onChange={(e) => handleSettingField('hero_title_line1', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Hero Golden Cursive Tagline</label>
                <input
                  type="text"
                  value={settings.hero_title_cursive || ''}
                  onChange={(e) => handleSettingField('hero_title_cursive', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Homepage Gallery Section Title</label>
                <input
                  type="text"
                  value={settings.home_gallery_title || ''}
                  onChange={(e) => handleSettingField('home_gallery_title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.hero_subtitle || ''}
                  onChange={(e) => handleSettingField('hero_subtitle', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Homepage Gallery Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.home_gallery_subtitle || ''}
                  onChange={(e) => handleSettingField('home_gallery_subtitle', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Gallery Hero Slides Manager */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
                  Gallery Hero Sliding Images ({settings.hero_slides?.length || 0})
                </h3>
                <p className="text-xs text-neutral-500">
                  These slides auto-rotate in the 100vh hero banner on `/gallery`.
                </p>
              </div>
              <button
                type="button"
                onClick={addHeroSlide}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5383B] text-white text-xs font-black uppercase cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Slide
              </button>
            </div>

            <div className="space-y-3">
              {(settings.hero_slides || []).map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row gap-4 items-start"
                >
                  <img
                    src={slide.url}
                    alt={slide.title}
                    className="w-full sm:w-28 h-24 rounded-xl object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Cloudinary / HTTPS Slide URL"
                      value={slide.url || ''}
                      onChange={(e) => updateHeroSlide(idx, 'url', e.target.value)}
                      className="sm:col-span-2 px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Slide Title"
                      value={slide.title || ''}
                      onChange={(e) => updateHeroSlide(idx, 'title', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Location & Altitude"
                      value={slide.location || ''}
                      onChange={(e) => updateHeroSlide(idx, 'location', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Short Slide Caption"
                      value={slide.caption || ''}
                      onChange={(e) => updateHeroSlide(idx, 'caption', e.target.value)}
                      className="sm:col-span-2 px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHeroSlide(idx)}
                    className="p-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer shrink-0"
                    title="Remove Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          ADD / EDIT EXPEDITION PHOTO PORTAL MODAL
         ============================================================ */}
      {photoModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-2xl h-[88vh] max-h-[680px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200">
              <div className="px-6 py-4 bg-neutral-950 text-white flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E5383B]">
                    Gallery Frame Customizer
                  </span>
                  <h3 className="font-outfit font-black text-lg">
                    {editingPhotoId ? `Edit: ${photoForm.title}` : 'Add New Expedition Photo'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form id="gallery-photo-form" onSubmit={handleSavePhoto} className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Live Image Preview + URL */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-full sm:w-28 h-24 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center">
                    {photoForm.url ? (
                      <img src={photoForm.url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Cloudinary / HTTPS Image URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={photoForm.url}
                      onChange={(e) => setPhotoForm({ ...photoForm, url: e.target.value })}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    placeholder="e.g. Kedarkantha Dawn Summit Panorama"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#E5383B]"
                  />
                </div>

                {/* Link to Live Trek Dropdown + Trek Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Quick-Pick Trek (Auto-fills Slug &amp; Altitude)
                    </label>
                    <select
                      value={photoForm.trek_slug}
                      onChange={(e) => handleSelectCatalogTrek(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold bg-neutral-50 cursor-pointer"
                    >
                      <option value="">-- Choose Expedition --</option>
                      {treksCatalog.map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.title} ({t.altitude})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Trek Section Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={photoForm.trek_name}
                      onChange={(e) => setPhotoForm({ ...photoForm, trek_name: e.target.value })}
                      placeholder="Kedarkantha Summit Expedition"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Category</label>
                    <select
                      value={photoForm.category}
                      onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold bg-white cursor-pointer"
                    >
                      {GALLERY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Altitude</label>
                    <input
                      type="text"
                      value={photoForm.altitude}
                      onChange={(e) => setPhotoForm({ ...photoForm, altitude: e.target.value })}
                      placeholder="12,500 ft"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={photoForm.location}
                      onChange={(e) => setPhotoForm({ ...photoForm, location: e.target.value })}
                      placeholder="Sankri, Uttarakhand"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Captured Time / Date</label>
                    <input
                      type="text"
                      value={photoForm.captured_at}
                      onChange={(e) => setPhotoForm({ ...photoForm, captured_at: e.target.value })}
                      placeholder="Jan 2026 • 6:22 AM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Shot By / Photographer</label>
                    <input
                      type="text"
                      value={photoForm.photographer}
                      onChange={(e) => setPhotoForm({ ...photoForm, photographer: e.target.value })}
                      placeholder="Raghav Chauhan (Lead Guide)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                    />
                  </div>
                </div>

                {/* Full Story Details (shown in Lightbox popup!) */}
                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                    Story / Photo Details (Shown in Lightbox Popup)
                  </label>
                  <textarea
                    rows={3}
                    value={photoForm.details}
                    onChange={(e) => setPhotoForm({ ...photoForm, details: e.target.value })}
                    placeholder="Explain what moment was captured, weather, trail vibe, or batch memory..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs leading-relaxed focus:outline-none focus:border-[#E5383B]"
                  />
                </div>

                {/* Homepage Featured & Live Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer">
                    <div>
                      <span className="text-xs font-black text-neutral-900 block">Feature on Homepage ★</span>
                      <span className="text-[10px] text-neutral-600">Shows in Homepage #gallery section</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(photoForm.featured_on_home)}
                      onChange={(e) => setPhotoForm({ ...photoForm, featured_on_home: e.target.checked })}
                      className="w-4 h-4 accent-[#E5383B] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
                    <div>
                      <span className="text-xs font-black text-neutral-900 block">Visible Live</span>
                      <span className="text-[10px] text-neutral-600">Publicly visible on /gallery</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(photoForm.is_active)}
                      onChange={(e) => setPhotoForm({ ...photoForm, is_active: e.target.checked })}
                      className="w-4 h-4 accent-[#E5383B] cursor-pointer"
                    />
                  </label>
                </div>
              </form>

              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="gallery-photo-form"
                  disabled={savingPhoto}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
                >
                  {savingPhoto ? 'Saving...' : editingPhotoId ? 'Update Photo Live' : 'Publish Photo Live'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Admin Zoomable Lightbox Preview */}
      <GalleryLightboxModal
        photos={filteredPhotos}
        activeIndex={previewLightboxIdx}
        onClose={() => setPreviewLightboxIdx(null)}
        onChangeIndex={(nextIdx) => setPreviewLightboxIdx(nextIdx)}
      />
    </div>
  );
}
