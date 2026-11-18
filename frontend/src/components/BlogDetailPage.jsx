import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Eye,
  Heart,
  HelpCircle,
  Lightbulb,
  MapPin,
  MessageSquare,
  Mountain,
  Phone,
  Quote,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Users
} from 'lucide-react';
import { BLOG_POSTS, getBlogBySlug } from '../data/blogsData';
import { getBlogPostBySlug } from '../lib/blogApi';
import { TREKS } from '../data/treksData';

const SAVED_BLOGS_KEY = 'tts_saved_blogs';

export default function BlogDetailPage({ onBookTrek }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(() => getBlogBySlug(slug));

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Scroll to top on slug change & fetch live post
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    let isMounted = true;

    async function loadPost() {
      const live = await getBlogPostBySlug(slug);
      if (isMounted && live) {
        setPost(live);
      }
    }
    loadPost();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Read saved state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_BLOGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setIsSaved(Array.isArray(parsed) && parsed.includes(slug));
      }
    } catch {
      // Ignore storage errors
    }
  }, [slug]);

  // Track scroll progress and active section in Table of Contents
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
          }

          // Active section highlight
          if (post && Array.isArray(post.sections)) {
            const offsets = post.sections.map((sec) => {
              const el = document.getElementById(sec.id);
              if (!el) return { id: sec.id, top: Infinity };
              const rect = el.getBoundingClientRect();
              return { id: sec.id, top: rect.top };
            });

            // Find section closest to top (around 160px from viewport top)
            const pastSections = offsets.filter((item) => item.top <= 200);
            if (pastSections.length > 0) {
              setActiveSectionId(pastSections[pastSections.length - 1].id);
            } else if (post.sections[0]) {
              setActiveSectionId(post.sections[0].id);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  const toggleSave = () => {
    try {
      const raw = localStorage.getItem(SAVED_BLOGS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      let next;
      if (parsed.includes(slug)) {
        next = parsed.filter((s) => s !== slug);
        setIsSaved(false);
      } else {
        next = [...parsed, slug];
        setIsSaved(true);
      }
      localStorage.setItem(SAVED_BLOGS_KEY, JSON.stringify(next));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2400);
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (!post) return;
    const shareText = `🏔️ Read this Himalayan field guide on TrekToShikhar:\n"${post.title}"\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // If slug doesn't exist
  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 flex flex-col items-center justify-center text-center bg-white">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="font-outfit font-black text-3xl text-[#0A0A0A]">
          Trail Journal Not Found
        </h1>
        <p className="text-neutral-500 text-sm max-w-md mt-2">
          The Himalayan guide you are looking for may have been moved or retitled.
        </p>
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-950 hover:bg-[#E5383B] text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Field Journals</span>
        </button>
      </div>
    );
  }

  // Linked Trek Data
  const relatedTrek = TREKS.find((t) => t.slug === post.relatedTrekSlug) || null;

  // Next and Previous articles
  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  // Other related journals
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] selection:bg-[#E5383B] selection:text-white">
      {/* 1. STICKY READING PROGRESS INDICATOR */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none transition-all duration-100"
        style={{
          background: `linear-gradient(to right, #E5383B 0%, #FFD700 ${scrollProgress}%, transparent ${scrollProgress}%)`
        }}
      />

      {/* 2. CINEMATIC ARTICLE HERO BANNER */}
      <header className="relative w-full pt-24 pb-14 sm:pb-20 px-4 sm:px-6 bg-neutral-950 text-white overflow-hidden">
        {/* Background Cover Image with Scrim */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-25 filter blur-xs transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/90" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(circle at 75% 30%, rgba(229,56,59,0.35) 0%, transparent 60%)'
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Top Back Link & Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-300 hover:text-white bg-white/10 hover:bg-[#E5383B] px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>All Field Journals</span>
            </button>

            <div className="flex items-center gap-2">
              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-extrabold backdrop-blur-md transition-colors cursor-pointer"
              >
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </button>

              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white hover:text-[#0A0A0A] text-neutral-200 text-[11px] font-extrabold border border-white/15 backdrop-blur-md transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>

              {/* Bookmark Save Button */}
              <button
                type="button"
                onClick={toggleSave}
                aria-label={isSaved ? 'Remove from saved' : 'Save article'}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700]'
                    : 'bg-white/10 hover:bg-white hover:text-[#0A0A0A] text-white border-white/20'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-[#E5383B] text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
              {post.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FFD700] text-[11px] font-extrabold uppercase tracking-wider">
              {post.difficultyTag}
            </span>
            <span className="text-neutral-400 text-xs">•</span>
            <span className="inline-flex items-center gap-1 text-xs text-neutral-300 font-bold">
              <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
              {post.readTime}
            </span>
            <span className="text-neutral-400 text-xs">•</span>
            <span className="inline-flex items-center gap-1 text-xs text-neutral-300">
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              {post.views} reads
            </span>
          </div>

          {/* Article Title */}
          <h1 className="font-outfit font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          {/* Subtitle / Hook */}
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
            {post.subtitle}
          </p>

          {/* Author Card in Hero */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FFD700]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-outfit font-black text-sm text-white">
                    {post.author.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-amber-300">
                    Leader
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  {post.author.role} • {post.author.base}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-neutral-400">
              <p className="font-bold text-white">Published {post.publishedAt}</p>
              <p className="text-[11px]">TrekToShikhar Field Chronicles</p>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN ARTICLE EDITORIAL BODY + STICKY SIDEBAR */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ================================================================
              LEFT / MAIN COLUMN (8 COLS): EDITORIAL READING EXPERIENCE
             ================================================================ */}
          <article className="lg:col-span-8 space-y-10">
            
            {/* Lead HD Photo Card with Rounded Glass Caption */}
            <div className="rounded-3xl overflow-hidden border border-neutral-200/90 shadow-md">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-4 bg-neutral-900 text-white flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-neutral-300 italic">
                  Field Dispatch: High-altitude views along the {post.relatedTrekName} route.
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold text-[#FFD700] shrink-0">
                  {post.seasonTag}
                </span>
              </div>
            </div>

            {/* TL;DR / Key Takeaways Box */}
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-neutral-950 via-[#180406] to-neutral-950 text-white border border-[#E5383B]/35 shadow-xl relative overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    background:
                      'radial-gradient(circle at 90% 10%, rgba(229,56,59,0.35) 0%, transparent 60%)'
                  }}
                />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FFD700] mb-3">
                    <Sparkles className="w-4 h-4 text-[#FFD700]" />
                    <span>The Shikharite Field Brief • Key Takeaways</span>
                  </div>
                  <h3 className="font-outfit font-black text-xl text-white mb-4">
                    What You Must Know Before Heading Up
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {post.keyTakeaways.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-200 leading-snug"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Article Sections */}
            <div className="space-y-10 text-neutral-800">
              {post.sections.map((section, sIdx) => (
                <section
                  key={section.id || sIdx}
                  id={section.id}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight leading-snug pt-2">
                    {section.heading}
                  </h2>

                  {section.paragraphs.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal"
                    >
                      {para}
                    </p>
                  ))}

                  {/* Optional Mountain Tip / Warning Box */}
                  {section.tipBox && (
                    <div
                      className={`my-6 rounded-2xl p-5 border flex items-start gap-3.5 ${
                        section.tipBox.type === 'warning'
                          ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                          : 'bg-amber-50/80 border-amber-200 text-amber-950'
                      }`}
                    >
                      {section.tipBox.type === 'warning' ? (
                        <ShieldAlert className="w-5 h-5 text-[#E5383B] shrink-0 mt-0.5" />
                      ) : (
                        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-outfit font-bold text-sm">
                          {section.tipBox.title}
                        </p>
                        <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
                          {section.tipBox.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Optional Editorial Quote */}
                  {section.quote && (
                    <div className="my-7 p-6 rounded-3xl bg-neutral-900 text-white border-l-4 border-[#E5383B] shadow-md relative overflow-hidden">
                      <Quote className="w-8 h-8 text-[#FFD700]/30 absolute right-4 top-4 pointer-events-none" />
                      <p className="font-brush text-2xl sm:text-3xl text-[#FFD700] leading-snug">
                        “{section.quote.text}”
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                        — {section.quote.author}
                      </p>
                    </div>
                  )}

                  {/* Optional Inline Photo */}
                  {section.image && (
                    <div className="my-6 rounded-3xl overflow-hidden border border-neutral-200">
                      <img
                        src={section.image.url}
                        alt={section.image.caption || section.heading}
                        className="w-full h-72 sm:h-80 object-cover"
                      />
                      {section.image.caption && (
                        <p className="p-3 bg-neutral-100 text-neutral-600 text-xs italic text-center">
                          {section.image.caption}
                        </p>
                      )}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Tags Cloud */}
            <div className="pt-6 border-t border-neutral-200">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-400 block mb-3">
                Related Topics &amp; Mountain Tags:
              </span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => navigate(`/blog?tag=${encodeURIComponent(tag)}`)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-[#E5383B] hover:text-white text-xs font-bold text-neutral-700 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Author Biography Footer Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-neutral-50 border border-neutral-200/90 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#E5383B] shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-outfit font-black text-lg text-[#0A0A0A]">
                    {post.author.name}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E5383B]/10 text-[#E5383B] text-[10px] font-black uppercase">
                    {post.author.role}
                  </span>
                </div>
                <p className="text-xs font-bold text-neutral-500">
                  Stationed at {post.author.base}
                </p>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-1">
                  {post.author.bio}
                </p>
              </div>
            </div>

            {/* Prev / Next Article Navigation Cards */}
            <div className="pt-6 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <button
                  type="button"
                  onClick={() => navigate(`/blog/${prevPost.slug}`)}
                  className="group text-left p-4 sm:p-5 rounded-2xl border border-neutral-200 hover:border-[#E5383B] hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                >
                  <ArrowLeft className="w-5 h-5 text-[#E5383B] group-hover:-translate-x-1 transition-transform shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">
                      Previous Journal
                    </span>
                    <span className="font-outfit font-bold text-sm text-[#0A0A0A] group-hover:text-[#E5383B] transition-colors truncate block">
                      {prevPost.title}
                    </span>
                  </div>
                </button>
              ) : <div />}

              {nextPost && (
                <button
                  type="button"
                  onClick={() => navigate(`/blog/${nextPost.slug}`)}
                  className="group text-right p-4 sm:p-5 rounded-2xl border border-neutral-200 hover:border-[#E5383B] hover:shadow-md transition-all cursor-pointer flex items-center justify-end gap-3 sm:ml-auto w-full"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">
                      Next Journal
                    </span>
                    <span className="font-outfit font-bold text-sm text-[#0A0A0A] group-hover:text-[#E5383B] transition-colors truncate block">
                      {nextPost.title}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#E5383B] group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              )}
            </div>
          </article>

          {/* ================================================================
              RIGHT COLUMN (4 COLS): STICKY SIDEBAR (TOC + TREK CARD + SAFETY)
             ================================================================ */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              
              {/* 1. Interactive Table of Contents */}
              <div className="rounded-3xl p-6 bg-neutral-50 border border-neutral-200/90 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0A0A0A] mb-3">
                  <Compass className="w-4 h-4 text-[#E5383B]" />
                  <span>Table of Contents</span>
                </div>
                <nav className="space-y-1.5 text-xs">
                  {post.sections.map((sec, idx) => {
                    const isActive = activeSectionId === sec.id;
                    return (
                      <a
                        key={sec.id || idx}
                        href={`#${sec.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(sec.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`block py-2 px-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-neutral-950 text-white font-extrabold shadow-xs'
                            : 'text-neutral-600 hover:text-[#0A0A0A] hover:bg-neutral-100 font-medium'
                        }`}
                      >
                        <span className="line-clamp-1">{sec.heading}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* 2. Spotlight Related Trek Card (Direct Booking Link!) */}
              {relatedTrek && (
                <div className="rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-950 text-white shadow-xl relative">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={relatedTrek.heroImages ? relatedTrek.heroImages[0] : post.coverImage}
                      alt={relatedTrek.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#E5383B] text-[10px] font-black uppercase tracking-wider text-white">
                      Featured Itinerary
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FFD700] text-[10px] font-extrabold">
                      {relatedTrek.altitude}
                    </span>
                  </div>

                  <div className="p-5 space-y-3.5">
                    <div>
                      <h4 className="font-outfit font-black text-lg text-white leading-snug">
                        {relatedTrek.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                        <span>{relatedTrek.duration}</span>
                        <span>•</span>
                        <span className="text-[#FFD700] font-bold">{relatedTrek.formattedPrice || `₹${relatedTrek.price}`}</span>
                      </p>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                      {relatedTrek.tagline || relatedTrek.overview}
                    </p>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/track/${relatedTrek.slug}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-white hover:to-white text-white hover:text-[#0A0A0A] font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>View Trek Itinerary</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onBookTrek) {
                            onBookTrek(relatedTrek);
                          } else {
                            navigate('/contact');
                          }
                        }}
                        className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-[#FFD700] hover:text-[#0A0A0A] text-neutral-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>Book On WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Shikharite Mountain Ethos Banner */}
              <div className="rounded-3xl p-5 bg-neutral-50 border border-neutral-200/90 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-[#E5383B] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Shikharite Standard</span>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  Every departure is led by certified leaders (NIM &amp; ABVIMAS), limited to 12–15 trekkers, and follows a strict zero-plastic policy.
                </p>
              </div>

            </div>
          </aside>
        </div>

        {/* ====================================================================
            4. MORE HIMALAYAN FIELD JOURNALS
           ==================================================================== */}
        <section className="mt-20 pt-12 border-t border-neutral-200">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#E5383B]">
                Continue Reading
              </span>
              <h3 className="font-outfit font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight mt-0.5">
                More Himalayan Field Journals
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#E5383B] hover:text-[#0A0A0A] transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherPosts.map((other) => (
              <article
                key={other.id}
                onClick={() => {
                  navigate(`/blog/${other.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-white rounded-3xl overflow-hidden border border-neutral-200 hover:border-[#E5383B] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-neutral-900">
                    <img
                      src={other.coverImage}
                      alt={other.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#E5383B] text-[10px] font-black uppercase text-white">
                      {other.category}
                    </span>
                    <span className="absolute bottom-3 right-3 text-[11px] text-[#FFD700] font-bold">
                      {other.readTime}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="font-outfit font-black text-base text-[#0A0A0A] group-hover:text-[#E5383B] transition-colors line-clamp-2">
                      {other.title}
                    </h4>
                    <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {other.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-neutral-500">{other.author.name}</span>
                  <span className="font-black text-[#E5383B] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* 5. FULL-BLEED DARK OBSIDIAN BOTTOM CTA SECTION */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 bg-neutral-900 text-white border-t border-neutral-800">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[780px] h-[280px] pointer-events-none opacity-45 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(229,56,59,0.28) 0%, rgba(255,215,0,0.08) 50%, transparent 75%)'
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="rounded-[2rem] bg-neutral-950/90 backdrop-blur-md border border-neutral-800 p-8 sm:p-14 text-center shadow-2xl space-y-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-black uppercase tracking-[0.2em] text-[#FFD700]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Once a Shikharite, Always a Shikharite</span>
            </span>

            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Inspired By This Mountain Story?
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Book your next summit departure with TrekToShikhar or consult directly with our certified expedition leaders.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => {
                  navigate('/track');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-white hover:to-white text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_12px_30px_rgba(229,56,59,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative h-5 overflow-hidden flex flex-col justify-start">
                  <span className="leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Explore All Treks
                  </span>
                  <span className="leading-5 text-[#E5383B] transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Book Upcoming Summit
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 group-hover:text-[#E5383B] transition-all shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  navigate('/blog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-[#FFD700] hover:text-[#0A0A0A] text-white border border-white/20 hover:border-[#FFD700] font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 overflow-hidden"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span className="relative h-5 overflow-hidden flex flex-col justify-start">
                  <span className="leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Read More Guides
                  </span>
                  <span className="leading-5 font-black text-[#0A0A0A] transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Browse All Dispatches
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
