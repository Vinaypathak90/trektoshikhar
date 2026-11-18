import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X, 
  PhoneCall, 
  Camera, 
  BookOpen, 
  Users, 
  Home as HomeIcon,
  Mountain,
  Mail
} from 'lucide-react';

export default function Navbar({ onBookClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverRedSection, setIsOverRedSection] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Derived active tab from current route path
  const getActiveTab = () => {
    if (location.pathname.startsWith('/track') || location.pathname.startsWith('/trek')) return 'treks';
    if (location.pathname.startsWith('/about')) return 'about';
    if (location.pathname.startsWith('/gallery')) return 'gallery';
    if (location.pathname.startsWith('/blog')) return 'blog';
    if (location.pathname.startsWith('/contact')) return 'contact';
    return 'home';
  };
  const activeTab = getActiveTab();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 15);

          // Detect if navbar is overlapping the Red section on homepage
          const redSection = document.getElementById('red-section');
          if (redSection && location.pathname === '/') {
            const rect = redSection.getBoundingClientRect();
            const navbarHeight = 65;
            const isOver = rect.top <= navbarHeight && rect.bottom >= 10;
            setIsOverRedSection(isOver);
          } else {
            setIsOverRedSection(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  const navLinks = [
    { id: 'home', label: 'Home', href: '/', icon: HomeIcon },
    { id: 'about', label: 'About Us', href: '/about', icon: Users },
    { id: 'treks', label: 'Treks', href: '/track', icon: Mountain },
    { id: 'gallery', label: 'Gallery', href: '/gallery', icon: Camera },
    { id: 'blog', label: 'Blog', href: '/blog', icon: BookOpen },
  ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);

    if (id === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'about') {
      navigate('/about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'treks') {
      navigate('/track');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'gallery') {
      navigate('/gallery');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'contact') {
      navigate('/contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'blog') {
      navigate('/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  const handleBookClick = () => {
    setMobileMenuOpen(false);
    if (onBookClick) {
      onBookClick();
    } else {
      navigate('/track');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOverRedSection
          ? 'glass-ribbon-white text-[#0A0A0A]'
          : 'glass-ribbon-red text-white'
      } ${isScrolled ? 'py-2 sm:py-2.5' : 'py-3 sm:py-3.5'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between transition-all duration-300">
        
        {/* 1. BRAND LOGO & STYLISH CURSIVE TYPOGRAPHY */}
        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          {/* Logo Badge with 3D Glass Ring & Glow */}
          <div 
            className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 bg-white shadow-md shadow-black/20 ring-2 transition-all duration-300 overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-108 group-hover:shadow-2xl ${
              isOverRedSection ? 'ring-[#E5383B]/40 group-hover:ring-[#E5383B]' : 'ring-white/50 group-hover:ring-white'
            }`}
          >
            <img
              src="/logo.jpg"
              alt="Trek To Shikhar Logo"
              className="w-full h-full object-cover rounded-full group-hover:rotate-6 transition-transform duration-500"
            />
          </div>

          {/* Stylish Cursive Typography */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span 
                className={`font-outfit font-extrabold text-xl sm:text-2xl tracking-tight transition-colors duration-300 ${
                  isOverRedSection ? 'text-[#0A0A0A]' : 'text-white'
                }`}
              >
                Trek To
              </span>
              <span 
                className={`font-brush text-2xl sm:text-3xl transition-all duration-300 transform -rotate-1 ${
                  isOverRedSection 
                    ? 'text-[#E5383B] drop-shadow-[0_2px_10px_rgba(229,56,59,0.3)]' 
                    : 'text-amber-300 drop-shadow-[0_2px_12px_rgba(252,211,77,0.6)]'
                }`}
              >
                Shikhar
              </span>
            </div>

            {/* Cursive Tagline */}
            <div 
              className={`font-cursive text-sm sm:text-base font-bold tracking-wide mt-0.5 flex items-center gap-1.5 transition-colors duration-300 ${
                isOverRedSection ? 'text-neutral-600' : 'text-white/95'
              }`}
            >
              <span className="hover:text-amber-300 transition-colors">Explore</span>
              <span className={`text-xs ${isOverRedSection ? 'text-[#E5383B]' : 'text-amber-300'}`}>•</span>
              <span className="hover:text-amber-300 transition-colors">Trek</span>
              <span className={`text-xs ${isOverRedSection ? 'text-[#E5383B]' : 'text-amber-300'}`}>•</span>
              <span className="hover:text-amber-300 transition-colors">Discover</span>
            </div>
          </div>
        </a>

        {/* 2. HORIZONTAL NAVIGATION LINKS (CENTER/RIGHT) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            
            const linkClass = isOverRedSection
              ? `nav-link-hover-red px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'active text-[#E5383B] bg-neutral-900/5 backdrop-blur-md shadow-2xs'
                    : 'text-neutral-700 hover:text-[#0A0A0A] hover:bg-neutral-900/5 hover:-translate-y-0.5'
                }`
              : `nav-link-hover px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'active text-white bg-white/20 backdrop-blur-md shadow-2xs'
                    : 'text-white/90 hover:text-white hover:bg-white/15 hover:-translate-y-0.5'
                }`;

            const iconClass = isOverRedSection
              ? (isActive ? 'text-[#E5383B]' : 'text-neutral-500')
              : (isActive ? 'text-amber-300' : 'text-white/80');

            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className={linkClass}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 ${iconClass}`} />
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* 3. RIGHT CTAs (DESKTOP) */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="tel:+918791218377"
            className={`hidden xl:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              isOverRedSection 
                ? 'text-neutral-700 hover:text-black hover:bg-neutral-900/5' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <PhoneCall className={`w-3.5 h-3.5 ${isOverRedSection ? 'text-[#E5383B]' : 'text-amber-300'}`} />
            <span>+91 87912 18377</span>
          </a>

          <button
            type="button"
            onClick={() => {
              navigate('/contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm ${
              isOverRedSection
                ? 'bg-[#E5383B] text-white hover:bg-neutral-950 hover:text-white shadow-[#E5383B]/25'
                : 'bg-white text-[#E5383B] hover:bg-neutral-950 hover:text-[#FFD700] shadow-black/20'
            }`}
          >
            <Mail className="w-4 h-4 group-hover:rotate-12 transition-all" />
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4. MOBILE HAMBURGER TOGGLE */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigate('/contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black shadow-sm ${
              isOverRedSection
                ? 'bg-[#E5383B] text-white'
                : 'bg-white text-[#E5383B]'
            }`}
          >
            Contact
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl transition-all ${
              isOverRedSection
                ? 'text-[#0A0A0A] hover:bg-neutral-900/5'
                : 'text-white hover:bg-white/15'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      {mobileMenuOpen && (
        <div 
          className={`md:hidden mt-2 px-4 py-3 shadow-2xl flex flex-col gap-1 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 ${
            isOverRedSection
              ? 'bg-white/95 border-t border-neutral-200/90 text-[#0A0A0A]'
              : 'bg-[#C1121F]/95 border-t border-white/20 text-white'
          }`}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-all ${
                  isOverRedSection
                    ? (isActive ? 'bg-[#E5383B]/10 text-[#E5383B]' : 'text-neutral-700 hover:bg-neutral-100')
                    : (isActive ? 'bg-white/25 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white')
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {link.label}
                </span>
                {isActive && (
                  <span className={`w-2 h-2 rounded-full ${isOverRedSection ? 'bg-[#E5383B]' : 'bg-amber-300'}`} />
                )}
              </a>
            );
          })}

          <div className="pt-3 mt-1 border-t border-neutral-200/20 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                isOverRedSection
                  ? 'bg-[#E5383B] text-white'
                  : 'bg-white text-[#E5383B]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us (+91 87912 18377)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
