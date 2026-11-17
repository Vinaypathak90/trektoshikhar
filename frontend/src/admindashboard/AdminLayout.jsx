import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Mountain, 
  Phone, 
  LayoutDashboard, 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Bell, 
  Menu, 
  X,
  Compass,
  CheckCircle2,
  Sliders,
  LogOut,
  ChevronRight
} from 'lucide-react';
import HeroSlidesModule from './HeroSlidesModule';
import TreksModule from './TreksModule';
import ContactModule from './ContactModule';

export default function AdminLayout() {
  const navigate = useNavigate();
  // Default to Module 1: Header & Hero Slider in proper sequence
  const [activeTab, setActiveTab] = useState('hero');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation Items arranged in proper logical sequence (1 -> 2 -> 3 -> 4)
  const navItems = [
    { 
      id: 'hero', 
      label: '1. Header & Hero Slider', 
      shortLabel: 'Header & Hero Slider',
      icon: Layers,
      badge: 'Module 1',
      desc: 'Homepage Slider, Headlines'
    },
    { 
      id: 'treks', 
      label: '2. Treks & Expeditions', 
      shortLabel: 'Treks & Expeditions',
      icon: Mountain,
      badge: 'Module 2',
      desc: 'Catalog, Itineraries, Packages'
    },
    { 
      id: 'contact', 
      label: '3. Contact Us & FAQs', 
      shortLabel: 'Contact Us & FAQs',
      icon: Phone,
      badge: 'Module 3',
      desc: 'Hotline, Inbox, FAQs'
    },
    { 
      id: 'overview', 
      label: '4. System Overview', 
      shortLabel: 'System Overview',
      icon: LayoutDashboard,
      badge: 'Live',
      desc: 'Database Health & Analytics'
    }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#0F1115] text-[#0A0A0A] font-sans selection:bg-[#E5383B] selection:text-white">
      
      {/* ====================================================================
          1. MOBILE SIDEBAR BACKDROP
         ==================================================================== */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden animate-fade-in"
        />
      )}

      {/* ====================================================================
          2. LEFT SIDEBAR (ROCK SOLID FIXED - NEVER SCROLLS AWAY)
         ==================================================================== */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 w-64 lg:w-72 h-screen bg-[#0F1115] text-white z-40 flex flex-col justify-between p-4 lg:p-5 border-r border-neutral-800 shadow-2xl transition-transform duration-300 ease-in-out shrink-0 overflow-hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Brand Header (Sticky at top of sidebar) */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#E5383B]/50 group-hover:ring-[#E5383B] transition-all shrink-0">
                <img 
                  src="/logo.jpg" 
                  alt="TrekToShikhar" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div>
                <span className="font-outfit font-black text-base text-white tracking-tight block leading-tight">
                  TrekTo<span className="text-[#E5383B]">Shikhar</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-bold block">
                  Admin Control Portal
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Slider List (Independent Scroll if needed) */}
          <div className="mt-5 space-y-1.5 flex-1 overflow-y-auto scrollbar-none pr-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-3 mb-2 block">
              Core Control Modules
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer text-left group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white shadow-[0_4px_20px_rgba(229,56,59,0.4)] translate-x-1'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className={`block truncate ${isActive ? 'font-extrabold text-white' : 'text-neutral-300'}`}>
                        {item.label}
                      </span>
                      <span className={`text-[10px] block truncate ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ml-2 ${
                    isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-neutral-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer: Back to Live Site & Admin Profile */}
          <div className="pt-4 border-t border-white/10 space-y-3 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white hover:text-black text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Live Website</span>
            </button>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-full bg-[#E5383B] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                AD
              </div>
              <div className="text-left text-xs truncate">
                <span className="font-bold text-white block truncate">Mountain Admin</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase Live Connected
                </span>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* ====================================================================
          3. RIGHT CONTENT AREA (FIXED TOPBAR + INDEPENDENT SCROLLING BODY)
         ==================================================================== */}
      <div className="flex-1 h-screen flex flex-col min-w-0 bg-[#F4F5F7] overflow-hidden">
        
        {/* Top Navbar - 100% FIXED, NEVER SCROLLS AWAY */}
        <header className="h-16 shrink-0 bg-white border-b border-neutral-200/90 px-4 sm:px-8 flex items-center justify-between z-20 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 cursor-pointer shrink-0"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="truncate">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E5383B] block leading-none">
                Admin Console
              </span>
              <h1 className="font-outfit font-black text-base sm:text-lg text-[#0A0A0A] truncate">
                {navItems.find(i => i.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-bold transition cursor-pointer"
            >
              <span>View Frontend</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Hotline:</span>
              <span>+91 87912 18377</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Canvas - THIS AND ONLY THIS SCROLLS */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto pb-16">
            {activeTab === 'hero' && (
              <HeroSlidesModule />
            )}

            {activeTab === 'treks' && (
              <TreksModule />
            )}

            {activeTab === 'contact' && (
              <ContactModule />
            )}

            {activeTab === 'overview' && (
              <OverviewSection onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
          </div>
        </main>

      </div>

    </div>
  );
}

// ----------------------------------------------------------------------
// OVERVIEW SECTION: QUICK STATS & MODULE CARDS
// ----------------------------------------------------------------------
function OverviewSection({ onNavigateTab }) {
  return (
    <div className="space-y-8 animate-editorial-fade">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-neutral-950 via-[#1a0407] to-neutral-950 text-white border border-[#E5383B]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#FFD700] uppercase tracking-widest block mb-1">
            ⚡ All Systems Operational
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-outfit">
            TrekToShikhar Dynamic Command Center
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm mt-1 max-w-xl">
            Control the entire website dynamically. Cloudinary media links, header slides, mountain trek catalog, and inquiry lines are active.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('hero')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-900 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md"
          >
            1. Manage Hero Slides
          </button>
          <button
            onClick={() => onNavigateTab('treks')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white text-xs font-bold transition cursor-pointer"
          >
            2. Manage Treks
          </button>
          <button
            onClick={() => onNavigateTab('contact')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white text-xs font-bold transition cursor-pointer"
          >
            3. Contact &amp; FAQs
          </button>
        </div>
      </div>

      {/* Quick Nav Cards in 1 -> 2 -> 3 Sequence */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div 
          onClick={() => onNavigateTab('hero')}
          className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-lg hover:border-[#E5383B] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Module 1</span>
          <h3 className="font-outfit font-black text-xl text-[#0A0A0A] mt-0.5">
            Hero Header Slides
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Manage Cloudinary background slides, headlines, and cursive accents.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('treks')}
          className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-lg hover:border-[#E5383B] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E5383B] flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
            <Mountain className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#E5383B]">Module 2</span>
          <h3 className="font-outfit font-black text-xl text-[#0A0A0A] mt-0.5">
            Treks &amp; Expeditions
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Control trails, day-by-day itineraries, packages, and packing checklist.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('contact')}
          className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-lg hover:border-[#E5383B] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Module 3</span>
          <h3 className="font-outfit font-black text-xl text-[#0A0A0A] mt-0.5">
            Contact &amp; Inquiries
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Update mountain hubs, view incoming trekker inquiries, and edit FAQs.
          </p>
        </div>
      </div>

    </div>
  );
}
