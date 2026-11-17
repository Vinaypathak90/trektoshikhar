import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Sparkles, 
  Eye, 
  Check, 
  X, 
  MoveUp, 
  MoveDown, 
  Flame, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  Layers,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { 
  getHeroSlides, 
  createHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide, 
  reorderHeroSlides 
} from '../lib/heroApi';

export default function HeroSlidesModule() {
  const initialFallback = [
    {
      id: '1',
      title: "Kedarkantha Summit Ridge",
      location: "Uttarakhand (12,500 ft)",
      highlight: "Winter Snow Expedition",
      next_batch: "22 Nov • 4 slots left",
      headline_line1: "WALK THE UNTOUCHED TRAILS",
      cursive_text: "reach your shikhar",
      subtitle: "Curated mountain expeditions with certified Himalayan leaders across Shimla, Dehradun, and the high peaks.",
      image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=80",
      display_order: 1,
      is_active: true
    }
  ];

  const [slides, setSlides] = useState(initialFallback);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewSlide, setPreviewSlide] = useState(initialFallback[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    highlight: '',
    next_batch: '',
    headline_line1: '',
    cursive_text: '',
    subtitle: '',
    image_url: '',
    is_active: true
  });

  // Load slides from backend API on mount
  const loadSlides = async () => {
    setIsLoading(true);
    try {
      const data = await getHeroSlides(true);
      if (Array.isArray(data) && data.length > 0) {
        setSlides(data);
        setPreviewSlide(data[0]);
      }
    } catch (err) {
      console.warn('Error loading slides from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  // Lock body scroll when modal is open so it never shifts or scrolls background
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      location: 'Uttarakhand / Himachal',
      highlight: 'Featured Summit',
      next_batch: 'Upcoming Departure',
      headline_line1: 'WALK THE UNTOUCHED TRAILS',
      cursive_text: 'reach your shikhar',
      subtitle: 'Curated mountain expeditions with certified Himalayan leaders.',
      image_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1920&q=80',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      location: slide.location || '',
      highlight: slide.highlight || '',
      next_batch: slide.next_batch || slide.nextBatch || '',
      headline_line1: slide.headline_line1 || slide.headlineLine1 || '',
      cursive_text: slide.cursive_text || slide.cursiveText || '',
      subtitle: slide.subtitle || '',
      image_url: slide.image_url || slide.url || '',
      is_active: slide.is_active !== undefined ? slide.is_active : true
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      alert("Please provide at least a slide title and Cloudinary image link.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSlide) {
        await updateHeroSlide(editingSlide.id, formData);
        showToast(`Slide "${formData.title}" updated in database!`);
      } else {
        await createHeroSlide({
          ...formData,
          display_order: slides.length + 1
        });
        showToast(`New slide "${formData.title}" created in database!`);
      }

      await loadSlides();
      setIsModalOpen(false);
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (slides.length <= 1) {
      alert("At least one slide must remain active in the Hero Header.");
      return;
    }
    if (window.confirm(`Delete header slide "${title}" from database?`)) {
      try {
        await deleteHeroSlide(id);
        showToast(`Slide "${title}" removed.`);
        await loadSlides();
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      await updateHeroSlide(slide.id, { is_active: !slide.is_active });
      await loadSlides();
      showToast(`Status changed for "${slide.title}".`);
    } catch (err) {
      alert(`Toggle failed: ${err.message}`);
    }
  };

  const handleMove = async (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setSlides(updated);

    try {
      await reorderHeroSlides(updated.map(s => s.id));
      showToast("Slide order saved!");
    } catch (err) {
      console.warn("Reorder sync error:", err);
    }
  };

  return (
    <div className="space-y-8 animate-editorial-fade">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#E5383B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info & Add Slide Button */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Module 1 • Hero &amp; Header Slider Control</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[#0A0A0A] tracking-tight">
            Hero Header Slides
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Connected live to Supabase. Control your homepage background slides, headline typography, cursive brush accents, and upcoming departure dates.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={loadSlides}
            disabled={isLoading}
            className="p-3 rounded-2xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition cursor-pointer"
            title="Refresh from Database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#E5383B]' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-950 hover:from-neutral-950 hover:to-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Header Slide</span>
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="bg-neutral-950 text-white rounded-3xl p-6 border border-neutral-800 shadow-xl overflow-hidden relative">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">Live Header Look Preview</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Connected to Database
          </span>
        </div>

        <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between p-6">
          <img 
            src={previewSlide.image_url || previewSlide.url} 
            alt="Preview" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.55]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

          {/* Top Pill */}
          <div className="relative z-10 self-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-[11px] font-bold text-amber-200">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Upcoming: {previewSlide.title}</span>
              <span className="text-white/40">•</span>
              <span className="text-white">{previewSlide.next_batch || previewSlide.nextBatch}</span>
            </div>
          </div>

          {/* Center Titles */}
          <div className="relative z-10 text-center my-auto">
            <h3 className="text-xl sm:text-2xl font-bold font-outfit uppercase tracking-wider text-white">
              {previewSlide.headline_line1 || previewSlide.headlineLine1 || "WALK THE UNTOUCHED TRAILS"}
            </h3>
            <span className="font-brush text-2xl sm:text-4xl text-amber-300 block -rotate-1 font-normal mt-0.5">
              {previewSlide.cursive_text || previewSlide.cursiveText || "reach your shikhar"}
            </span>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 flex items-center justify-between text-[11px] border-t border-white/15 pt-2 text-white/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#E5383B]" />
              <span className="font-bold">{previewSlide.location}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#E5383B] text-white font-extrabold uppercase text-[10px]">
              {previewSlide.highlight}
            </span>
          </div>
        </div>
      </div>

      {/* Slides List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black font-outfit text-[#0A0A0A]">
            Current Slides in Database ({slides.length})
          </h3>
          <span className="text-xs text-neutral-400 font-semibold">
            Slides loop automatically every 4.5s on Homepage
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-neutral-500 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#E5383B]" />
            <span>Fetching live slides from database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {slides.map((slide, idx) => (
              <div 
                key={slide.id || idx}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
                  previewSlide.id === slide.id ? 'border-[#E5383B] ring-2 ring-[#E5383B]/10' : 'border-neutral-200/90 hover:border-neutral-300'
                }`}
              >
                {/* Left: Thumbnail & Content */}
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-18 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100 group">
                    <img 
                      src={slide.image_url || slide.url} 
                      alt={slide.title}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-neutral-900 font-outfit">{slide.title}</span>
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full cursor-pointer transition ${
                          slide.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                        }`}
                        title="Click to toggle active status"
                      >
                        {slide.is_active ? 'Active in Hero' : 'Hidden'}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium">
                      {slide.location} • <strong className="text-[#E5383B]">{slide.next_batch || slide.nextBatch}</strong>
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate max-w-md mt-0.5 font-mono">
                      {slide.image_url || slide.url}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  {/* Preview Trigger */}
                  <button
                    onClick={() => setPreviewSlide(slide)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  {/* Reorder Buttons */}
                  <div className="flex items-center bg-neutral-100 rounded-xl p-0.5 border border-neutral-200/60">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      className="p-1.5 text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === slides.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      className="p-1.5 text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(slide.id, slide.title)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====================================================================
          MODAL: ADD / EDIT HEADER SLIDE (ALWAYS CENTERED & RESPONSIVE)
         ==================================================================== */}
      {isModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl w-full max-w-2xl h-[86vh] max-h-[620px] shadow-2xl border border-neutral-200/90 flex flex-col overflow-hidden animate-editorial-fade"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Sticky Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E5383B] block">Hero Customizer</span>
                <h3 className="font-outfit font-black text-lg sm:text-xl text-[#0A0A0A]">
                  {editingSlide ? 'Edit Header Slide' : 'Add New Header Slide'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} id="hero-slide-form" className="px-5 sm:px-7 py-5 overflow-y-auto flex-1 space-y-4 bg-neutral-50/40">
              
              {/* Slide Title & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Trek / Slide Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Kedarkantha Summit Ridge"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Location &amp; Altitude *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Uttarakhand (12,500 ft)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Cloudinary Image URL with Live Preview */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Cloudinary Image Link URL *
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData(p => ({ ...p, image_url: e.target.value }))}
                    placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] focus:outline-none font-mono bg-white"
                  />
                </div>
                {formData.image_url && (
                  <div className="mt-2.5 p-2 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center gap-3">
                    <img 
                      src={formData.image_url} 
                      alt="Slide preview" 
                      className="w-20 h-12 object-cover rounded-lg border border-neutral-300 shrink-0" 
                    />
                    <div className="truncate text-xs">
                      <span className="font-bold text-emerald-600 block">✓ Valid Image Preview</span>
                      <span className="text-[10px] text-neutral-500 truncate block">{formData.image_url}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Headline & Brush Cursive Accent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Headline Text</label>
                  <input
                    type="text"
                    value={formData.headline_line1}
                    onChange={(e) => setFormData(p => ({ ...p, headline_line1: e.target.value }))}
                    placeholder="e.g. WALK THE UNTOUCHED TRAILS"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Cursive Brush Accent Text</label>
                  <input
                    type="text"
                    value={formData.cursive_text}
                    onChange={(e) => setFormData(p => ({ ...p, cursive_text: e.target.value }))}
                    placeholder="e.g. reach your shikhar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none text-[#E5383B] font-bold bg-white"
                  />
                  {formData.cursive_text && (
                    <p className="font-brush text-lg text-[#E5383B] mt-0.5">
                      Preview: {formData.cursive_text}
                    </p>
                  )}
                </div>
              </div>

              {/* Highlight Tag & Next Batch Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Highlight Badge Tag</label>
                  <input
                    type="text"
                    value={formData.highlight}
                    onChange={(e) => setFormData(p => ({ ...p, highlight: e.target.value }))}
                    placeholder="e.g. Winter Snow Expedition"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Next Batch Status Pill</label>
                  <input
                    type="text"
                    value={formData.next_batch}
                    onChange={(e) => setFormData(p => ({ ...p, next_batch: e.target.value }))}
                    placeholder="e.g. 22 Nov • 4 slots left"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Subtitle / Paragraph Description</label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData(p => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Curated mountain expeditions with certified Himalayan leaders..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none resize-none bg-white"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#E5383B] focus:ring-[#E5383B] cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-bold text-neutral-800 cursor-pointer">
                  Display this slide in active Hero rotation on website
                </label>
              </div>

            </form>

            {/* Sticky Footer */}
            <div className="px-5 sm:px-7 py-3.5 border-t border-neutral-200/90 bg-white flex items-center justify-end gap-3 shrink-0 shadow-lg">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="hero-slide-form"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-950 hover:from-neutral-950 hover:to-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition cursor-pointer flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isSubmitting ? 'Saving to Database...' : 'Save Slide to Database'}</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
