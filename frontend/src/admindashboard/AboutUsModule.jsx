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
  Users,
  Sparkles,
  Star,
  BookOpen,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Database,
  Copy,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Heart,
  ArrowRight,
  MapPin,
  Compass,
  Mountain,
  MessageSquare,
  Eye
} from 'lucide-react';
import WhyChooseModule from './WhyChooseModule';
import ReviewsModule from './ReviewsModule';
import { PILLAR_ICON_MAP, PILLAR_ICON_OPTIONS } from '../components/AboutUsPage';
import { getHeroSlides, getCachedHeroSlides } from '../lib/heroApi';
import {
  DEFAULT_ABOUT_SETTINGS,
  DEFAULT_TEAM_MEMBERS,
  getAboutUs,
  updateAboutUsSettings,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
  resetAboutUsData
} from '../lib/aboutUsApi';

const EMPTY_TEAM_FORM = {
  name: '',
  role: '',
  base: 'Dehradun & Shimla Base',
  experience: '6+ Years in Himalayas',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85',
  short_tag: 'NIM Certified • Mountain Leader',
  quote: '',
  bio: '',
  certificationsText: 'NIM Uttarkashi Certified\nWilderness First Responder (WFR)',
  favorite_trek: 'Kedarkantha Summit',
  specialty: 'High-Altitude Trekking & Safety',
  is_active: true
};

const EMPTY_PILLAR = {
  num: '07',
  icon: 'HeartHandshake',
  title: '',
  desc: '',
  footer_tag: 'TrekToShikhar Promise'
};

export default function AboutUsModule() {
  // Unified sub-tabs merging About Us + Why Choose Counters + Google Reviews
  const [subTab, setSubTab] = useState('hero-story');
  const [previewPane, setPreviewPane] = useState('hero');
  const [globalHeroSlide, setGlobalHeroSlide] = useState(() => {
    const cached = getCachedHeroSlides();
    if (cached && cached.length > 0) {
      return {
        url: cached[0].image_url || cached[0].url,
        title: cached[0].title || 'Kedarkantha Summit Ridge',
        location: cached[0].location || 'Uttarakhand (12,500 ft)'
      };
    }
    return {
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=85',
      title: 'Kedarkantha Summit Ridge',
      location: 'Uttarakhand (12,500 ft)'
    };
  });

  const [settings, setSettings] = useState(DEFAULT_ABOUT_SETTINGS);
  const [team, setTeam] = useState(DEFAULT_TEAM_MEMBERS);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingTeam, setSavingTeam] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [tableNotReady, setTableNotReady] = useState(false);
  const [source, setSource] = useState('database');
  const [toast, setToast] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Team Member Portal Modal
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [teamForm, setTeamForm] = useState(EMPTY_TEAM_FORM);

  // Pillar Portal Modal
  const [pillarModalOpen, setPillarModalOpen] = useState(false);
  const [editingPillarIdx, setEditingPillarIdx] = useState(null);
  const [pillarForm, setPillarForm] = useState(EMPTY_PILLAR);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAboutData = async () => {
    setLoading(true);
    try {
      const res = await getAboutUs({ admin: true });
      if (res) {
        setSettings(res.settings || DEFAULT_ABOUT_SETTINGS);
        setTeam(res.team || DEFAULT_TEAM_MEMBERS);
        setTableNotReady(Boolean(res.tableNotReady));
        setSource(res.source || 'database');
        setHasUnsaved(false);
      }
    } catch (err) {
      showToast('error', 'Failed to load About Us data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAboutData();
    getHeroSlides(false)
      .then((slides) => {
        if (Array.isArray(slides) && slides.length > 0) {
          setGlobalHeroSlide({
            url: slides[0].image_url || slides[0].url,
            title: slides[0].title || 'Kedarkantha Summit Ridge',
            location: slides[0].location || 'Uttarakhand (12,500 ft)'
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (teamModalOpen || pillarModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [teamModalOpen, pillarModalOpen]);

  const handleField = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasUnsaved(true);
  };

  const handleSaveSettings = async (overridePayload = null) => {
    setSavingSettings(true);
    try {
      const res = await updateAboutUsSettings(overridePayload || settings);
      if (res?.data) setSettings(res.data);
      setTableNotReady(Boolean(res?.tableNotReady));
      setSource(res?.source || 'database');
      setHasUnsaved(false);
      showToast('success', res?.message || 'About Us content synced live!');
    } catch (err) {
      showToast('error', err.message || 'Failed to save About Us settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset About Us Hero, Story, Team, and Pillars to TrekToShikhar defaults?')) return;
    setLoading(true);
    try {
      const res = await resetAboutUsData();
      if (res?.settings) setSettings(res.settings);
      if (Array.isArray(res?.team)) setTeam(res.team);
      setHasUnsaved(false);
      showToast('success', 'About Us reset to defaults!');
    } catch (err) {
      showToast('error', err.message || 'Failed to reset About Us');
    } finally {
      setLoading(false);
    }
  };

  // Story Chapters Helpers
  const updateChapter = (idx, field, val) => {
    const next = [...(settings.story_chapters || [])];
    next[idx] = { ...next[idx], [field]: val };
    handleField('story_chapters', next);
  };

  const addChapter = () => {
    const next = [
      ...(settings.story_chapters || []),
      {
        year: `Chapter 0${(settings.story_chapters?.length || 0) + 1}`,
        tag: 'NEW MILESTONE',
        title: 'New Chapter Title',
        desc: 'Describe this chapter of the Trek to Shikhar story...'
      }
    ];
    handleField('story_chapters', next);
  };

  const removeChapter = (idx) => {
    const next = (settings.story_chapters || []).filter((_, i) => i !== idx);
    handleField('story_chapters', next);
  };

  // Custom Hero Slides Helpers
  const addCustomSlide = () => {
    const next = [
      ...(settings.custom_hero_slides || []),
      {
        id: `slide-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=85',
        title: 'Himalayan Ridge',
        location: 'Uttarakhand / Himachal'
      }
    ];
    handleField('custom_hero_slides', next);
  };

  const updateCustomSlide = (idx, field, val) => {
    const next = [...(settings.custom_hero_slides || [])];
    next[idx] = { ...next[idx], [field]: val };
    handleField('custom_hero_slides', next);
  };

  const removeCustomSlide = (idx) => {
    const next = (settings.custom_hero_slides || []).filter((_, i) => i !== idx);
    handleField('custom_hero_slides', next);
  };

  // Team Member CRUD
  const openAddTeamModal = () => {
    setEditingMemberId(null);
    setTeamForm({ ...EMPTY_TEAM_FORM });
    setTeamModalOpen(true);
  };

  const openEditTeamModal = (member) => {
    setEditingMemberId(member.id);
    setTeamForm({
      name: member.name || '',
      role: member.role || '',
      base: member.base || '',
      experience: member.experience || '',
      photo: member.photo || '',
      short_tag: member.short_tag || member.shortTag || '',
      quote: member.quote || '',
      bio: member.bio || '',
      certificationsText: Array.isArray(member.certifications)
        ? member.certifications.join('\n')
        : '',
      favorite_trek: member.favorite_trek || member.favoriteTrek || '',
      specialty: member.specialty || '',
      is_active: member.is_active !== undefined ? Boolean(member.is_active) : member.isActive !== false
    });
    setTeamModalOpen(true);
  };

  const handleSaveTeamMember = async (e) => {
    e.preventDefault();
    if (!teamForm.name.trim() || !teamForm.role.trim()) {
      showToast('error', 'Name and Role are required.');
      return;
    }

    setSavingTeam(true);
    try {
      const payload = {
        name: teamForm.name.trim(),
        role: teamForm.role.trim(),
        base: teamForm.base.trim(),
        experience: teamForm.experience.trim(),
        photo: teamForm.photo.trim(),
        short_tag: teamForm.short_tag.trim(),
        quote: teamForm.quote.trim(),
        bio: teamForm.bio.trim(),
        certifications: teamForm.certificationsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        favorite_trek: teamForm.favorite_trek.trim(),
        specialty: teamForm.specialty.trim(),
        is_active: Boolean(teamForm.is_active)
      };

      if (editingMemberId) {
        await updateTeamMember(editingMemberId, payload);
        showToast('success', `${payload.name} updated live!`);
      } else {
        await createTeamMember({ ...payload, display_order: team.length + 1 });
        showToast('success', `${payload.name} added to Meet The Team!`);
      }
      setTeamModalOpen(false);
      await loadAboutData();
    } catch (err) {
      showToast('error', err.message || 'Failed to save team member');
    } finally {
      setSavingTeam(false);
    }
  };

  const handleToggleTeamActive = async (member) => {
    const active = member.is_active !== undefined ? member.is_active : member.isActive !== false;
    try {
      await updateTeamMember(member.id, { is_active: !active });
      showToast('success', !active ? `${member.name} shown live!` : `${member.name} hidden.`);
      await loadAboutData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleDeleteTeamMember = async (member) => {
    if (!window.confirm(`Remove "${member.name}" from Meet The Team?`)) return;
    try {
      await deleteTeamMember(member.id);
      showToast('success', `Removed ${member.name}`);
      await loadAboutData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleMoveTeamMember = async (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= team.length) return;
    const next = [...team];
    const tmp = next[idx];
    next[idx] = next[target];
    next[target] = tmp;
    setTeam(next);
    try {
      await reorderTeamMembers(next.map((m) => m.id));
      showToast('success', 'Team order synced live!');
    } catch (err) {
      showToast('error', err.message);
      await loadAboutData();
    }
  };

  // Pillar CRUD (stored in settings.pillars)
  const openAddPillarModal = () => {
    setEditingPillarIdx(null);
    setPillarForm({
      ...EMPTY_PILLAR,
      num: String((settings.pillars?.length || 0) + 1).padStart(2, '0')
    });
    setPillarModalOpen(true);
  };

  const openEditPillarModal = (idx) => {
    setEditingPillarIdx(idx);
    setPillarForm({ ...settings.pillars[idx] });
    setPillarModalOpen(true);
  };

  const handleSavePillar = async (e) => {
    e.preventDefault();
    const list = [...(settings.pillars || [])];
    if (editingPillarIdx === null) {
      list.push(pillarForm);
    } else {
      list[editingPillarIdx] = pillarForm;
    }
    const nextSettings = { ...settings, pillars: list };
    setSettings(nextSettings);
    setPillarModalOpen(false);
    await handleSaveSettings(nextSettings);
  };

  const handleDeletePillar = async (idx) => {
    if (!window.confirm('Delete this advantage pillar card?')) return;
    const list = (settings.pillars || []).filter((_, i) => i !== idx);
    const nextSettings = { ...settings, pillars: list };
    setSettings(nextSettings);
    await handleSaveSettings(nextSettings);
  };

  const handleCopySqlPath = () => {
    navigator.clipboard?.writeText('backend/database/about_us.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const subTabs = [
    { id: 'hero-story', label: '1. Hero, Story & CTA', icon: BookOpen },
    { id: 'team', label: `2. Meet The Team (${team.length})`, icon: Users },
    { id: 'pillars', label: `3. Shikhar Pillars (${settings.pillars?.length || 0})`, icon: ShieldCheck },
    { id: 'why-choose', label: '4. Why Choose Counters', icon: Sparkles },
    { id: 'reviews', label: '5. Google Reviews', icon: Star }
  ];

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
          UNIFIED HUB HEADER & MERGED SUB-NAVIGATION TABS
         ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#E5383B] mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Module 3 • Unified About Us, Counters &amp; Reviews Control</span>
            </div>
            <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight">
              About Us &amp; Brand Trust Hub
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">
              Control Hero Intro, Our Story, Meet The Team popups, Shikhar Pillars, Why Choose Counters &amp; Google Reviews all from one command hub.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-bold transition"
            >
              <span>Preview /about</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {['hero-story', 'team', 'pillars'].includes(subTab) && (
              <>
                <button
                  onClick={loadAboutData}
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
                <button
                  onClick={() => handleSaveSettings()}
                  disabled={savingSettings}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer transition ${
                    hasUnsaved
                      ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] ring-2 ring-[#E5383B]/30'
                      : 'bg-neutral-900 hover:bg-[#E5383B]'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingSettings ? 'Saving...' : hasUnsaved ? 'Save Live' : 'Synced'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sleek Merged Sub-Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100">
          {subTabs.map((tab) => {
            const IconComp = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white shadow-md shadow-red-600/25'
                    : 'bg-neutral-100/90 text-neutral-600 hover:bg-neutral-200/80 hover:text-black'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Supabase SQL Hint Banner for About Us tables */}
      {tableNotReady && ['hero-story', 'team', 'pillars'].includes(subTab) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-outfit font-extrabold text-sm text-amber-950">
                Using Local Sync Fallback — About Us Supabase Tables Pending
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                All edits save and sync live right now! For cloud PostgreSQL sync, run{' '}
                <code className="px-1.5 py-0.5 rounded bg-amber-100 font-bold">
                  backend/database/about_us.sql
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
          TAB 1: HERO INTRO, SLIDES, OUR STORY & BOTTOM CTA
         ============================================================ */}
      {subTab === 'hero-story' && (
        <div className="space-y-6">
          {/* LIVE INTERACTIVE PREVIEW PANEL (HERO / OUR STORY / BOTTOM CTA) */}
          {(() => {
            const customFirst = Array.isArray(settings.custom_hero_slides)
              ? settings.custom_hero_slides.find((s) => s && (s.url || s.image_url))
              : null;
            const activePreviewSlide =
              settings.use_global_hero_slides === false && customFirst
                ? {
                    url: customFirst.url || customFirst.image_url,
                    title: customFirst.title || 'Custom About Slide',
                    location: customFirst.location || 'Himalayas'
                  }
                : globalHeroSlide;

            return (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="font-outfit font-black text-sm uppercase tracking-wider text-neutral-800">
                      Live Frontend Preview
                    </h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      Updates as you type
                    </span>
                  </div>

                  {/* Preview Section Switcher Pills */}
                  <div className="inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 gap-1">
                    {[
                      { id: 'hero', label: '1. Hero' },
                      { id: 'story', label: '2. Our Story' },
                      { id: 'cta', label: '3. Bottom CTA' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPreviewPane(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer inline-flex items-center gap-1 ${
                          previewPane === p.id
                            ? 'bg-neutral-950 text-white shadow-xs'
                            : 'text-neutral-600 hover:text-black'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PREVIEW 1: HERO SECTION */}
                {previewPane === 'hero' && (
                  <div className="relative rounded-2xl overflow-hidden bg-neutral-950 text-white border border-neutral-800 shadow-lg">
                    <img
                      src={activePreviewSlide.url}
                      alt={activePreviewSlide.title}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.85) 100%)'
                      }}
                    />

                    <div className="relative z-10 px-5 sm:px-8 pt-8 pb-6 max-w-3xl mx-auto text-center flex flex-col items-center gap-2.5">
                      {settings.hero_badge && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>{settings.hero_badge}</span>
                        </div>
                      )}

                      <h4 className="text-xl sm:text-3xl font-black font-outfit uppercase tracking-wider text-white leading-[1.1] drop-shadow-md">
                        {settings.hero_title_line1}
                        <span className="font-brush normal-case text-2xl sm:text-4xl text-amber-300 block mt-0.5 font-normal">
                          {settings.hero_title_cursive}
                        </span>
                      </h4>

                      <div className="h-[2.5px] w-20 rounded-full bg-gradient-to-r from-transparent via-[#E5383B] to-transparent my-0.5" />

                      <div className="w-full rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 px-4 py-4 sm:px-6 space-y-2.5">
                        <p className="text-white text-xs sm:text-sm leading-relaxed font-medium">
                          {settings.hero_intro_para1}
                        </p>
                        <p className="text-white/85 text-[11px] sm:text-xs leading-relaxed">
                          {settings.hero_intro_para2}
                        </p>

                        {settings.hero_pledge_text && (
                          <div className="pt-1 flex justify-center">
                            <button
                              type="button"
                              className="group relative inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-neutral-950 hover:to-neutral-900 border border-white/25 hover:border-[#FFD700]/70 transition-all duration-300 cursor-pointer overflow-hidden"
                            >
                              <Heart className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700] shrink-0" />
                              <span className="relative h-4 overflow-hidden flex flex-col justify-start">
                                <span className="font-outfit font-black text-xs text-white leading-4 transition-transform duration-300 group-hover:-translate-y-full">
                                  {settings.hero_pledge_text}
                                </span>
                                <span className="font-outfit font-black text-xs text-[#FFD700] leading-4 transition-transform duration-300 group-hover:-translate-y-full inline-flex items-center justify-center gap-1">
                                  <span>{settings.hero_pledge_hover_text || 'Meet Your Mountain Family'}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preview Dark Bottom Bar */}
                    <div className="relative z-10 px-4 py-2.5 bg-neutral-950/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="inline-flex items-center gap-1.5 text-white/90">
                        <MapPin className="w-3 h-3 text-[#E5383B]" />
                        <span className="font-bold">{activePreviewSlide.title}</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-[#FFD700]">{activePreviewSlide.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-6 rounded-full bg-[#FFD700]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                      </div>
                      <span className="text-neutral-300 hidden sm:inline">
                        {settings.use_global_hero_slides !== false ? 'Using Global Module 1 Slides' : 'Using Custom About Slides'}
                      </span>
                    </div>
                  </div>
                )}

                {/* PREVIEW 2: OUR STORY SECTION */}
                {previewPane === 'story' && (
                  <div className="rounded-2xl p-5 sm:p-6 bg-neutral-50/70 border border-neutral-200">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-5 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-neutral-200 aspect-[4/4] max-h-[340px] w-full">
                          <img
                            src={settings.story_image_url || DEFAULT_ABOUT_SETTINGS.story_image_url}
                            alt="Story Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/55 backdrop-blur-md border border-white/15 text-white">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#FFD700] block">
                              {settings.story_caption_tag}
                            </span>
                            <p className="font-outfit font-bold text-xs mt-0.5">
                              {settings.story_caption_title}
                            </p>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 absolute top-3 right-3 px-3.5 py-2 rounded-xl bg-[#E5383B] text-white shadow-lg border border-white/50">
                          <Mountain className="w-4 h-4 shrink-0" />
                          <div>
                            <span className="font-outfit font-black text-xs leading-none block">
                              {settings.story_batch_title}
                            </span>
                            <span className="text-[9px] font-bold uppercase text-white/90">
                              {settings.story_batch_subtitle}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#E5383B] uppercase tracking-widest">
                          <Compass className="w-3.5 h-3.5" />
                          <span>{settings.story_badge}</span>
                        </div>
                        <h4 className="font-outfit font-black text-xl sm:text-2xl text-[#0A0A0A] leading-tight">
                          {settings.story_heading}{' '}
                          <span className="text-[#E5383B]">{settings.story_highlight_word}</span>
                        </h4>
                        <p className="text-neutral-600 text-xs leading-relaxed">
                          {settings.story_subtitle}
                        </p>

                        <div className="space-y-2.5 pt-1">
                          {(settings.story_chapters || []).map((ch, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded-full bg-[#E5383B] text-white text-[9px] font-black uppercase">
                                  {ch.year}
                                </span>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                                  {ch.tag}
                                </span>
                              </div>
                              <div className="font-outfit font-black text-sm text-[#0A0A0A]">{ch.title}</div>
                              <p className="text-[11px] text-neutral-600 mt-0.5 line-clamp-2">{ch.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PREVIEW 3: BOTTOM DARK CTA SECTION */}
                {previewPane === 'cta' && (
                  <div className="relative overflow-hidden rounded-2xl p-6 sm:p-10 bg-neutral-900 text-white border border-neutral-800">
                    <div
                      className="absolute inset-0 pointer-events-none opacity-45"
                      style={{
                        background:
                          'radial-gradient(ellipse at 50% 0%, rgba(229,56,59,0.3) 0%, rgba(255,215,0,0.06) 45%, transparent 72%)'
                      }}
                    />
                    <div className="max-w-2xl mx-auto rounded-2xl p-6 sm:p-8 bg-neutral-950/90 border border-neutral-800 text-center space-y-4 relative z-10">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-[#FFD700]/30 text-[10px] font-black uppercase tracking-widest text-[#FFD700]">
                        <Heart className="w-3 h-3 text-[#E5383B] fill-[#E5383B]" />
                        <span>{settings.cta_badge}</span>
                      </span>

                      <h4 className="font-outfit font-black text-2xl sm:text-3xl text-white leading-tight">
                        {settings.cta_heading}
                      </h4>

                      <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                        {settings.cta_subtitle}
                      </p>

                      <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          className="group px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-white hover:to-white text-white font-black text-xs uppercase tracking-wider cursor-pointer inline-flex items-center gap-2 transition-all overflow-hidden"
                        >
                          <span className="relative h-4 overflow-hidden flex flex-col justify-start">
                            <span className="leading-4 transition-transform duration-300 group-hover:-translate-y-full">
                              {settings.cta_primary_text}
                            </span>
                            <span className="leading-4 text-[#E5383B] transition-transform duration-300 group-hover:-translate-y-full">
                              {settings.cta_primary_hover_text}
                            </span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:text-[#E5383B]" />
                        </button>

                        <button
                          type="button"
                          className="group px-6 py-3 rounded-xl bg-white/10 hover:bg-[#FFD700] text-white hover:text-[#0A0A0A] border border-white/20 font-bold text-xs cursor-pointer inline-flex items-center gap-2 transition-all overflow-hidden"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="relative h-4 overflow-hidden flex flex-col justify-start">
                            <span className="leading-4 transition-transform duration-300 group-hover:-translate-y-full">
                              {settings.cta_secondary_text}
                            </span>
                            <span className="leading-4 font-black text-[#0A0A0A] transition-transform duration-300 group-hover:-translate-y-full">
                              {settings.cta_secondary_hover_text}
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 1A. Hero Intro Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
                  1. Hero Manifesto &amp; Sliding Images
                </h3>
                <p className="text-xs text-neutral-500">
                  Control the top About Us Hero text, hover-swap pledge button, and background slide deck ({source === 'database' ? 'Supabase' : 'Live Sync'}).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={settings.hero_badge || ''}
                  onChange={(e) => handleField('hero_badge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Headline Line 1 (White Bold)
                </label>
                <input
                  type="text"
                  value={settings.hero_title_line1 || ''}
                  onChange={(e) => handleField('hero_title_line1', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Cursive Tagline (Golden Brush Script)
                </label>
                <input
                  type="text"
                  value={settings.hero_title_cursive || ''}
                  onChange={(e) => handleField('hero_title_cursive', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Intro Paragraph 1
                </label>
                <textarea
                  rows={2}
                  value={settings.hero_intro_para1 || ''}
                  onChange={(e) => handleField('hero_intro_para1', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Intro Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={settings.hero_intro_para2 || ''}
                  onChange={(e) => handleField('hero_intro_para2', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Hero Button Default Text
                </label>
                <input
                  type="text"
                  value={settings.hero_pledge_text || ''}
                  onChange={(e) => handleField('hero_pledge_text', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Hero Button Hover Text (Mouse Hover Swap)
                </label>
                <input
                  type="text"
                  value={settings.hero_pledge_hover_text || ''}
                  onChange={(e) => handleField('hero_pledge_hover_text', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
            </div>

            {/* Hero Slide Source Switch */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <span className="text-xs font-black text-[#0A0A0A] block">
                    Use Homepage Global Hero Slides (Module 1)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Turn OFF if you want to upload separate custom background slides exclusively for the About Us page.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.use_global_hero_slides !== false}
                  onChange={(e) => handleField('use_global_hero_slides', e.target.checked)}
                  className="w-5 h-5 accent-[#E5383B] cursor-pointer"
                />
              </label>

              {settings.use_global_hero_slides === false && (
                <div className="space-y-3 pt-3 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-neutral-700">
                      Custom About Us Hero Slides ({settings.custom_hero_slides?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={addCustomSlide}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E5383B] text-white text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Slide
                    </button>
                  </div>
                  {(settings.custom_hero_slides || []).map((s, idx) => (
                    <div key={s.id || idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-xl bg-white border border-neutral-200">
                      <input
                        type="text"
                        placeholder="Image URL (Cloudinary / Unsplash)"
                        value={s.url || ''}
                        onChange={(e) => updateCustomSlide(idx, 'url', e.target.value)}
                        className="sm:col-span-6 px-3 py-2 rounded-lg border border-neutral-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Trail Title"
                        value={s.title || ''}
                        onChange={(e) => updateCustomSlide(idx, 'title', e.target.value)}
                        className="sm:col-span-3 px-3 py-2 rounded-lg border border-neutral-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={s.location || ''}
                        onChange={(e) => updateCustomSlide(idx, 'location', e.target.value)}
                        className="sm:col-span-2 px-3 py-2 rounded-lg border border-neutral-200 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomSlide(idx)}
                        className="sm:col-span-1 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 1B. Our Story Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs space-y-5">
            <div className="pb-3 border-b border-neutral-100">
              <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
                2. Our Story &amp; Chapters
              </h3>
              <p className="text-xs text-neutral-500">
                Customize the left story photo, floating badges, and editorial story chapters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Story Heading Prefix
                </label>
                <input
                  type="text"
                  value={settings.story_heading || ''}
                  onChange={(e) => handleField('story_heading', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Highlighted Word (Crimson)
                </label>
                <input
                  type="text"
                  value={settings.story_highlight_word || ''}
                  onChange={(e) => handleField('story_highlight_word', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-[#E5383B] focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Story Intro Subtitle
                </label>
                <textarea
                  rows={2}
                  value={settings.story_subtitle || ''}
                  onChange={(e) => handleField('story_subtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                    Story Feature Photo URL (Cloudinary / HTTPS)
                  </label>
                  <input
                    type="text"
                    value={settings.story_image_url || ''}
                    onChange={(e) => handleField('story_image_url', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:border-[#E5383B]"
                  />
                </div>
                {settings.story_image_url && (
                  <img
                    src={settings.story_image_url}
                    alt="Story preview"
                    className="w-20 h-20 rounded-2xl object-cover border border-neutral-200 shrink-0"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Floating Batch Stat Title
                </label>
                <input
                  type="text"
                  value={settings.story_batch_title || ''}
                  onChange={(e) => handleField('story_batch_title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                  Floating Batch Subtitle
                </label>
                <input
                  type="text"
                  value={settings.story_batch_subtitle || ''}
                  onChange={(e) => handleField('story_batch_subtitle', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B]"
                />
              </div>
            </div>

            {/* Chapters Editor */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500">
                  Story Chapters ({settings.story_chapters?.length || 0})
                </h4>
                <button
                  type="button"
                  onClick={addChapter}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Chapter
                </button>
              </div>
              {(settings.story_chapters || []).map((ch, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ch.year || ''}
                      onChange={(e) => updateChapter(idx, 'year', e.target.value)}
                      placeholder="Chapter 01"
                      className="w-28 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-black text-[#E5383B]"
                    />
                    <input
                      type="text"
                      value={ch.tag || ''}
                      onChange={(e) => updateChapter(idx, 'tag', e.target.value)}
                      placeholder="THE SPARK"
                      className="w-36 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold uppercase"
                    />
                    <input
                      type="text"
                      value={ch.title || ''}
                      onChange={(e) => updateChapter(idx, 'title', e.target.value)}
                      placeholder="Chapter Title"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => removeChapter(idx)}
                      className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={ch.desc || ''}
                    onChange={(e) => updateChapter(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 1C. Bottom Dark CTA Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-neutral-100">
              <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
                3. Bottom Dark CTA Banner &amp; Hover Button Texts
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">CTA Badge</label>
                <input
                  type="text"
                  value={settings.cta_badge || ''}
                  onChange={(e) => handleField('cta_badge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">CTA Heading</label>
                <input
                  type="text"
                  value={settings.cta_heading || ''}
                  onChange={(e) => handleField('cta_heading', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">CTA Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.cta_subtitle || ''}
                  onChange={(e) => handleField('cta_subtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Primary Button Text</label>
                <input
                  type="text"
                  value={settings.cta_primary_text || ''}
                  onChange={(e) => handleField('cta_primary_text', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Primary Button Hover Text</label>
                <input
                  type="text"
                  value={settings.cta_primary_hover_text || ''}
                  onChange={(e) => handleField('cta_primary_hover_text', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Secondary Button Text</label>
                <input
                  type="text"
                  value={settings.cta_secondary_text || ''}
                  onChange={(e) => handleField('cta_secondary_text', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 mb-1">Secondary Button Hover Text</label>
                <input
                  type="text"
                  value={settings.cta_secondary_hover_text || ''}
                  onChange={(e) => handleField('cta_secondary_hover_text', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold focus:outline-none focus:border-[#E5383B]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: MEET THE TEAM MANAGER (CRUD + POPUP PROFILES)
         ============================================================ */}
      {subTab === 'team' && (
        <div className="space-y-6">
          {/* Team Section Heading */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-neutral-700 mb-1">Team Eyebrow Pill</label>
              <input
                type="text"
                value={settings.team_badge || ''}
                onChange={(e) => handleField('team_badge', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#E5383B]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-neutral-700 mb-1">Section Title</label>
              <input
                type="text"
                value={settings.team_heading || ''}
                onChange={(e) => handleField('team_heading', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold focus:outline-none focus:border-[#E5383B]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-neutral-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={settings.team_subtitle || ''}
                onChange={(e) => handleField('team_subtitle', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#E5383B]"
              />
            </div>
          </div>

          {/* Team Cards Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
                  Team Members ({team.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Clicking any photo on `/about` opens their full interactive popup profile with quote, bio &amp; certifications.
                </p>
              </div>
              <button
                onClick={openAddTeamModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {team.map((member, idx) => {
                const active = member.is_active !== undefined ? member.is_active : member.isActive !== false;
                return (
                  <div
                    key={member.id || idx}
                    className={`rounded-2xl overflow-hidden border flex flex-col justify-between transition ${
                      active ? 'bg-white border-neutral-200 shadow-2xs' : 'bg-neutral-100 border-dashed border-neutral-300 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="relative h-48 bg-neutral-900">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 text-[#FFD700] text-[10px] font-bold">
                          #{idx + 1} • {member.experience}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-outfit font-black text-base text-[#0A0A0A] leading-tight">
                          {member.name}
                        </h4>
                        <p className="text-xs font-bold text-[#E5383B] mt-0.5">{member.role}</p>
                        <p className="text-[11px] text-neutral-500 mt-2 line-clamp-2">
                          {member.bio}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveTeamMember(idx, -1)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-35 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveTeamMember(idx, 1)}
                          disabled={idx === team.length - 1}
                          className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-35 cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleTeamActive(member)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border cursor-pointer ${
                            active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                          }`}
                        >
                          {active ? 'Live' : 'Hidden'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditTeamModal(member)}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member)}
                          className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
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
        </div>
      )}

      {/* ============================================================
          TAB 3: SHIKHARITE PILLARS ("WHY CHOOSE TREKTOSHIKHAR ADVENTURE")
         ============================================================ */}
      {subTab === 'pillars' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-neutral-700 mb-1">Heading Prefix</label>
              <input
                type="text"
                value={settings.pillars_heading_prefix || ''}
                onChange={(e) => handleField('pillars_heading_prefix', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-neutral-700 mb-1">Brand Highlight (Red)</label>
              <input
                type="text"
                value={settings.pillars_heading_brand || ''}
                onChange={(e) => handleField('pillars_heading_brand', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-black text-[#E5383B]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-neutral-700 mb-1">Heading Suffix</label>
              <input
                type="text"
                value={settings.pillars_heading_suffix || ''}
                onChange={(e) => handleField('pillars_heading_suffix', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-extrabold text-neutral-700 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={settings.pillars_subtitle || ''}
                onChange={(e) => handleField('pillars_subtitle', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
                Advantage Pillar Cards ({settings.pillars?.length || 0})
              </h3>
              <button
                onClick={openAddPillarModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Pillar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(settings.pillars || []).map((p, idx) => {
                const Ico = PILLAR_ICON_MAP[p.icon] || ShieldCheck;
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E5383B] flex items-center justify-center">
                          <Ico className="w-5 h-5" />
                        </div>
                        <span className="font-outfit font-black text-xl text-neutral-300">{p.num}</span>
                      </div>
                      <h4 className="font-outfit font-black text-base text-[#0A0A0A]">{p.title}</h4>
                      <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">{p.desc}</p>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-neutral-200/70">
                      <button
                        onClick={() => openEditPillarModal(idx)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeletePillar(idx)}
                        className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4: MERGED WHY CHOOSE ANIMATED COUNTERS (EXISTING UNTOUCHED MODULE)
         ============================================================ */}
      {subTab === 'why-choose' && <WhyChooseModule />}

      {/* ============================================================
          TAB 5: MERGED GOOGLE REVIEWS MANAGER (EXISTING UNTOUCHED MODULE)
         ============================================================ */}
      {subTab === 'reviews' && <ReviewsModule />}

      {/* ============================================================
          ADD / EDIT TEAM MEMBER PORTAL MODAL
         ============================================================ */}
      {teamModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-2xl h-[88vh] max-h-[680px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200">
              <div className="px-6 py-4 bg-neutral-950 text-white flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E5383B]">
                    Meet The Team Customizer
                  </span>
                  <h3 className="font-outfit font-black text-lg">
                    {editingMemberId ? `Edit: ${teamForm.name}` : 'Add New Team Member'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setTeamModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form id="team-member-form" onSubmit={handleSaveTeamMember} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={teamForm.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover object-top border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                      Portrait Photo URL (Cloudinary / HTTPS) *
                    </label>
                    <input
                      type="text"
                      required
                      value={teamForm.photo}
                      onChange={(e) => setTeamForm({ ...teamForm, photo: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      placeholder="e.g. Vinay Pathak"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Role / Designation *</label>
                    <input
                      type="text"
                      required
                      value={teamForm.role}
                      onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                      placeholder="Founder & Lead Expedition Director"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Experience Pill</label>
                    <input
                      type="text"
                      value={teamForm.experience}
                      onChange={(e) => setTeamForm({ ...teamForm, experience: e.target.value })}
                      placeholder="10+ Years in Himalayas"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Mountain Base Hub</label>
                    <input
                      type="text"
                      value={teamForm.base}
                      onChange={(e) => setTeamForm({ ...teamForm, base: e.target.value })}
                      placeholder="Dehradun & Shimla Base"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Card Footer Short Tag</label>
                    <input
                      type="text"
                      value={teamForm.short_tag}
                      onChange={(e) => setTeamForm({ ...teamForm, short_tag: e.target.value })}
                      placeholder="NIM Certified • 180+ Summits"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#E5383B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-1">Personal Mountain Quote</label>
                  <input
                    type="text"
                    value={teamForm.quote}
                    onChange={(e) => setTeamForm({ ...teamForm, quote: e.target.value })}
                    placeholder="A summit lasts ten minutes, but the warmth stays forever..."
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs italic focus:outline-none focus:border-[#E5383B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-1">Full Popup Bio *</label>
                  <textarea
                    rows={3}
                    required
                    value={teamForm.bio}
                    onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs leading-relaxed focus:outline-none focus:border-[#E5383B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-1">
                    Certifications (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={teamForm.certificationsText}
                    onChange={(e) => setTeamForm({ ...teamForm, certificationsText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs leading-relaxed focus:outline-none focus:border-[#E5383B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Favorite Trail</label>
                    <input
                      type="text"
                      value={teamForm.favorite_trek}
                      onChange={(e) => setTeamForm({ ...teamForm, favorite_trek: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Core Specialty</label>
                    <input
                      type="text"
                      value={teamForm.specialty}
                      onChange={(e) => setTeamForm({ ...teamForm, specialty: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs"
                    />
                  </div>
                </div>
              </form>

              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setTeamModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="team-member-form"
                  disabled={savingTeam}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
                >
                  {savingTeam ? 'Saving...' : editingMemberId ? 'Update Member Live' : 'Publish Member Live'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ============================================================
          ADD / EDIT PILLAR CARD PORTAL MODAL
         ============================================================ */}
      {pillarModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-lg h-[82vh] max-h-[580px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200">
              <div className="px-6 py-4 bg-neutral-950 text-white flex items-center justify-between shrink-0">
                <h3 className="font-outfit font-black text-lg">
                  {editingPillarIdx === null ? 'Add Advantage Pillar' : `Edit Pillar ${pillarForm.num}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setPillarModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form id="pillar-form" onSubmit={handleSavePillar} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Number</label>
                    <input
                      type="text"
                      value={pillarForm.num}
                      onChange={(e) => setPillarForm({ ...pillarForm, num: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm font-black text-center"
                    />
                  </div>
                  <div className="col-span-9">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-1">Pillar Title *</label>
                    <input
                      type="text"
                      required
                      value={pillarForm.title}
                      onChange={(e) => setPillarForm({ ...pillarForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={pillarForm.desc}
                    onChange={(e) => setPillarForm({ ...pillarForm, desc: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 mb-2">Icon ({pillarForm.icon})</label>
                  <div className="grid grid-cols-7 gap-2">
                    {PILLAR_ICON_OPTIONS.map((name) => {
                      const Ico = PILLAR_ICON_MAP[name];
                      const sel = pillarForm.icon === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setPillarForm({ ...pillarForm, icon: name })}
                          className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition ${
                            sel
                              ? 'bg-[#E5383B] text-white border-[#E5383B]'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-[#E5383B]'
                          }`}
                        >
                          <Ico className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </form>

              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setPillarModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="pillar-form"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase cursor-pointer"
                >
                  Save Pillar Live
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
