import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
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
  ExternalLink,
  Layers,
  MapPin,
  Sparkles,
  Clock,
  Eye,
  Tag,
  Mountain,
  Users,
  Compass,
  X,
  Flame,
  Check,
  ChevronRight,
  Lightbulb,
  ShieldAlert,
  Quote,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Bookmark
} from 'lucide-react';
import {
  BLOG_CATEGORIES,
  DEFAULT_BLOG_SETTINGS,
  getAdminBlogData,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogStatus,
  toggleBlogFeatured,
  updateBlogSettings,
  resetBlogsToDefault
} from '../lib/blogApi';
import { TREKS } from '../data/treksData';

const EMPTY_POST_FORM = {
  title: '',
  slug: '',
  subtitle: '',
  excerpt: '',
  category: 'Beginner Guides',
  tagsString: 'Himalayas, First Trek, Packing',
  cover_image:
    'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=85',
  read_time: '5 min read',
  read_minutes: 5,
  published_at: 'Nov 2026',
  season_tag: 'All Seasons',
  difficulty_tag: 'Essential Reading',
  views: '1.2k',
  featured: false,
  featured_on_home: false,
  related_trek_slug: 'nag-tibba-weekend-trek',
  related_trek_name: 'Nag Tibba Weekend Trek',
  author: {
    name: 'Vikram Rawat',
    role: 'Chief Expedition Leader (NIM Uttarkashi)',
    base: 'Dehradun Base Camp',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Over 11 years leading high-altitude expeditions across Garhwal and Himachal. Passionate about turning nervous first-timers into lifelong Shikharites.'
  },
  key_takeaways: [
    'Always break in your trekking shoes 2 weeks before departure.',
    'Start with moisture-wicking synthetic base layers instead of cotton.',
    'Drink 3.5 liters of water daily to prevent altitude sickness.'
  ],
  sections: [
    {
      id: 'section-1',
      heading: '1. The Golden Rule of Trail Pacing',
      paragraphsText:
        'Walking in the mountains is a rhythm, not a sprint. Maintain a steady cadence where you can comfortably speak without gasping for breath.\n\nCold mountain air suppresses your thirst reflex even while dry high-altitude air dehydrates you twice as fast. Take small sips every 20 minutes rather than gulping a liter at rest stops.',
      hasTip: true,
      tipBox: {
        type: 'tip',
        title: 'Shikhar Leader Rule: Start Slightly Cool',
        text: 'If you feel warm standing still at the trailhead, you are overdressed. You should feel slightly chilly for the first 10 minutes — your body warms up fast once the climb begins.'
      },
      hasQuote: false,
      quote: {
        text: 'The mountains do not reward the fastest climber; they reward the climber who respects their breath.',
        author: 'Vikram Rawat, TrekToShikhar Lead'
      },
      hasImage: false,
      image: {
        url: '',
        caption: ''
      }
    }
  ],
  is_published: true
};

export default function BlogsModule() {
  const [subTab, setSubTab] = useState('journals'); // 'journals' | 'hero-settings'

  const [settings, setSettings] = useState(DEFAULT_BLOG_SETTINGS);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [hasUnsavedSettings, setHasUnsavedSettings] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'published' | 'draft'

  // Post Modal (Add / Edit / Preview)
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('editor'); // 'editor' | 'preview'
  const [editingPostId, setEditingPostId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_POST_FORM);

  // Delete Confirm Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load Admin Blogs Data on Mount
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAdminBlogData();
      if (res) {
        if (res.settings) setSettings(res.settings);
        if (Array.isArray(res.posts)) setPosts(res.posts);
      }
    } catch (e) {
      showToast('Error loading blogs: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Posts for Admin View
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return posts.filter((p) => {
      const matchesSearch =
        !q ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.slug || '').toLowerCase().includes(q) ||
        (p.author?.name || '').toLowerCase().includes(q) ||
        (p.relatedTrekName || '').toLowerCase().includes(q);

      const matchesCat = filterCategory === 'all' || p.category === filterCategory;

      const isPub = p.isPublished !== false && p.is_published !== false;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'published' && isPub) ||
        (filterStatus === 'draft' && !isPub);

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [posts, searchQuery, filterCategory, filterStatus]);

  // Status Summary Stats
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.isPublished !== false && p.is_published !== false).length;
    const drafts = total - published;
    const spotlight = posts.find((p) => p.featured);
    const homeFeatured = posts.filter((p) => p.featuredOnHome || p.featured_on_home).length;
    return { total, published, drafts, spotlight, homeFeatured };
  }, [posts]);

  // Transform post object into edit form data
  const postToFormData = (post) => {
    const sections = Array.isArray(post.sections)
      ? post.sections.map((sec, idx) => ({
          id: sec.id || `section-${idx + 1}`,
          heading: sec.heading || '',
          paragraphsText: Array.isArray(sec.paragraphs)
            ? sec.paragraphs.join('\n\n')
            : sec.paragraphs || '',
          hasTip: Boolean(sec.tipBox && sec.tipBox.title),
          tipBox: sec.tipBox || {
            type: 'tip',
            title: '',
            text: ''
          },
          hasQuote: Boolean(sec.quote && sec.quote.text),
          quote: sec.quote || {
            text: '',
            author: post.author?.name || 'TrekToShikhar Lead'
          },
          hasImage: Boolean(sec.image && sec.image.url),
          image: sec.image || {
            url: '',
            caption: ''
          }
        }))
      : [];

    const key_takeaways = Array.isArray(post.keyTakeaways)
      ? [...post.keyTakeaways]
      : Array.isArray(post.key_takeaways)
        ? [...post.key_takeaways]
        : [];

    return {
      title: post.title || '',
      slug: post.slug || '',
      subtitle: post.subtitle || '',
      excerpt: post.excerpt || '',
      category: post.category || 'Beginner Guides',
      tagsString: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      cover_image: post.coverImage || post.cover_image || '',
      read_time: post.readTime || post.read_time || '5 min read',
      read_minutes: post.readMinutes || post.read_minutes || 5,
      published_at: post.publishedAt || post.published_at || 'Nov 2026',
      season_tag: post.seasonTag || post.season_tag || 'All Seasons',
      difficulty_tag: post.difficultyTag || post.difficulty_tag || 'Essential Reading',
      views: post.views || '1.2k',
      featured: Boolean(post.featured),
      featured_on_home: Boolean(post.featuredOnHome ?? post.featured_on_home),
      related_trek_slug: post.relatedTrekSlug || post.related_trek_slug || '',
      related_trek_name: post.relatedTrekName || post.related_trek_name || '',
      author: {
        name: post.author?.name || 'Vikram Rawat',
        role: post.author?.role || 'Chief Expedition Leader (NIM Uttarkashi)',
        base: post.author?.base || 'Dehradun Base Camp',
        avatar: post.author?.avatar || '',
        bio: post.author?.bio || ''
      },
      key_takeaways,
      sections,
      is_published: post.isPublished !== false && post.is_published !== false
    };
  };

  // Open Modal to Add
  const handleOpenAddModal = () => {
    setEditingPostId(null);
    setFormData(EMPTY_POST_FORM);
    setModalTab('editor');
    setPostModalOpen(true);
  };

  // Open Modal to Edit
  const handleOpenEditModal = (post) => {
    setEditingPostId(post.id);
    setFormData(postToFormData(post));
    setModalTab('editor');
    setPostModalOpen(true);
  };

  // Open Quick Live Preview for a Post
  const handleOpenPreviewModal = (post) => {
    setEditingPostId(post.id);
    setFormData(postToFormData(post));
    setModalTab('preview');
    setPostModalOpen(true);
  };

  // Save Post (Create / Update)
  const handleSavePost = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Article title is required', 'error');
      setModalTab('editor');
      return;
    }

    setSavingPost(true);
    try {
      const tags = formData.tagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      // Clean sections for payload
      const cleanedSections = formData.sections.map((sec, idx) => ({
        id: sec.id || `section-${idx + 1}`,
        heading: sec.heading.trim(),
        paragraphs: (sec.paragraphsText || '')
          .split('\n\n')
          .map((p) => p.trim())
          .filter(Boolean),
        ...(sec.hasTip && sec.tipBox?.title?.trim()
          ? {
              tipBox: {
                type: sec.tipBox.type || 'tip',
                title: sec.tipBox.title.trim(),
                text: sec.tipBox.text?.trim() || ''
              }
            }
          : {}),
        ...(sec.hasQuote && sec.quote?.text?.trim()
          ? {
              quote: {
                text: sec.quote.text.trim(),
                author: sec.quote.author?.trim() || 'Trek Leader'
              }
            }
          : {}),
        ...(sec.hasImage && sec.image?.url?.trim()
          ? {
              image: {
                url: sec.image.url.trim(),
                caption: sec.image.caption?.trim() || ''
              }
            }
          : {})
      }));

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        subtitle: formData.subtitle.trim(),
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        tags,
        cover_image: formData.cover_image.trim(),
        read_time: formData.read_time,
        read_minutes: Number(formData.read_minutes) || 5,
        published_at: formData.published_at,
        season_tag: formData.season_tag,
        difficulty_tag: formData.difficulty_tag,
        views: formData.views,
        featured: formData.featured,
        featured_on_home: formData.featured_on_home,
        related_trek_slug: formData.related_trek_slug,
        related_trek_name: formData.related_trek_name,
        author: formData.author,
        key_takeaways: formData.key_takeaways.map((t) => t.trim()).filter(Boolean),
        sections: cleanedSections,
        is_published: formData.is_published
      };

      if (editingPostId) {
        await updateBlogPost(editingPostId, payload);
        showToast('Trail journal updated successfully!');
      } else {
        await createBlogPost(payload);
        showToast('New trail journal published successfully!');
      }

      setPostModalOpen(false);
      await loadData();
    } catch (err) {
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      setSavingPost(false);
    }
  };

  // 1-Click Status Toggle (Publish / Draft)
  const handleToggleStatus = async (post) => {
    const current = post.isPublished !== false && post.is_published !== false;
    const next = !current;
    try {
      await toggleBlogStatus(post.id, next);
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, isPublished: next, is_published: next } : p))
      );
      showToast(`Journal moved to ${next ? 'Published' : 'Draft'}`);
    } catch (err) {
      showToast('Toggle failed: ' + err.message, 'error');
    }
  };

  // 1-Click Spotlight Feature Toggle
  const handleToggleSpotlight = async (post) => {
    const next = !post.featured;
    try {
      await toggleBlogFeatured(post.id, { featured: next });
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === post.id) return { ...p, featured: next };
          if (next) return { ...p, featured: false };
          return p;
        })
      );
      showToast(next ? 'Set as Editor’s Spotlight!' : 'Removed from Spotlight');
    } catch (err) {
      showToast('Toggle failed: ' + err.message, 'error');
    }
  };

  // 1-Click Homepage Pin Toggle
  const handleToggleHomeFeatured = async (post) => {
    const current = Boolean(post.featuredOnHome ?? post.featured_on_home);
    const next = !current;
    try {
      await toggleBlogFeatured(post.id, { featured_on_home: next });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, featuredOnHome: next, featured_on_home: next } : p
        )
      );
      showToast(next ? 'Pinned to Homepage #blog section!' : 'Removed from Homepage');
    } catch (err) {
      showToast('Toggle failed: ' + err.message, 'error');
    }
  };

  // Delete Post
  const handleDeletePost = async (id) => {
    try {
      await deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      showToast('Trail journal deleted');
    } catch (err) {
      showToast('Delete failed: ' + err.message, 'error');
    }
  };

  // Save Hero & Page Settings
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await updateBlogSettings(settings);
      setHasUnsavedSettings(false);
      showToast('Blog hero settings saved & synced with live site!');
    } catch (err) {
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all blogs and hero settings to default Shikharite guides?')) return;
    try {
      await resetBlogsToDefault();
      await loadData();
      showToast('Reset completed successfully');
    } catch (err) {
      showToast('Reset failed: ' + err.message, 'error');
    }
  };

  // Sections Form Actions
  const handleAddSection = () => {
    const nextIdx = formData.sections.length + 1;
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          id: `section-${Date.now()}`,
          heading: `${nextIdx}. New Trail Topic Heading`,
          paragraphsText: 'Write your detailed story and mountain advice here...',
          hasTip: false,
          tipBox: { type: 'tip', title: '', text: '' },
          hasQuote: false,
          quote: { text: '', author: formData.author.name || 'Trek Leader' },
          hasImage: false,
          image: { url: '', caption: '' }
        }
      ]
    });
  };

  const handleRemoveSection = (idx) => {
    const next = formData.sections.filter((_, i) => i !== idx);
    setFormData({ ...formData, sections: next });
  };

  const handleUpdateSection = (idx, field, value) => {
    const next = [...formData.sections];
    next[idx] = { ...next[idx], [field]: value };
    setFormData({ ...formData, sections: next });
  };

  // Key Takeaways Actions
  const handleAddTakeaway = () => {
    setFormData({
      ...formData,
      key_takeaways: [...formData.key_takeaways, '']
    });
  };

  const handleUpdateTakeaway = (idx, value) => {
    const next = [...formData.key_takeaways];
    next[idx] = value;
    setFormData({ ...formData, key_takeaways: next });
  };

  const handleRemoveTakeaway = (idx) => {
    setFormData({
      ...formData,
      key_takeaways: formData.key_takeaways.filter((_, i) => i !== idx)
    });
  };

  // Find linked trek for preview
  const previewTrek = useMemo(() => {
    return TREKS.find((t) => t.slug === formData.related_trek_slug) || null;
  }, [formData.related_trek_slug]);

  return (
    <div className="space-y-6 animate-editorial-fade pb-16">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-white transition-all transform animate-bounce-once ${
            toast.type === 'error' ? 'bg-[#E5383B]' : 'bg-emerald-600'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Himalayan Trail Journals &amp; Field CMS</span>
          </div>
          <h2 className="text-2xl font-black font-outfit text-[#0A0A0A]">
            Field Guides &amp; Blog Hub
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage leader dispatches, packing guides, winter advice, and 100vh hero slides synced in real time with <strong>/blog</strong>, <strong>/blog/:slug</strong>, and <strong>Homepage #blog</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 text-xs font-bold transition-all cursor-pointer"
          >
            <span>Live /blog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-neutral-200 hover:border-[#E5383B] text-neutral-700 hover:text-[#E5383B] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-neutral-200 hover:border-rose-400 text-neutral-600 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-200/90 pb-2">
        <button
          type="button"
          onClick={() => setSubTab('journals')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'journals'
              ? 'bg-neutral-950 text-[#FFD700] shadow-md ring-2 ring-[#E5383B]/30'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:text-[#0A0A0A]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#E5383B]" />
          <span>Trail Journals Manager ({posts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('hero-settings')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'hero-settings'
              ? 'bg-neutral-950 text-[#FFD700] shadow-md ring-2 ring-[#E5383B]/30'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:text-[#0A0A0A]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#FFD700]" />
          <span>Hero Slider &amp; Copy</span>
          {hasUnsavedSettings && (
            <span className="w-2 h-2 rounded-full bg-[#E5383B] animate-pulse" />
          )}
        </button>
      </div>

      {/* ====================================================================
          SUB-TAB 1: TRAIL JOURNALS MANAGER
         ==================================================================== */}
      {subTab === 'journals' && (
        <div className="space-y-6">
          {/* Top 4 Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                Total Journals
              </span>
              <p className="font-outfit font-black text-2xl text-[#0A0A0A] mt-0.5">
                {stats.total}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                Published Live
              </span>
              <p className="font-outfit font-black text-2xl text-emerald-600 mt-0.5">
                {stats.published}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                Editor Spotlight
              </span>
              <p className="font-outfit font-black text-xs text-neutral-700 mt-1 truncate">
                {stats.spotlight ? stats.spotlight.title : 'None set'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E5383B] block">
                Pinned On Home #blog
              </span>
              <p className="font-outfit font-black text-2xl text-[#E5383B] mt-0.5">
                {stats.homeFeatured} / 3
              </p>
            </div>
          </div>

          {/* Action Bar: Search, Category, Status & Add CTA */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            <div className="flex-1 flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title, author, trek..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 border border-neutral-200 focus:border-[#E5383B] outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-neutral-50 border border-neutral-200 outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {BLOG_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-neutral-50 border border-neutral-200 outline-none cursor-pointer"
              >
                <option value="all">All Status ({stats.total})</option>
                <option value="published">Published Only ({stats.published})</option>
                <option value="draft">Drafts Only ({stats.drafts})</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-neutral-950 hover:to-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Journal</span>
            </button>
          </div>

          {/* Journals Grid / List */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post) => {
                const isPublished = post.isPublished !== false && post.is_published !== false;
                const isSpotlight = Boolean(post.featured);
                const isHomeFeatured = Boolean(post.featuredOnHome ?? post.featured_on_home);

                return (
                  <div
                    key={post.id}
                    className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                      isSpotlight
                        ? 'border-[#FFD700] ring-2 ring-[#FFD700]/30'
                        : isPublished
                          ? 'border-neutral-200'
                          : 'border-neutral-300 opacity-75'
                    }`}
                  >
                    <div>
                      {/* Image Thumbnail with Overlay Badges */}
                      <div className="relative h-44 bg-neutral-900 overflow-hidden">
                        <img
                          src={post.coverImage || post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E5383B] text-white text-[10px] font-black uppercase">
                            {post.category}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {isSpotlight && (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFD700] text-[#0A0A0A] text-[10px] font-black uppercase flex items-center gap-1 shadow-sm">
                                <Flame className="w-3 h-3 fill-current" />
                                <span>Spotlight</span>
                              </span>
                            )}
                            {isHomeFeatured && (
                              <span className="px-2 py-0.5 rounded-full bg-white text-[#0A0A0A] text-[10px] font-black uppercase flex items-center gap-1 shadow-sm">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                <span>Home #blog</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Overlay: Read Time & Status */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white">
                          <span className="font-bold text-[#FFD700] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime || post.read_time}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isPublished ? 'bg-emerald-500/90 text-white' : 'bg-neutral-600/90 text-white'
                            }`}
                          >
                            {isPublished ? 'Live' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2">
                        <h3 className="font-outfit font-black text-base text-[#0A0A0A] leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {post.excerpt || post.subtitle}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-xs text-neutral-400">
                          <span className="flex items-center gap-1 truncate text-neutral-600 font-bold">
                            <Users className="w-3.5 h-3.5 text-[#E5383B]" />
                            <span className="truncate">{post.author?.name}</span>
                          </span>
                          <span className="shrink-0">{post.publishedAt || post.published_at}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2">
                      {/* Toggles */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleSpotlight(post)}
                          title="Toggle Editor's Spotlight"
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isSpotlight
                              ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700]'
                              : 'bg-white text-neutral-400 border-neutral-200 hover:text-amber-500'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleHomeFeatured(post)}
                          title="Toggle Homepage #blog Feature"
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isHomeFeatured
                              ? 'bg-amber-400 text-[#0A0A0A] border-amber-400'
                              : 'bg-white text-neutral-400 border-neutral-200 hover:text-amber-500'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(post)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-colors ${
                            isPublished
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                          }`}
                        >
                          {isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>

                      {/* Edit, Preview & Delete Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenPreviewModal(post)}
                          title="Live Blog Preview"
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-[#0A0A0A] hover:bg-neutral-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open live URL"
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-[#0A0A0A] hover:bg-neutral-200 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(post)}
                          title="Edit Journal"
                          className="p-1.5 rounded-lg text-[#E5383B] hover:bg-[#E5383B]/10 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(post.id)}
                          title="Delete Journal"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-neutral-300">
              <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
                No Trail Journals Match Filter
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Try clearing your search query or changing category and status.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 2: HERO SLIDER & PAGE COPY
         ==================================================================== */}
      {subTab === 'hero-settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
              <div>
                <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
                  100vh Hero Slider &amp; Editorial Headlines
                </h3>
                <p className="text-xs text-neutral-500">
                  Controls the full-bleed auto-sliding hero on <strong>/blog</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-neutral-950 hover:to-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>

            {/* Headline Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Eyebrow Badge Text
                </label>
                <input
                  type="text"
                  value={settings.hero_badge || ''}
                  onChange={(e) => {
                    setSettings({ ...settings, hero_badge: e.target.value });
                    setHasUnsavedSettings(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold outline-none focus:border-[#E5383B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Headline Line 1 (Bold Display)
                </label>
                <input
                  type="text"
                  value={settings.hero_title_line1 || ''}
                  onChange={(e) => {
                    setSettings({ ...settings, hero_title_line1: e.target.value });
                    setHasUnsavedSettings(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold outline-none focus:border-[#E5383B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Headline Cursive Accent (Gold Brush)
                </label>
                <input
                  type="text"
                  value={settings.hero_title_cursive || ''}
                  onChange={(e) => {
                    setSettings({ ...settings, hero_title_cursive: e.target.value });
                    setHasUnsavedSettings(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold outline-none focus:border-[#E5383B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Hero Subtitle Paragraph
                </label>
                <textarea
                  rows={2}
                  value={settings.hero_subtitle || ''}
                  onChange={(e) => {
                    setSettings({ ...settings, hero_subtitle: e.target.value });
                    setHasUnsavedSettings(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs outline-none focus:border-[#E5383B]"
                />
              </div>
            </div>

            {/* Hero Slides Manager */}
            <div className="pt-4 border-t border-neutral-200 space-y-4">
              <h4 className="font-outfit font-black text-sm text-[#0A0A0A] uppercase tracking-wider">
                Hero Slides ({settings.hero_slides?.length || 0})
              </h4>

              <div className="space-y-3.5">
                {(settings.hero_slides || []).map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row items-start md:items-center gap-4"
                  >
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                      <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                      <input
                        type="text"
                        value={slide.title}
                        placeholder="Slide Title"
                        onChange={(e) => {
                          const nextSlides = [...settings.hero_slides];
                          nextSlides[idx] = { ...nextSlides[idx], title: e.target.value };
                          setSettings({ ...settings, hero_slides: nextSlides });
                          setHasUnsavedSettings(true);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg bg-white border border-neutral-200 font-bold"
                      />
                      <input
                        type="text"
                        value={slide.location}
                        placeholder="Mountain Location"
                        onChange={(e) => {
                          const nextSlides = [...settings.hero_slides];
                          nextSlides[idx] = { ...nextSlides[idx], location: e.target.value };
                          setSettings({ ...settings, hero_slides: nextSlides });
                          setHasUnsavedSettings(true);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg bg-white border border-neutral-200"
                      />
                      <input
                        type="text"
                        value={slide.url}
                        placeholder="Image URL"
                        onChange={(e) => {
                          const nextSlides = [...settings.hero_slides];
                          nextSlides[idx] = { ...nextSlides[idx], url: e.target.value };
                          setSettings({ ...settings, hero_slides: nextSlides });
                          setHasUnsavedSettings(true);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg bg-white border border-neutral-200 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Copy */}
            <div className="pt-4 border-t border-neutral-200 space-y-4">
              <h4 className="font-outfit font-black text-sm text-[#0A0A0A] uppercase tracking-wider">
                Bottom Full-Bleed Dark Obsidian CTA
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                    CTA Badge
                  </label>
                  <input
                    type="text"
                    value={settings.cta_badge || ''}
                    onChange={(e) => {
                      setSettings({ ...settings, cta_badge: e.target.value });
                      setHasUnsavedSettings(true);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 border border-neutral-200 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                    CTA Heading
                  </label>
                  <input
                    type="text"
                    value={settings.cta_heading || ''}
                    onChange={(e) => {
                      setSettings({ ...settings, cta_heading: e.target.value });
                      setHasUnsavedSettings(true);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 border border-neutral-200 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                    CTA Subtitle
                  </label>
                  <input
                    type="text"
                    value={settings.cta_subtitle || ''}
                    onChange={(e) => {
                      setSettings({ ...settings, cta_subtitle: e.target.value });
                      setHasUnsavedSettings(true);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 border border-neutral-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PORTAL MODAL: ADD / EDIT / LIVE PREVIEW TRAIL JOURNAL
         ==================================================================== */}
      {postModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-neutral-200">
              
              {/* Modal Top Header with Mode Tabs */}
              <div className="px-6 py-4 bg-neutral-950 text-white flex flex-wrap items-center justify-between gap-4 shrink-0 border-b border-neutral-800">
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD700] block truncate">
                    {editingPostId ? 'Edit Field Journal' : 'Create New Himalayan Journal'}
                  </span>
                  <h3 className="font-outfit font-black text-lg text-white truncate max-w-md">
                    {formData.title || 'Untitled Journal'}
                  </h3>
                </div>

                {/* Switcher: Editor Mode vs Live Article Preview */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1 bg-white/10 rounded-2xl border border-white/15 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setModalTab('editor')}
                      className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        modalTab === 'editor'
                          ? 'bg-[#E5383B] text-white shadow-sm'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Write &amp; Edit Content</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('preview')}
                      className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        modalTab === 'preview'
                          ? 'bg-[#FFD700] text-[#0A0A0A] shadow-sm font-black'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Blog Preview</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPostModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ================================================================
                  TAB 1: EDITOR MODE (METADATA + KEY TAKEAWAYS + SECTIONS BUILDER)
                 ================================================================ */}
              {modalTab === 'editor' && (
                <form onSubmit={handleSavePost} className="p-6 overflow-y-auto space-y-7 flex-1 text-xs">
                  {/* 1. Basic Metadata */}
                  <div className="space-y-3.5 bg-neutral-50/80 p-5 rounded-2xl border border-neutral-200/80">
                    <h4 className="font-outfit font-black text-sm text-[#0A0A0A] uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#E5383B]" />
                      <span>1. Core Headline &amp; Taxonomy</span>
                    </h4>

                    <div>
                      <label className="font-bold text-neutral-700 block mb-1">Article Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. First Time Trekking in Himalayas? Top 7 Rookie Mistakes to Avoid"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm font-bold outline-none focus:border-[#E5383B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">
                          URL Slug (auto-generated if empty)
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="first-time-trekking-in-himalayas"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 font-mono text-[11px] outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 font-bold outline-none cursor-pointer"
                        >
                          {BLOG_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-neutral-700 block mb-1">Subtitle / Hook</label>
                      <textarea
                        rows={2}
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="Catchy editorial subtitle summarizing the main problem & solution..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-neutral-700 block mb-1">
                        Excerpt (Short card snippet)
                      </label>
                      <input
                        type="text"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Short 1-2 sentence preview for cards..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* 2. Cover Photo & Tags */}
                  <div className="space-y-3.5 bg-neutral-50/80 p-5 rounded-2xl border border-neutral-200/80">
                    <h4 className="font-outfit font-black text-sm text-[#0A0A0A] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FFD700]" />
                      <span>2. Cover Photo, Read Time &amp; Tags</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="font-bold text-neutral-700 block mb-1">
                          Cover Image URL *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cover_image}
                          onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 font-mono text-[11px] outline-none"
                        />
                      </div>
                      <div className="h-20 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200">
                        <img
                          src={formData.cover_image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">Read Time</label>
                        <input
                          type="text"
                          value={formData.read_time}
                          onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                          placeholder="5 min read"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-neutral-200"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">Minutes (Sort)</label>
                        <input
                          type="number"
                          value={formData.read_minutes}
                          onChange={(e) =>
                            setFormData({ ...formData, read_minutes: Number(e.target.value) })
                          }
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-neutral-200"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">Season Tag</label>
                        <input
                          type="text"
                          value={formData.season_tag}
                          onChange={(e) => setFormData({ ...formData, season_tag: e.target.value })}
                          placeholder="Oct – May"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-neutral-200"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">Difficulty</label>
                        <input
                          type="text"
                          value={formData.difficulty_tag}
                          onChange={(e) =>
                            setFormData({ ...formData, difficulty_tag: e.target.value })
                          }
                          placeholder="Essential Reading"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-neutral-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-neutral-700 block mb-1">
                        Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tagsString}
                        onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                        placeholder="Beginners, Winter Treks, Gear, Safety"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* ================================================================
                      3. THE SHIKHARITE FIELD BRIEF • KEY TAKEAWAYS (BLACK BOX HIGHLIGHTS)
                     ================================================================ */}
                  <div className="space-y-4 bg-gradient-to-br from-neutral-950 via-[#180406] to-neutral-950 text-white p-5 sm:p-6 rounded-2xl border border-[#E5383B]/35 shadow-lg">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FFD700]">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                          <span>3. The Shikharite Field Brief • Key Takeaways</span>
                        </span>
                        <p className="text-[11px] text-neutral-300 mt-0.5">
                          These bullet points appear inside the prominent black card right at the start of the article (as seen in Image 3).
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddTakeaway}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#FFD700] hover:text-[#0A0A0A] text-white text-[11px] font-black transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {formData.key_takeaways.map((takeaway, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <input
                            type="text"
                            value={takeaway}
                            onChange={(e) => handleUpdateTakeaway(tIdx, e.target.value)}
                            placeholder={`Key Takeaway #${tIdx + 1} (e.g. Always break in your trekking shoes 2 weeks before departure...)`}
                            className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-neutral-400 outline-none focus:border-[#FFD700]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTakeaway(tIdx)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete bullet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {formData.key_takeaways.length === 0 && (
                        <p className="text-neutral-400 text-xs italic">
                          No takeaways added yet. Click "+ Add Bullet" above.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ================================================================
                      4. ARTICLE SECTIONS BUILDER (HEADINGS, PARAGRAPHS, TIPS & QUOTES)
                     ================================================================ */}
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-neutral-300 shadow-2xs">
                    <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#E5383B]">
                          <Compass className="w-3.5 h-3.5" />
                          <span>4. Article Headings &amp; Story Content Sections</span>
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Write your numbered topics, paragraphs, pro tip callouts, and pull quotes (as seen in Images 3 &amp; 4).
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddSection}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 hover:bg-[#E5383B] text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>Add Section</span>
                      </button>
                    </div>

                    <div className="space-y-5">
                      {formData.sections.map((sec, sIdx) => (
                        <div
                          key={sec.id || sIdx}
                          className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3.5"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                            <span className="text-xs font-black uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                                {sIdx + 1}
                              </span>
                              <span>Topic Section #{sIdx + 1}</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveSection(sIdx)}
                              className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Section</span>
                            </button>
                          </div>

                          {/* Section Heading */}
                          <div>
                            <label className="font-bold text-neutral-700 block mb-1">
                              Section Heading (h2) *
                            </label>
                            <input
                              type="text"
                              value={sec.heading}
                              onChange={(e) => handleUpdateSection(sIdx, 'heading', e.target.value)}
                              placeholder={`e.g. ${sIdx + 1}. Wearing Cotton Layers Instead of Synthetics`}
                              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-bold outline-none focus:border-[#E5383B]"
                            />
                          </div>

                          {/* Section Paragraphs Textarea */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="font-bold text-neutral-700">
                                Section Story &amp; Content (Separate paragraphs with a blank line)
                              </label>
                              <span className="text-[10px] text-neutral-400">
                                Press Enter twice for a new paragraph
                              </span>
                            </div>
                            <textarea
                              rows={5}
                              value={sec.paragraphsText}
                              onChange={(e) =>
                                handleUpdateSection(sIdx, 'paragraphsText', e.target.value)
                              }
                              placeholder="Write your advice, stories, and explanations here..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs leading-relaxed outline-none focus:border-[#E5383B]"
                            />
                          </div>

                          {/* Optional Extras: Tip Box, Quote */}
                          <div className="pt-2 border-t border-neutral-200 flex flex-wrap gap-4 text-xs">
                            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-neutral-700">
                              <input
                                type="checkbox"
                                checked={sec.hasTip}
                                onChange={(e) =>
                                  handleUpdateSection(sIdx, 'hasTip', e.target.checked)
                                }
                                className="accent-[#E5383B]"
                              />
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                              <span>Add Pro Tip / Warning Box</span>
                            </label>

                            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-neutral-700">
                              <input
                                type="checkbox"
                                checked={sec.hasQuote}
                                onChange={(e) =>
                                  handleUpdateSection(sIdx, 'hasQuote', e.target.checked)
                                }
                                className="accent-[#E5383B]"
                              />
                              <Quote className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Add Stylized Pull Quote</span>
                            </label>
                          </div>

                          {/* Tip Box Sub-form */}
                          {sec.hasTip && (
                            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                                  <Lightbulb className="w-4 h-4 text-amber-600" />
                                  <span>Callout Box Details</span>
                                </span>
                                <select
                                  value={sec.tipBox?.type || 'tip'}
                                  onChange={(e) =>
                                    handleUpdateSection(sIdx, 'tipBox', {
                                      ...sec.tipBox,
                                      type: e.target.value
                                    })
                                  }
                                  className="px-2 py-1 text-[11px] rounded-lg bg-white border border-amber-300 font-bold"
                                >
                                  <option value="tip">💡 Pro Tip (Amber)</option>
                                  <option value="warning">🛡️ Safety Warning (Rose)</option>
                                </select>
                              </div>
                              <input
                                type="text"
                                value={sec.tipBox?.title || ''}
                                onChange={(e) =>
                                  handleUpdateSection(sIdx, 'tipBox', {
                                    ...sec.tipBox,
                                    title: e.target.value
                                  })
                                }
                                placeholder="Tip Title (e.g. Which One Should You Pick First?)"
                                className="w-full px-3 py-1.5 rounded-lg bg-white border border-amber-200 font-bold"
                              />
                              <textarea
                                rows={2}
                                value={sec.tipBox?.text || ''}
                                onChange={(e) =>
                                  handleUpdateSection(sIdx, 'tipBox', {
                                    ...sec.tipBox,
                                    text: e.target.value
                                  })
                                }
                                placeholder="Tip explanation..."
                                className="w-full px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-xs"
                              />
                            </div>
                          )}

                          {/* Quote Sub-form */}
                          {sec.hasQuote && (
                            <div className="p-3.5 rounded-xl bg-neutral-900 text-white space-y-2">
                              <span className="font-bold text-[#FFD700] text-xs flex items-center gap-1.5">
                                <Quote className="w-4 h-4 text-[#FFD700]" />
                                <span>Pull Quote Details</span>
                              </span>
                              <input
                                type="text"
                                value={sec.quote?.text || ''}
                                onChange={(e) =>
                                  handleUpdateSection(sIdx, 'quote', {
                                    ...sec.quote,
                                    text: e.target.value
                                  })
                                }
                                placeholder="Quote text..."
                                className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-serif italic text-xs"
                              />
                              <input
                                type="text"
                                value={sec.quote?.author || ''}
                                onChange={(e) =>
                                  handleUpdateSection(sIdx, 'quote', {
                                    ...sec.quote,
                                    author: e.target.value
                                  })
                                }
                                placeholder="Quote author (e.g. Vikram Rawat, Trek Lead)"
                                className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Linked Trek & Author Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Linked Trek */}
                    <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-3">
                      <h4 className="font-outfit font-black text-sm text-[#0A0A0A] uppercase tracking-wider flex items-center gap-1.5">
                        <Mountain className="w-4 h-4 text-[#E5383B]" />
                        <span>5. Linked Trek Spotlight</span>
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Auto-embeds the booking widget and itinerary card on the right sidebar.
                      </p>
                      <select
                        value={formData.related_trek_slug}
                        onChange={(e) => {
                          const selectedSlug = e.target.value;
                          const trek = TREKS.find((t) => t.slug === selectedSlug);
                          setFormData({
                            ...formData,
                            related_trek_slug: selectedSlug,
                            related_trek_name: trek ? trek.title : ''
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 font-bold outline-none cursor-pointer"
                      >
                        <option value="">None (Generic Guide)</option>
                        {TREKS.map((t) => (
                          <option key={t.slug} value={t.slug}>
                            {t.title} ({t.altitude} • {t.formattedPrice || `₹${t.price}`})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Author Info */}
                    <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-3">
                      <h4 className="font-outfit font-black text-sm text-[#0A0A0A] uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#E5383B]" />
                        <span>6. Leader Author Profile</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={formData.author.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              author: { ...formData.author, name: e.target.value }
                            })
                          }
                          placeholder="Author Name"
                          className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 font-bold"
                        />
                        <input
                          type="text"
                          value={formData.author.role}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              author: { ...formData.author, role: e.target.value }
                            })
                          }
                          placeholder="Certified Role"
                          className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.author.base}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            author: { ...formData.author, base: e.target.value }
                          })
                        }
                        placeholder="Stationed Base (e.g. Shimla Hub)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-neutral-200"
                      />
                    </div>
                  </div>

                  {/* 6. Publication & Placement Toggles */}
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_published}
                        onChange={(e) =>
                          setFormData({ ...formData, is_published: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#E5383B]"
                      />
                      <span className="font-bold text-neutral-800">Publish Immediately (Live)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 accent-[#FFD700]"
                      />
                      <span className="font-bold text-neutral-800">
                        Set as Editor’s Spotlight Card
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured_on_home}
                        onChange={(e) =>
                          setFormData({ ...formData, featured_on_home: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#E5383B]"
                      />
                      <span className="font-bold text-neutral-800">
                        Feature on Homepage #blog (Max 3)
                      </span>
                    </label>
                  </div>

                  {/* Footer Save / Cancel / Preview Switch */}
                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setModalTab('preview')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-[#FFD700] text-neutral-800 font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#E5383B]" />
                      <span>Preview How It Looks</span>
                    </button>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPostModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={savingPost}
                        className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-neutral-950 hover:to-neutral-950 text-white font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingPost ? 'Saving...' : editingPostId ? 'Save Changes' : 'Publish Journal'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ================================================================
                  TAB 2: INTERACTIVE LIVE BLOG PREVIEW (MATCHES EXACT FRONTEND)
                 ================================================================ */}
              {modalTab === 'preview' && (
                <div className="overflow-y-auto flex-1 bg-white">
                  {/* Notice Ribbon */}
                  <div className="px-6 py-2.5 bg-neutral-900 text-neutral-300 text-xs flex items-center justify-between border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live Frontend Reading Preview (Exact View as seen on <strong>/blog/{formData.slug || 'slug'}</strong>)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalTab('editor')}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#E5383B] text-white font-black text-[10px] uppercase hover:bg-white hover:text-[#0A0A0A] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Back to Editor</span>
                    </button>
                  </div>

                  {/* Header Banner */}
                  <div className="relative w-full pt-10 pb-12 px-6 bg-neutral-950 text-white overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <img
                        src={formData.cover_image}
                        alt={formData.title}
                        className="w-full h-full object-cover opacity-20 filter blur-xs"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/85 to-neutral-950/90" />
                    </div>

                    <div className="max-w-3xl mx-auto relative z-10 space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-3 py-0.5 rounded-full bg-[#E5383B] text-white text-[10px] font-black uppercase">
                          {formData.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#FFD700] text-[10px] font-extrabold uppercase">
                          {formData.difficulty_tag}
                        </span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-neutral-300 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FFD700]" />
                          {formData.read_time}
                        </span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-neutral-400">{formData.published_at}</span>
                      </div>

                      <h1 className="font-outfit font-black text-2xl sm:text-3xl text-white leading-tight">
                        {formData.title || 'Untitled Journal Title'}
                      </h1>

                      <p className="text-sm text-neutral-300 leading-relaxed">
                        {formData.subtitle || formData.excerpt}
                      </p>

                      <div className="pt-3 border-t border-white/15 flex items-center gap-3">
                        <img
                          src={formData.author.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                          alt={formData.author.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FFD700]"
                        />
                        <div>
                          <p className="font-outfit font-bold text-sm text-white">
                            {formData.author.name || 'Author Name'}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {formData.author.role} • {formData.author.base}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content 2-Column */}
                  <div className="max-w-4xl mx-auto px-6 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left 8 Cols */}
                      <div className="lg:col-span-8 space-y-8">
                        {/* Key Takeaways Box (Image 3) */}
                        {formData.key_takeaways && formData.key_takeaways.length > 0 && (
                          <div className="rounded-3xl p-6 bg-gradient-to-br from-neutral-950 via-[#180406] to-neutral-950 text-white border border-[#E5383B]/35 shadow-xl space-y-4">
                            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FFD700]">
                              <Sparkles className="w-4 h-4 text-[#FFD700]" />
                              <span>The Shikharite Field Brief • Key Takeaways</span>
                            </div>
                            <h3 className="font-outfit font-black text-lg text-white">
                              What You Must Know Before Heading Up
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {formData.key_takeaways.map((point, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-200"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sections (Images 3 & 4) */}
                        <div className="space-y-8">
                          {formData.sections.map((sec, sIdx) => {
                            const paras = (sec.paragraphsText || '')
                              .split('\n\n')
                              .map((p) => p.trim())
                              .filter(Boolean);

                            return (
                              <section key={sec.id || sIdx} className="space-y-3.5">
                                <h2 className="font-outfit font-black text-xl sm:text-2xl text-[#0A0A0A] tracking-tight">
                                  {sec.heading}
                                </h2>

                                {paras.map((p, pIdx) => (
                                  <p key={pIdx} className="text-sm text-neutral-700 leading-relaxed">
                                    {p}
                                  </p>
                                ))}

                                {/* Pro Tip Box (Images 2 & 4) */}
                                {sec.hasTip && sec.tipBox?.title && (
                                  <div
                                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                                      sec.tipBox.type === 'warning'
                                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                                        : 'bg-amber-50 border-amber-200 text-amber-950'
                                    }`}
                                  >
                                    {sec.tipBox.type === 'warning' ? (
                                      <ShieldAlert className="w-4 h-4 text-[#E5383B] shrink-0 mt-0.5" />
                                    ) : (
                                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                      <p className="font-outfit font-bold text-xs">
                                        {sec.tipBox.title}
                                      </p>
                                      <p className="text-xs mt-0.5 opacity-90">
                                        {sec.tipBox.text}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Pull Quote */}
                                {sec.hasQuote && sec.quote?.text && (
                                  <div className="p-5 rounded-2xl bg-neutral-900 text-white border-l-4 border-[#E5383B]">
                                    <p className="font-brush text-xl text-[#FFD700] leading-snug">
                                      “{sec.quote.text}”
                                    </p>
                                    <p className="text-[10px] uppercase font-bold text-neutral-400 mt-1">
                                      — {sec.quote.author}
                                    </p>
                                  </div>
                                )}
                              </section>
                            );
                          })}
                        </div>

                        {/* Tags */}
                        {formData.tagsString && (
                          <div className="pt-4 border-t border-neutral-200">
                            <span className="text-[10px] font-black uppercase text-neutral-400 block mb-2">
                              Related Topics &amp; Mountain Tags:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {formData.tagsString
                                .split(',')
                                .map((t) => t.trim())
                                .filter(Boolean)
                                .map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-3 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-bold"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Author Bio Card (Image 2) */}
                        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-4">
                          <img
                            src={formData.author.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                            alt={formData.author.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#E5383B] shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-outfit font-black text-sm text-[#0A0A0A]">
                                {formData.author.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full bg-[#E5383B]/10 text-[#E5383B] text-[9px] font-black uppercase">
                                {formData.author.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 font-bold">
                              Stationed at {formData.author.base}
                            </p>
                            <p className="text-xs text-neutral-600 mt-1">
                              {formData.author.bio}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right 4 Cols: Sidebar Preview (Images 2, 3, 4) */}
                      <div className="lg:col-span-4 space-y-5">
                        {/* Table of Contents */}
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                          <span className="font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5 text-[11px]">
                            <Compass className="w-3.5 h-3.5 text-[#E5383B]" />
                            <span>Table of Contents</span>
                          </span>
                          <div className="space-y-1">
                            {formData.sections.map((sec, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded-lg text-xs truncate ${
                                  idx === 0
                                    ? 'bg-neutral-900 text-white font-bold'
                                    : 'text-neutral-600 hover:text-black'
                                }`}
                              >
                                {sec.heading}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Featured Itinerary Booking Card */}
                        {previewTrek && (
                          <div className="rounded-2xl overflow-hidden bg-neutral-950 text-white border border-neutral-800 shadow-lg text-xs space-y-3">
                            <div className="relative h-32">
                              <img
                                src={previewTrek.heroImages ? previewTrek.heroImages[0] : formData.cover_image}
                                alt={previewTrek.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent" />
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#E5383B] text-[9px] font-black uppercase text-white">
                                Featured Itinerary
                              </span>
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[#FFD700] text-[9px] font-extrabold">
                                {previewTrek.altitude}
                              </span>
                            </div>

                            <div className="p-4 space-y-2.5">
                              <div>
                                <h4 className="font-outfit font-black text-sm text-white">
                                  {previewTrek.title}
                                </h4>
                                <p className="text-[11px] text-neutral-400 mt-0.5">
                                  {previewTrek.duration} • <strong className="text-[#FFD700]">{previewTrek.formattedPrice || `₹${previewTrek.price}`}</strong>
                                </p>
                              </div>

                              <button
                                type="button"
                                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                              >
                                <span>View Trek Itinerary</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modal Preview Footer */}
                  <div className="p-4 bg-neutral-900 text-white border-t border-neutral-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setModalTab('editor')}
                      className="px-4 py-2 rounded-xl border border-neutral-700 text-xs font-bold text-neutral-300 hover:text-white"
                    >
                      ← Back to Editing Form
                    </button>

                    <button
                      type="button"
                      onClick={handleSavePost}
                      disabled={savingPost}
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingPost ? 'Saving...' : 'Save & Publish Journal'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-neutral-200">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
                Delete Trail Journal?
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Are you sure you want to delete this field journal? It will be permanently removed from <strong>/blog</strong> and the database.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-5 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePost(deleteConfirmId)}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-md"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
