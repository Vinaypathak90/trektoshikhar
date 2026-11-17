import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  Filter, 
  Compass, 
  RotateCcw
} from 'lucide-react';
import { TREKS } from '../data/treksData';
import TrekCard from './TrekCard';
import GoogleReviewsMarquee from './GoogleReviewsMarquee';

export default function AllTreksPage({ onBackToHome, onSelectTrek, onBookTrek }) {
  const navigate = useNavigate();
  const handleBack = onBackToHome || (() => navigate('/'));
  const handleSelect = onSelectTrek || ((trek) => navigate(`/track/${trek.slug}`));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  // Filter & Sort Logic
  const filteredTreks = useMemo(() => {
    return TREKS.filter(trek => {
      // Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        trek.title.toLowerCase().includes(query) ||
        trek.location.toLowerCase().includes(query) ||
        trek.baseCamp.toLowerCase().includes(query) ||
        trek.altitude.toLowerCase().includes(query);

      // Region Filter
      const matchesRegion = selectedRegion === 'all' || trek.region === selectedRegion;

      // Difficulty Filter
      const matchesDifficulty = selectedDifficulty === 'all' || 
        trek.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase());

      return matchesSearch && matchesRegion && matchesDifficulty;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'altitude-desc') {
        const altA = parseInt(a.altitude.replace(/\D/g, ''), 10) || 0;
        const altB = parseInt(b.altitude.replace(/\D/g, ''), 10) || 0;
        return altB - altA;
      }
      return 0; // 'recommended' uses default order
    });
  }, [searchQuery, selectedRegion, selectedDifficulty, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedDifficulty('all');
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24 text-[#0A0A0A] selection:bg-[#E5383B] selection:text-white pt-24 sm:pt-28">
      
      {/* Top Banner / Breadcrumb Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        
        {/* Back Link */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-[#E5383B] transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Page Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Full Himalayan Expedition Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-outfit text-[#0A0A0A] tracking-tight">
              All Mountain Treks
            </h1>
            <p className="text-neutral-500 text-sm sm:text-base mt-2 max-w-2xl">
              Curated summit expeditions and weekend ridge walks across Shimla and Dehradun. Filter by region, difficulty, or search specific peaks.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-bold text-neutral-600 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-2xs">
              Showing <strong className="text-[#E5383B]">{filteredTreks.length}</strong> of {TREKS.length} Treks
            </span>
          </div>
        </div>

      </div>

      {/* ====================================================================
          SEARCH & INTERACTIVE FILTERS BAR
         ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-neutral-200/90 space-y-4">
          
          {/* Top Row: Search Input & Region Tabs */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by trek name, base camp, or peak (e.g. Kedarkantha, Sankri, 12000 ft)..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 bg-neutral-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-black cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Region Filter Tabs */}
            <div className="inline-flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200/80 text-xs font-bold shrink-0 shadow-2xs overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: 'All Treks' },
                { id: 'dehradun', label: 'Dehradun Base' },
                { id: 'shimla', label: 'Shimla Base' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRegion(tab.id)}
                  className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedRegion === tab.id
                      ? 'bg-white text-[#E5383B] shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          {/* Bottom Row: Difficulty, Sort, and Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-500">Difficulty:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-neutral-800 font-semibold focus:outline-none focus:border-[#E5383B] cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-500">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-neutral-800 font-semibold focus:outline-none focus:border-[#E5383B] cursor-pointer"
                >
                  <option value="recommended">Featured / Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="altitude-desc">Highest Altitude</option>
                </select>
              </div>
            </div>

            {/* Reset Filters Link */}
            {(searchQuery || selectedRegion !== 'all' || selectedDifficulty !== 'all' || sortBy !== 'recommended') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* ====================================================================
          TREKS GRID (EXACT REFERENCE SCREENSHOT CARD STYLE WITH ZOOM & SHADOW)
         ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {filteredTreks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTreks.map((trek) => (
              <TrekCard 
                key={trek.id}
                trek={trek}
                onSelectTrek={handleSelect}
                onBookTrek={onBookTrek}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 shadow-sm max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-[#E5383B] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-black text-xl text-[#0A0A0A]">
              No Treks Found
            </h3>
            <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
              No expeditions matched your search query or selected filters. Try broadening your keywords or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5383B] text-white text-xs font-bold hover:bg-[#c92a2a] transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* ====================================================================
          NEW PREMIUM CONTINUOUS ANIMATED GOOGLE REVIEWS SECTION
          (Placed directly below Trek Listing section)
         ==================================================================== */}
      <div className="mt-20">
        <GoogleReviewsMarquee />
      </div>

    </div>
  );
}
