import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Database,
  Copy,
  Check
} from 'lucide-react';
import WhyChooseSection, {
  WHY_CHOOSE_ICON_MAP,
  WHY_CHOOSE_ICON_OPTIONS
} from '../components/WhyChooseSection';
import {
  DEFAULT_WHY_CHOOSE_DATA,
  getWhyChooseData,
  updateWhyChooseData,
  resetWhyChooseData
} from '../lib/whyChooseApi';

const EMPTY_STAT = {
  id: '',
  icon: 'Mountain',
  target_number: 100,
  prefix: '',
  suffix: '+',
  label: '',
  sublabel: '',
  is_highlighted: false
};

export default function WhyChooseModule() {
  const [formData, setFormData] = useState(DEFAULT_WHY_CHOOSE_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tableNotReady, setTableNotReady] = useState(false);
  const [source, setSource] = useState('database');
  const [toast, setToast] = useState(null);
  const [replayKey, setReplayKey] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Modal state for Add / Edit Stat Card
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [statForm, setStatForm] = useState(EMPTY_STAT);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await getWhyChooseData({ admin: true });
      if (res?.data) {
        setFormData(res.data);
        setTableNotReady(Boolean(res.tableNotReady));
        setSource(res.source || 'database');
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      showToast('error', 'Failed to load Why Choose config: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Lock body scroll when modal is open
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

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = async (overridePayload = null) => {
    setSaving(true);
    try {
      const payloadToSave = overridePayload || formData;
      const res = await updateWhyChooseData(payloadToSave);
      if (res?.data) {
        setFormData(res.data);
      }
      setTableNotReady(Boolean(res?.tableNotReady));
      setSource(res?.source || 'database');
      setHasUnsavedChanges(false);
      setReplayKey((k) => k + 1);
      showToast('success', res?.message || 'Saved & synced live across all pages!');
    } catch (err) {
      showToast('error', err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset Why Choose section and all stat cards back to TrekToShikhar defaults?')) {
      return;
    }
    setSaving(true);
    try {
      const res = await resetWhyChooseData();
      if (res?.data) {
        setFormData(res.data);
      }
      setHasUnsavedChanges(false);
      setReplayKey((k) => k + 1);
      showToast('success', 'Reset to default TrekToShikhar milestones!');
    } catch (err) {
      showToast('error', err.message || 'Failed to reset');
    } finally {
      setSaving(false);
    }
  };

  // Open modal for new card
  const openAddStatModal = () => {
    setEditingIndex(null);
    setStatForm({
      ...EMPTY_STAT,
      id: `stat-${Date.now()}`
    });
    setModalOpen(true);
  };

  // Open modal for editing an existing card
  const openEditStatModal = (idx) => {
    setEditingIndex(idx);
    setStatForm({ ...formData.stats[idx] });
    setModalOpen(true);
  };

  // Save card from modal into formData & auto-persist live
  const handleSaveStatCard = async (e) => {
    e.preventDefault();
    if (!statForm.label.trim()) {
      showToast('error', 'Please enter a Stat Title (e.g. Happy Trekkers)');
      return;
    }

    const updatedStats = [...(formData.stats || [])];
    const cleanCard = {
      ...statForm,
      id: statForm.id || `stat-${Date.now()}`,
      target_number: Math.max(0, Number(statForm.target_number) || 0),
      label: statForm.label.trim(),
      sublabel: (statForm.sublabel || '').trim(),
      prefix: (statForm.prefix || '').trim(),
      suffix: statForm.suffix ?? '+'
    };

    if (editingIndex === null) {
      updatedStats.push(cleanCard);
    } else {
      updatedStats[editingIndex] = cleanCard;
    }

    const nextData = { ...formData, stats: updatedStats };
    setFormData(nextData);
    setModalOpen(false);
    await handleSaveAll(nextData);
  };

  const handleDeleteStat = async (idx) => {
    if ((formData.stats || []).length <= 1) {
      showToast('error', 'At least 1 stat card is required.');
      return;
    }
    if (!window.confirm(`Delete "${formData.stats[idx].label}" card?`)) return;
    const updatedStats = formData.stats.filter((_, i) => i !== idx);
    const nextData = { ...formData, stats: updatedStats };
    setFormData(nextData);
    await handleSaveAll(nextData);
  };

  const handleMoveStat = async (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= formData.stats.length) return;
    const updatedStats = [...formData.stats];
    const temp = updatedStats[idx];
    updatedStats[idx] = updatedStats[targetIdx];
    updatedStats[targetIdx] = temp;
    const nextData = { ...formData, stats: updatedStats };
    setFormData(nextData);
    await handleSaveAll(nextData);
  };

  const handleToggleHighlight = async (idx) => {
    const updatedStats = formData.stats.map((s, i) =>
      i === idx ? { ...s, is_highlighted: !s.is_highlighted } : s
    );
    const nextData = { ...formData, stats: updatedStats };
    setFormData(nextData);
    await handleSaveAll(nextData);
  };

  const handleCopySqlHint = () => {
    const sqlPath = 'backend/database/why_choose.sql';
    navigator.clipboard?.writeText(sqlPath);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

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
            <Sparkles className="w-3.5 h-3.5" />
            <span>Module 3 • Global Animated Counter Section</span>
          </div>
          <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight">
            Why Choose TrekToShikhar Manager
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Globally reusable section with scroll-triggered live counters. Control headings, counter targets, icons, red highlight borders, and card order live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={fetchConfig}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 cursor-pointer transition"
            title="Refresh from Backend"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleResetDefaults}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => handleSaveAll()}
            disabled={saving}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:scale-[1.02] ring-2 ring-[#E5383B]/30'
                : 'bg-neutral-900 hover:bg-[#E5383B]'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Live...' : hasUnsavedChanges ? 'Save Changes Live' : 'Synced Live'}</span>
          </button>
        </div>
      </div>

      {/* Optional Supabase Table Hint Banner (only shown if SQL hasn't been executed yet) */}
      {tableNotReady && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-outfit font-extrabold text-sm text-amber-950">
                Using Local Sync Fallback — Supabase Table Pending
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Your edits are working and saving live right now! For permanent cloud PostgreSQL sync, run <code className="px-1.5 py-0.5 rounded bg-amber-100 font-bold">backend/database/why_choose.sql</code> in Supabase SQL Editor.
              </p>
            </div>
          </div>
          <button
            onClick={handleCopySqlHint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 cursor-pointer transition"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Path Copied' : 'Copy SQL Path'}</span>
          </button>
        </div>
      )}

      {/* ============================================================
          2. LIVE INTERACTIVE PREVIEW (EXACT FRONTEND RENDER)
         ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-outfit font-black text-sm uppercase tracking-wider text-neutral-800">
              Live Frontend Preview
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
              {source === 'database' ? 'Supabase Synced' : 'Live Sync Active'}
            </span>
          </div>

          <button
            onClick={() => setReplayKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-[#E5383B] text-[#E5383B] hover:text-white text-xs font-extrabold transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Replay Counter Animation</span>
          </button>
        </div>

        <WhyChooseSection
          overrideData={formData}
          previewMode={true}
          forceReplayKey={replayKey}
        />
      </div>

      {/* ============================================================
          3. SECTION HEADER & GLOBAL VISIBILITY SETTINGS
         ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
              Section Heading &amp; Visibility
            </h3>
            <p className="text-xs text-neutral-500">
              Changes reflect globally wherever <code className="text-[#E5383B] font-bold">&lt;WhyChooseSection /&gt;</code> is rendered.
            </p>
          </div>

          {/* Global Active / Visibility Switch */}
          <button
            type="button"
            onClick={() => handleFieldChange('is_active', !formData.is_active)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
              formData.is_active
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
            }`}
          >
            {formData.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{formData.is_active ? 'Visible on Website' : 'Hidden on Website'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-neutral-700 mb-1.5">
              Main Section Title *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Why Choose TrekToShikhar?"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-neutral-700 mb-1.5">
              Top Red Pill Badge (Optional — leave empty to hide)
            </label>
            <input
              type="text"
              value={formData.badge_text || ''}
              onChange={(e) => handleFieldChange('badge_text', e.target.value)}
              placeholder="TRUSTED HIMALAYAN EXPEDITION LEADER"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-extrabold text-neutral-700 mb-1.5">
              Subtitle Description
            </label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              placeholder="Trusted by over 5 Lakh trekkers and recognized by leading adventure bodies."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          4. COUNTER STAT CARDS MANAGER
         ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
              Animated Counter Cards ({formData.stats?.length || 0})
            </h3>
            <p className="text-xs text-neutral-500">
              Add, edit, reorder, highlight with red border, or remove stat milestones.
            </p>
          </div>

          <button
            onClick={openAddStatModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:brightness-110 text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stat Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(formData.stats || []).map((stat, idx) => {
            const IconComp = WHY_CHOOSE_ICON_MAP[stat.icon] || WHY_CHOOSE_ICON_MAP.Mountain;
            return (
              <div
                key={stat.id || idx}
                className={`rounded-2xl p-5 bg-neutral-50/70 border transition-all flex flex-col justify-between gap-4 ${
                  stat.is_highlighted
                    ? 'border-[#E5383B] bg-red-50/20 shadow-sm'
                    : 'border-neutral-200/90 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white border border-red-100 text-[#E5383B] flex items-center justify-center shadow-2xs shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-outfit font-black text-xl text-[#0A0A0A] leading-none">
                        {stat.prefix || ''}
                        {Number(stat.target_number || 0).toLocaleString('en-US')}
                        {stat.suffix ?? '+'}
                      </div>
                      <div className="font-outfit font-extrabold text-sm text-neutral-800 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-neutral-200/80 text-neutral-600">
                    #{idx + 1}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed min-h-[32px]">
                  {stat.sublabel || 'No subtext'}
                </p>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-200/70">
                  {/* Reorder & Highlight */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveStat(idx, -1)}
                      disabled={idx === 0 || saving}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-black disabled:opacity-35 cursor-pointer transition"
                      title="Move Left / Earlier"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveStat(idx, 1)}
                      disabled={idx === formData.stats.length - 1 || saving}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-black disabled:opacity-35 cursor-pointer transition"
                      title="Move Right / Later"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleHighlight(idx)}
                      disabled={saving}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold border transition cursor-pointer ${
                        stat.is_highlighted
                          ? 'bg-[#E5383B] text-white border-[#E5383B]'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-[#E5383B] hover:text-[#E5383B]'
                      }`}
                      title="Toggle Crimson Red Border"
                    >
                      {stat.is_highlighted ? 'Red Border ON' : 'Red Border'}
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditStatModal(idx)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold cursor-pointer transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteStat(idx)}
                      className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer transition"
                      title="Delete Card"
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
          5. ADD / EDIT STAT CARD PORTAL MODAL (CENTERED, NO CUTOFF)
         ============================================================ */}
      {modalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-xl h-[86vh] max-h-[620px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-neutral-950 text-white flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E5383B]">
                    Counter Milestone Customizer
                  </span>
                  <h3 className="font-outfit font-black text-lg leading-tight">
                    {editingIndex === null ? 'Add New Stat Card' : `Edit: ${statForm.label || 'Stat Card'}`}
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

              {/* Scrollable Modal Body */}
              <form id="stat-card-form" onSubmit={handleSaveStatCard} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Target Number + Prefix + Suffix */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Prefix
                    </label>
                    <input
                      type="text"
                      value={statForm.prefix || ''}
                      onChange={(e) => setStatForm({ ...statForm, prefix: e.target.value })}
                      placeholder="e.g. #"
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                  <div className="col-span-6">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Target Number (Animated) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={statForm.target_number}
                      onChange={(e) => setStatForm({ ...statForm, target_number: e.target.value })}
                      placeholder="500000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-black focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Suffix
                    </label>
                    <input
                      type="text"
                      value={statForm.suffix ?? '+'}
                      onChange={(e) => setStatForm({ ...statForm, suffix: e.target.value })}
                      placeholder="+"
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                </div>

                {/* Label & Sublabel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Stat Title / Label *
                    </label>
                    <input
                      type="text"
                      required
                      value={statForm.label}
                      onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                      placeholder="e.g. Happy Trekkers"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Subtext Description
                    </label>
                    <input
                      type="text"
                      value={statForm.sublabel || ''}
                      onChange={(e) => setStatForm({ ...statForm, sublabel: e.target.value })}
                      placeholder="e.g. Across 60+ destinations"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                </div>

                {/* Icon Picker Grid */}
                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-2">
                    Select Card Icon ({statForm.icon})
                  </label>
                  <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                    {WHY_CHOOSE_ICON_OPTIONS.map((iconName) => {
                      const Ico = WHY_CHOOSE_ICON_MAP[iconName];
                      const selected = statForm.icon === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setStatForm({ ...statForm, icon: iconName })}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                            selected
                              ? 'bg-[#E5383B] text-white border-[#E5383B] shadow-md scale-105'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-[#E5383B] hover:text-[#E5383B]'
                          }`}
                          title={iconName}
                        >
                          <Ico className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Highlight Border Toggle */}
                <label className="flex items-center justify-between p-4 rounded-2xl bg-red-50/60 border border-red-200/80 cursor-pointer">
                  <div>
                    <span className="text-xs font-black text-[#0A0A0A] block">
                      Featured Crimson Red Border
                    </span>
                    <span className="text-[11px] text-neutral-600">
                      Highlights this card permanently with the signature red border (like Card #1).
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(statForm.is_highlighted)}
                    onChange={(e) => setStatForm({ ...statForm, is_highlighted: e.target.checked })}
                    className="w-5 h-5 accent-[#E5383B] cursor-pointer"
                  />
                </label>
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
                  form="stat-card-form"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer transition"
                >
                  {saving ? 'Saving...' : editingIndex === null ? 'Add & Save Live' : 'Update & Save Live'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
