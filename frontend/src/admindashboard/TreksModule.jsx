import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  MapPin, 
  Clock, 
  Mountain, 
  Check, 
  X, 
  Calendar, 
  DollarSign, 
  Compass, 
  ChevronRight,
  ExternalLink,
  Layers,
  Copy,
  Sparkles,
  CheckCircle2,
  XCircle,
  Package,
  Image as ImageIcon,
  List,
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import { TREKS as FALLBACK_TREKS } from '../data/treksData';
import { getTreks, createTrek, updateTrek, deleteTrek } from '../lib/trekApi';

const DEFAULT_BASE_REGIONS = [
  { id: 'dehradun', label: 'Dehradun Base (Uttarakhand)', shortLabel: 'Dehradun Base' },
  { id: 'shimla', label: 'Shimla Base (Himachal)', shortLabel: 'Shimla Base' }
];

const STORAGE_CUSTOM_REGIONS_KEY = 'tts_custom_regions_v1';

export default function TreksModule() {
  const [treksList, setTreksList] = useState(FALLBACK_TREKS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [editingTrek, setEditingTrek] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTabInModal, setActiveTabInModal] = useState('basic');
  const [toastMessage, setToastMessage] = useState('');
  const [newHeroImgUrl, setNewHeroImgUrl] = useState('');

  // Dynamic Custom Regions State (persisted in localStorage + aggregated with db treks)
  const [customRegions, setCustomRegions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_REGIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isAddingNewRegion, setIsAddingNewRegion] = useState(false);
  const [newRegionInput, setNewRegionInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Combined list of built-in + custom-added + database distinct regions
  const allAvailableRegions = useMemo(() => {
    const map = new Map();
    // 1. Built-in defaults
    DEFAULT_BASE_REGIONS.forEach(r => map.set(r.id.toLowerCase(), r));

    // 2. Saved custom regions from localStorage
    (customRegions || []).forEach(r => {
      if (r && r.id) {
        const idLower = r.id.toLowerCase().trim();
        map.set(idLower, {
          id: idLower,
          label: r.label || `${idLower.charAt(0).toUpperCase() + idLower.slice(1)} Base`,
          shortLabel: r.shortLabel || r.label || `${idLower.charAt(0).toUpperCase() + idLower.slice(1)} Base`,
          isCustom: true
        });
      }
    });

    // 3. Any distinct regions present in treksList
    (treksList || []).forEach(t => {
      if (t.region) {
        const regId = t.region.toLowerCase().trim();
        if (!map.has(regId)) {
          const pretty = regId.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          const displayLabel = pretty.toLowerCase().includes('base') ? pretty : `${pretty} Base`;
          map.set(regId, {
            id: regId,
            label: displayLabel,
            shortLabel: displayLabel
          });
        }
      }
    });

    return Array.from(map.values());
  }, [customRegions, treksList]);

  // Helper to add a new custom region
  const handleAddCustomRegion = (customInput) => {
    const trimmed = (customInput || '').trim();
    if (!trimmed) return null;

    // Generate safe clean slug ID
    let generatedId = trimmed
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .replace(/base/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!generatedId) {
      generatedId = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Nicely formatted labels
    let label = trimmed;
    if (!label.toLowerCase().includes('base')) {
      label = `${trimmed} Base`;
    }
    const shortLabel = label.replace(/\(.*?\)/g, '').trim() || label;

    const newRegionObj = {
      id: generatedId,
      label,
      shortLabel,
      isCustom: true
    };

    const updated = [...(customRegions || []).filter(r => r.id !== generatedId), newRegionObj];
    setCustomRegions(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_REGIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save custom region:', e);
    }

    // Set form region and close input
    setFormData(prev => ({ ...prev, region: generatedId }));
    setIsAddingNewRegion(false);
    setNewRegionInput('');
    showToast(`Region "${label}" added to dropdown & selected!`);
    return generatedId;
  };

  // Helper to remove custom region
  const handleRemoveCustomRegion = (regionId, e) => {
    if (e) e.stopPropagation();
    const updated = (customRegions || []).filter(r => r.id !== regionId);
    setCustomRegions(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_REGIONS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not update custom regions:', err);
    }
    if (formData.region === regionId) {
      setFormData(prev => ({ ...prev, region: 'dehradun' }));
    }
    showToast('Custom region removed from dropdown');
  };

  const formatRegionBadge = (reg) => {
    if (!reg) return 'DEHRADUN BASE';
    const found = allAvailableRegions.find(r => r.id.toLowerCase() === reg.toLowerCase());
    if (found) {
      const raw = (found.shortLabel || found.label).toUpperCase();
      return raw.includes('BASE') ? raw : `${raw} BASE`;
    }
    const clean = reg.replace(/[-_]/g, ' ').toUpperCase();
    return clean.includes('BASE') ? clean : `${clean} BASE`;
  };

  // Fetch treks from API
  const loadTreksFromApi = async () => {
    setIsLoading(true);
    try {
      const res = await getTreks({ admin: true });
      if (res && res.treks && res.treks.length > 0) {
        setTreksList(res.treks);
      }
    } catch (err) {
      console.warn('API fetch failed, retaining fallback treks:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTreksFromApi();
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

  // Filtered Treks
  const filteredTreks = treksList.filter(t => {
    const query = searchQuery.toLowerCase().trim();
    const titleMatch = t.title && t.title.toLowerCase().includes(query);
    const locMatch = t.location && t.location.toLowerCase().includes(query);
    const baseMatch = (t.baseCamp || t.base_camp) && (t.baseCamp || t.base_camp).toLowerCase().includes(query);
    const altMatch = t.altitude && t.altitude.toLowerCase().includes(query);
    const matchesSearch = !query || titleMatch || locMatch || baseMatch || altMatch;
    const matchesRegion = selectedRegion === 'all' || (t.region && t.region.toLowerCase() === selectedRegion.toLowerCase());
    return matchesSearch && matchesRegion;
  });

  // Modal Form State Template
  const initialForm = {
    title: '',
    slug: '',
    tagline: '',
    region: 'dehradun',
    location: 'Dehradun / Mussoorie Base',
    baseCamp: 'Pantwari Village',
    route: 'Dehradun to Dehradun',
    duration: '2 Days / 1 Night',
    altitude: '9,915 ft',
    difficulty: 'Easy - Moderate',
    grade: 'Beginner Friendly',
    distance: '16 km Total Trek',
    bestSeason: 'Oct – May (Snow in Dec–Feb)',
    price: 2499,
    originalPrice: 3499,
    tag: 'Best for Beginners',
    rating: 4.9,
    reviewsCount: 120,
    heroImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1920&q=85'
    ],
    overview: 'Perched at 9,915 ft, offering sweeping 360-degree views of Himalayan ranges.',
    whyMustDo: [
      { title: 'Spectacular 360° Garhwal Panorama', desc: 'Gaze directly at Himalayan giants including Swargarohini and Bandarpoonch.' },
      { title: 'Dense Oak & Rhododendron Canopies', desc: 'Walk through ancient moss-draped forest trails that bloom in spring and turn into snow wonderland.' }
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Drive Dehradun to Pantwari & Trek to Base Camp',
        distance: '85 km Drive + 4.5 km Trek',
        altitude: 'Pantwari (4,640 ft) to Base Camp (7,600 ft)',
        time: '3.5 hrs drive + 4 hrs trek',
        highlights: 'Kempty Falls drive, oak forests, sunset over Shivalik ranges.',
        stay: '4-Season Alpine Dome Tents at Base Camp',
        meals: 'Packed Lunch, Evening Mountain Snacks & Hot Dinner'
      },
      {
        day: 'Day 2',
        title: 'Summit Push to Nag Tibba & Descent to Pantwari',
        distance: '3.5 km Summit Trek + 8 km Descent',
        altitude: 'Base Camp (7,600 ft) to Summit (9,915 ft)',
        time: '6 hrs trek + 3.5 hrs drive',
        highlights: 'Early sunrise at summit, Himalayan ridge walk, Nag Devta temple.',
        stay: 'Expedition ends at Dehradun Railway Station',
        meals: 'Early Morning Tea, Summit Packed Breakfast & Hot Lunch'
      }
    ],
    packages: [
      {
        name: 'Pantwari to Pantwari',
        price: 2499,
        badge: 'Most Popular',
        desc: 'Ideal if you have your own vehicle or are joining directly at base camp.',
        duration: '2 Days / 1 Night',
        includes: ['All meals on trek', 'Dome tents & sleeping bags', 'NIM certified guide', 'Forest permits & safety kit']
      },
      {
        name: 'Dehradun to Dehradun',
        price: 3499,
        badge: 'All-Inclusive Transport',
        desc: 'Includes round-trip private shared transport from Dehradun Railway Station.',
        duration: '2 Days / 1 Night',
        includes: ['Shared pickup & drop from Dehradun', 'All meals on trek', 'Dome tents & sleeping bags', 'NIM guide & forest permits']
      }
    ],
    inclusions: [
      'Certified Wilderness First Responder (NIM / ABVIMAS) trek leader',
      'High-altitude 4-season waterproof dome tents on twin/triple sharing',
      'Sub-zero thermal sleeping bags (-10°C rated) and insulated foam mats',
      'All freshly prepared vegetarian meals (Day 1 Lunch to Day 2 Lunch)',
      'Medical first-aid box, portable pulse oximeter, and emergency oxygen cylinder',
      'Forest entry permits, camping fees, and sanctuary clearance'
    ],
    exclusions: [
      'Transport from home city to Dehradun / Pantwari',
      'Personal backpack offloading on mules',
      'Personal trekking gear',
      'Emergency evacuation charges and personal travel insurance'
    ],
    gearList: [
      'Ankle-support trekking shoes with good grip',
      'Warm down jacket and thermal base layers',
      'Waterproof windcheater / poncho',
      'UV-protective polarized sunglasses',
      '2 water bottles (1 liter each)',
      'Headlamp or LED flashlight with extra batteries'
    ],
    isActive: true,
    isFeatured: true
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingTrek(null);
    setIsAddingNewRegion(false);
    setNewRegionInput('');
    setFormData({
      ...initialForm,
      slug: `trek-${Date.now().toString(36)}`
    });
    setActiveTabInModal('basic');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trek) => {
    setEditingTrek(trek);
    setIsAddingNewRegion(false);
    setNewRegionInput('');
    setFormData({
      title: trek.title || '',
      slug: trek.slug || '',
      tagline: trek.tagline || trek.heroTagline || '',
      region: trek.region || 'dehradun',
      location: trek.location || '',
      baseCamp: trek.baseCamp || trek.base_camp || '',
      route: trek.route || 'Base to Base',
      duration: trek.duration || '',
      altitude: trek.altitude || '',
      difficulty: trek.difficulty || 'Easy',
      grade: trek.grade || 'Beginner Friendly',
      distance: trek.distance || '',
      bestSeason: trek.bestSeason || trek.best_season || 'Oct – May',
      price: trek.price || 0,
      originalPrice: trek.originalPrice || trek.original_price || null,
      tag: trek.tag || 'Best for Beginners',
      rating: trek.rating || 4.9,
      reviewsCount: trek.reviewsCount || trek.reviews_count || 120,
      heroImages: trek.heroImages || trek.hero_images || [trek.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85'],
      overview: trek.overview || '',
      whyMustDo: trek.whyMustDo || trek.why_must_do || [],
      itinerary: trek.itinerary || [],
      packages: trek.packages || [],
      inclusions: trek.inclusions || [],
      exclusions: trek.exclusions || [],
      gearList: trek.gearList || trek.gear_list || [],
      isActive: trek.isActive ?? trek.is_active ?? true,
      isFeatured: trek.isFeatured ?? trek.is_featured ?? true
    });
    setActiveTabInModal('basic');
    setIsModalOpen(true);
  };

  // Save Trek handler
  const handleSaveTrek = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.price) {
      alert("Please provide Title, Slug, and Starting Price.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingTrek) {
        const targetId = (editingTrek.id && String(editingTrek.id).includes('-')) 
          ? editingTrek.id 
          : (editingTrek.slug || formData.slug || editingTrek.id);

        const updated = await updateTrek(targetId, formData);
        setTreksList(prev => prev.map(t => (t.id === editingTrek.id || t.slug === editingTrek.slug || t.id === updated.id) ? updated : t));
        showToast(`Trek "${formData.title}" saved & updated live in database!`);
      } else {
        const created = await createTrek(formData);
        setTreksList(prev => [created, ...prev]);
        showToast(`New trek "${formData.title}" created & saved to database!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save trek:', err);
      if (editingTrek) {
        setTreksList(prev => prev.map(t => t.id === editingTrek.id ? { ...formData, id: editingTrek.id } : t));
        showToast(`Trek updated locally`);
      } else {
        setTreksList(prev => [{ ...formData, id: Date.now().toString() }, ...prev]);
        showToast(`Trek added locally`);
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Trek
  const handleDeleteTrek = async (id, title, slug) => {
    if (!window.confirm(`Are you sure you want to permanently delete trek "${title}"?`)) return;

    try {
      const targetId = (id && String(id).includes('-')) ? id : (slug || id);
      await deleteTrek(targetId);
      setTreksList(prev => prev.filter(t => t.id !== id && t.slug !== slug));
      showToast(`Trek "${title}" deleted from database.`);
    } catch (err) {
      console.error('Failed to delete trek:', err);
      setTreksList(prev => prev.filter(t => t.id !== id && t.slug !== slug));
      showToast(`Trek "${title}" removed.`);
    }
  };

  // Hero Images handlers
  const handleAddHeroImage = () => {
    if (!newHeroImgUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      heroImages: [...prev.heroImages, newHeroImgUrl.trim()]
    }));
    setNewHeroImgUrl('');
  };

  const handleRemoveHeroImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      heroImages: prev.heroImages.filter((_, i) => i !== idx)
    }));
  };

  // Itinerary handlers
  const handleAddItineraryDay = () => {
    const nextDayNum = formData.itinerary.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: `Day ${nextDayNum}`,
          title: `Day ${nextDayNum} Route`,
          distance: '5 km',
          altitude: '9,000 ft',
          time: '4-5 hrs',
          highlights: 'Scenic ridge walk and alpine views.',
          stay: 'Alpine Dome Tents',
          meals: 'Packed Lunch & Hot Dinner'
        }
      ]
    }));
  };

  const handleRemoveItineraryDay = (index) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    const updated = [...formData.itinerary];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };

  // Why Must Do handlers
  const handleAddWhyFeature = () => {
    setFormData(prev => ({
      ...prev,
      whyMustDo: [
        ...prev.whyMustDo,
        { title: 'New Mountain Highlight', desc: 'Detailed vista description.' }
      ]
    }));
  };

  const handleRemoveWhyFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      whyMustDo: prev.whyMustDo.filter((_, i) => i !== index)
    }));
  };

  const handleWhyFeatureChange = (index, field, value) => {
    const updated = [...formData.whyMustDo];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, whyMustDo: updated }));
  };

  // Packages handlers
  const handleAddPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          name: 'Base to Base Package',
          price: 2999,
          badge: 'Batch Option',
          desc: 'All-inclusive meals and alpine stay.',
          duration: formData.duration || '2 Days / 1 Night',
          includes: ['All meals on trek', 'Dome tents & sleeping bags', 'Certified guide']
        }
      ]
    }));
  };

  const handleRemovePackage = (index) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
    }));
  };

  const handlePackageChange = (index, field, value) => {
    const updated = [...formData.packages];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, packages: updated }));
  };

  // String lists handlers
  const handleAddStringItem = (arrayField, defaultText) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: [...prev[arrayField], defaultText]
    }));
  };

  const handleRemoveStringItem = (arrayField, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_, i) => i !== index)
    }));
  };

  const handleStringItemChange = (arrayField, index, value) => {
    const updated = [...formData[arrayField]];
    updated[index] = value;
    setFormData(prev => ({ ...prev, [arrayField]: updated }));
  };

  return (
    <div className="space-y-6 animate-editorial-fade max-w-full">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-[#E5383B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Module 2 • Supabase Treks &amp; Expeditions Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[#0A0A0A] tracking-tight">
            Treks &amp; Expeditions Manager
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Manage mountain itineraries, Cloudinary carousel slides, day-wise trail schedules, batch packages, and packing checklists.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={loadTreksFromApi}
            disabled={isLoading}
            className="p-3 rounded-2xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition cursor-pointer"
            title="Reload from Database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#E5383B]' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-950 hover:from-neutral-950 hover:to-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Mountain Trek</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Search & Region Filter */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by trek name, altitude, or base camp..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-neutral-50/50"
          />
        </div>

        <div className="inline-flex p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs font-bold shrink-0 self-start sm:self-auto overflow-x-auto max-w-full scrollbar-none">
          {[
            { id: 'all', label: `All (${treksList.length})` },
            ...allAvailableRegions.map(reg => {
              const count = treksList.filter(t => (t.region || '').toLowerCase() === reg.id.toLowerCase()).length;
              return {
                id: reg.id,
                label: `${reg.shortLabel || reg.label}${count > 0 ? ` (${count})` : ''}`
              };
            })
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
                selectedRegion === tab.id ? 'bg-white text-[#E5383B] shadow-2xs font-black' : 'text-neutral-600 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Treks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTreks.map((trek) => {
          const thumb = (trek.heroImages && trek.heroImages[0]) || (trek.hero_images && trek.hero_images[0]) || trek.image;
          const base = trek.baseCamp || trek.base_camp || 'Mountain Base';
          const price = trek.price || 0;
          return (
            <div 
              key={trek.id}
              className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-[#E5383B]/40 transition-all duration-300 group"
            >
              <div>
                {/* Thumbnail with Overlays */}
                <div className="relative h-44 overflow-hidden bg-neutral-100">
                  <img 
                    src={thumb} 
                    alt={trek.title} 
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    {formatRegionBadge(trek.region)}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-gradient-to-r from-[#E5383B] to-[#C92A2A] text-white text-xs font-black px-3 py-1 rounded-xl shadow-md">
                    ₹{Number(price).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <span className="text-[10px] font-black uppercase text-[#E5383B] tracking-wider block mb-1">
                    {trek.tag || 'Certified Expedition'}
                  </span>
                  <h4 className="font-outfit font-black text-lg text-[#0A0A0A] leading-snug line-clamp-1 mb-1">
                    {trek.title}
                  </h4>
                  {(trek.tagline || trek.heroTagline) && (
                    <p className="font-satisfy text-sm text-amber-600 line-clamp-1 mb-2">
                      {trek.tagline || trek.heroTagline}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{trek.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{trek.altitude}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400 mt-2 truncate">
                    📍 Base: {base}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3.5 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between">
                <a
                  href={`/track/${trek.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1 transition-colors"
                >
                  <span>Live Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(trek)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTrek(trek.id, trek.title, trek.slug)}
                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition cursor-pointer"
                    title="Delete Trek"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ====================================================================
          MODAL: MODERN SLICK CENTERED EXPEDITION EDITOR (NEVER CLIPPED)
         ==================================================================== */}
      {isModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl w-full max-w-4xl h-[88vh] max-h-[760px] shadow-2xl border border-neutral-200/90 flex flex-col overflow-hidden animate-editorial-fade"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* 1. STICKY MODAL HEADER */}
            <div className="px-5 sm:px-7 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E5383B] block">
                  Trek CMS &amp; Expedition Customizer
                </span>
                <h3 className="font-outfit font-black text-lg sm:text-xl text-[#0A0A0A]">
                  {editingTrek ? `Edit: ${editingTrek.title}` : 'Add New Mountain Expedition'}
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

            {/* 2. MODERN PILL TABS BAR */}
            <div className="px-5 sm:px-7 py-2.5 bg-neutral-50/90 border-b border-neutral-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              {[
                { id: 'basic', label: '1. Basic Info & Pricing' },
                { id: 'header', label: '2. Media & Header Slides' },
                { id: 'itinerary', label: `3. Itinerary (${formData.itinerary.length} Days)` },
                { id: 'why', label: `4. Why This Trek? (${formData.whyMustDo.length})` },
                { id: 'packages', label: `5. Packages (${formData.packages.length})` },
                { id: 'checklist', label: `6. Inclusions & Exclusions & Gear (${formData.inclusions.length + formData.exclusions.length + formData.gearList.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabInModal(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTabInModal === tab.id
                      ? 'bg-[#E5383B] text-white shadow-xs font-black'
                      : 'text-neutral-600 hover:text-black hover:bg-white/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 3. SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveTrek} id="trek-modal-form" className="px-5 sm:px-7 py-5 overflow-y-auto flex-1 space-y-5 bg-neutral-50/40">
              
              {/* TAB 1: BASIC INFO & ATTRIBUTES */}
              {activeTabInModal === 'basic' && (
                <div className="space-y-4 animate-editorial-fade">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Trek Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Nag Tibba Weekend Trek"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] focus:outline-none bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">URL Slug (Unique Route) *</label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                        placeholder="e.g. nag-tibba-weekend-trek"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] focus:outline-none bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-neutral-700">Base Region *</label>
                        {!isAddingNewRegion ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNewRegion(true);
                              setNewRegionInput('');
                            }}
                            className="text-[11px] font-bold text-[#E5383B] hover:text-[#C92A2A] hover:underline cursor-pointer inline-flex items-center gap-1"
                            title="Type and add a new custom region"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Type New Region</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNewRegion(false);
                              setNewRegionInput('');
                            }}
                            className="text-[11px] font-bold text-neutral-500 hover:text-neutral-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {!isAddingNewRegion ? (
                        <div className="relative">
                          <select
                            value={formData.region}
                            onChange={(e) => {
                              if (e.target.value === '__ADD_NEW__') {
                                setIsAddingNewRegion(true);
                                setNewRegionInput('');
                              } else {
                                setFormData(p => ({ ...p, region: e.target.value }));
                              }
                            }}
                            className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] focus:outline-none bg-white font-semibold cursor-pointer appearance-none"
                          >
                            {allAvailableRegions.map(reg => (
                              <option key={reg.id} value={reg.id}>
                                {reg.label}
                              </option>
                            ))}
                            <option disabled value="">──────────────</option>
                            <option value="__ADD_NEW__" className="font-bold text-[#E5383B]">
                              ➕ + Add New Custom Region...
                            </option>
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 p-2 rounded-xl bg-neutral-50 border border-[#E5383B]/40 animate-fadeIn">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              autoFocus
                              value={newRegionInput}
                              onChange={(e) => setNewRegionInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (newRegionInput.trim()) {
                                    handleAddCustomRegion(newRegionInput);
                                  }
                                } else if (e.key === 'Escape') {
                                  setIsAddingNewRegion(false);
                                  setNewRegionInput('');
                                }
                              }}
                              placeholder="e.g. Manali Base (Himachal)"
                              className="flex-1 px-3 py-1.5 rounded-lg border-2 border-[#E5383B] text-xs sm:text-sm focus:outline-none bg-white font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newRegionInput.trim()) {
                                  alert('Please enter a region name (e.g. Manali Base (Himachal))');
                                  return;
                                }
                                handleAddCustomRegion(newRegionInput);
                              }}
                              className="px-3 py-2 rounded-lg bg-[#E5383B] hover:bg-[#C92A2A] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0 inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingNewRegion(false);
                                setNewRegionInput('');
                              }}
                              className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-100 text-xs font-bold transition cursor-pointer shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-neutral-500 leading-tight">
                            Type name &amp; press Enter. It will be added to the dropdown permanently!
                          </p>
                          {customRegions && customRegions.length > 0 && (
                            <div className="pt-1.5 border-t border-neutral-200/70 flex flex-wrap items-center gap-1 text-[10px]">
                              <span className="text-neutral-400">Custom added:</span>
                              {customRegions.map(cr => (
                                <span
                                  key={cr.id}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 font-medium"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData(p => ({ ...p, region: cr.id }));
                                      setIsAddingNewRegion(false);
                                    }}
                                    className="hover:text-[#E5383B] cursor-pointer"
                                  >
                                    {cr.shortLabel || cr.label}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleRemoveCustomRegion(cr.id, e)}
                                    className="text-neutral-400 hover:text-red-600 cursor-pointer ml-0.5"
                                    title="Delete from custom list"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Starting Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData(p => ({ ...p, price: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Original Price (₹)</label>
                      <input
                        type="number"
                        value={formData.originalPrice || ''}
                        onChange={(e) => setFormData(p => ({ ...p, originalPrice: e.target.value ? Number(e.target.value) : null }))}
                        placeholder="e.g. 3499"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Summit Altitude</label>
                      <input
                        type="text"
                        value={formData.altitude}
                        onChange={(e) => setFormData(p => ({ ...p, altitude: e.target.value }))}
                        placeholder="e.g. 9,915 ft"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData(p => ({ ...p, duration: e.target.value }))}
                        placeholder="e.g. 2 Days / 1 Night"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Difficulty Level</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData(p => ({ ...p, difficulty: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white cursor-pointer"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Easy - Moderate">Easy - Moderate</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Moderate - Difficult">Moderate - Difficult</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Base Camp</label>
                      <input
                        type="text"
                        value={formData.baseCamp}
                        onChange={(e) => setFormData(p => ({ ...p, baseCamp: e.target.value }))}
                        placeholder="e.g. Pantwari Village"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Total Trail Distance</label>
                      <input
                        type="text"
                        value={formData.distance}
                        onChange={(e) => setFormData(p => ({ ...p, distance: e.target.value }))}
                        placeholder="e.g. 16 km Total Trek"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={formData.tag}
                        onChange={(e) => setFormData(p => ({ ...p, tag: e.target.value }))}
                        placeholder="e.g. Best for Beginners"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.checked }))}
                        className="w-4 h-4 text-[#E5383B] rounded focus:ring-[#E5383B]"
                      />
                      <span className="text-xs font-bold text-neutral-700">Active (Visible on Website)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData(p => ({ ...p, isFeatured: e.target.checked }))}
                        className="w-4 h-4 text-[#E5383B] rounded focus:ring-[#E5383B]"
                      />
                      <span className="text-xs font-bold text-neutral-700">Featured on Homepage</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: HEADER BANNER & CLOUDINARY SLIDES */}
              {activeTabInModal === 'header' && (
                <div className="space-y-4 animate-editorial-fade">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Golden Cursive Subtitle / Tagline *
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData(p => ({ ...p, tagline: e.target.value }))}
                      placeholder="e.g. The Serpent's Peak — Best Snow Weekend Trek Near Dehradun"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-white"
                    />
                    {formData.tagline && (
                      <p className="font-satisfy text-lg text-amber-600 mt-1">
                        Preview: {formData.tagline}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Overview Description Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={formData.overview}
                      onChange={(e) => setFormData(p => ({ ...p, overview: e.target.value }))}
                      placeholder="Nag Tibba ('Serpent's Peak') is the highest peak in the lower Garhwal Himalayas..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none resize-none bg-white"
                    />
                  </div>

                  {/* Cloudinary Images List */}
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-neutral-700">
                        Header Slider Images ({formData.heroImages.length} Slides)
                      </label>
                      <span className="text-[11px] text-neutral-400">First image is the card thumbnail</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newHeroImgUrl}
                        onChange={(e) => setNewHeroImgUrl(e.target.value)}
                        placeholder="Paste Cloudinary / Unsplash image URL..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono focus:border-[#E5383B] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddHeroImage}
                        className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-[#E5383B] transition cursor-pointer"
                      >
                        Add Slide
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {formData.heroImages.map((imgUrl, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden border border-neutral-200 aspect-video bg-black">
                          <img src={imgUrl} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <span className="text-[10px] text-white font-bold bg-black/50 px-2 py-0.5 rounded">
                              #{i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveHeroImage(i)}
                              className="p-1 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                              title="Remove slide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DAY-BY-DAY ITINERARY */}
              {activeTabInModal === 'itinerary' && (
                <div className="space-y-4 animate-editorial-fade">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-700">Detailed Day-by-Day Route Itinerary</span>
                      <p className="text-[11px] text-neutral-400">Expandable trail cards on the public page</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddItineraryDay}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-[#E5383B] transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Day</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.itinerary.map((dayItem, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={dayItem.day}
                            onChange={(e) => handleItineraryChange(idx, 'day', e.target.value)}
                            className="px-3 py-1 rounded-lg bg-[#E5383B] text-white text-xs font-black uppercase w-24 text-center"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveItineraryDay(idx)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                          >
                            Remove Day
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={dayItem.title}
                            onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                            placeholder="Day Route Title"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold focus:border-[#E5383B]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={dayItem.distance}
                            onChange={(e) => handleItineraryChange(idx, 'distance', e.target.value)}
                            placeholder="Distance (e.g. 85 km Drive + 4 km Trek)"
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                          />
                          <input
                            type="text"
                            value={dayItem.altitude}
                            onChange={(e) => handleItineraryChange(idx, 'altitude', e.target.value)}
                            placeholder="Altitude Profile"
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                          />
                          <input
                            type="text"
                            value={dayItem.time}
                            onChange={(e) => handleItineraryChange(idx, 'time', e.target.value)}
                            placeholder="Estimated Time (e.g. 4-5 hrs)"
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                              Night Stay / Accommodation
                            </span>
                            <input
                              type="text"
                              value={dayItem.stay || ''}
                              onChange={(e) => handleItineraryChange(idx, 'stay', e.target.value)}
                              placeholder="e.g. 4-Season Dome Tents / Homestay in Nainital"
                              className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium focus:border-[#E5383B]"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                              Meals Included
                            </span>
                            <input
                              type="text"
                              value={dayItem.meals || ''}
                              onChange={(e) => handleItineraryChange(idx, 'meals', e.target.value)}
                              placeholder="e.g. Breakfast, Packed Lunch & Hot Dinner"
                              className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium focus:border-[#E5383B]"
                            />
                          </div>
                        </div>

                        <div>
                          <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                            Key Trail Highlights
                          </span>
                          <textarea
                            rows={2}
                            value={dayItem.highlights}
                            onChange={(e) => handleItineraryChange(idx, 'highlights', e.target.value)}
                            placeholder="Key trail highlights, waterfalls, forest walks, temple arti..."
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: WHY THIS TREK */}
              {activeTabInModal === 'why' && (
                <div className="space-y-4 animate-editorial-fade">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-700">Mountain Essence / Why Must-Do Cards</span>
                      <p className="text-[11px] text-neutral-400">Renders as numbered 3D cards</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddWhyFeature}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-[#E5383B] transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Feature Card</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.whyMustDo.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#E5383B]">Card #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveWhyFeature(idx)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleWhyFeatureChange(idx, 'title', e.target.value)}
                          placeholder="Feature Headline"
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold focus:border-[#E5383B]"
                        />
                        <textarea
                          rows={2}
                          value={item.desc}
                          onChange={(e) => handleWhyFeatureChange(idx, 'desc', e.target.value)}
                          placeholder="Rich mountain description..."
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs resize-none focus:border-[#E5383B]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PACKAGES & PRICING */}
              {activeTabInModal === 'packages' && (
                <div className="space-y-4 animate-editorial-fade">
                  
                  {/* Top Bar Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5383B] to-[#990000] text-white flex items-center justify-center shadow-xs shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                            Expedition Packages &amp; Pricing Tiers
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-neutral-100 text-neutral-700 border border-neutral-200">
                            {formData.packages.length} {formData.packages.length === 1 ? 'Tier' : 'Tiers'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                          Multi-tier pricing, inclusions, and custom batch badges for this trek.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddPackage}
                      className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-extrabold transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Package Tier</span>
                    </button>
                  </div>

                  {/* Empty State */}
                  {formData.packages.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-white border-2 border-dashed border-neutral-200 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                        <Package className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-neutral-700">No package tiers configured</p>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                        Click &ldquo;Add Package Tier&rdquo; to add Base-to-Base, Transit Included, or Custom Group packages.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddPackage}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5383B] text-white text-xs font-bold hover:bg-[#C92A2A] transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create First Tier</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.packages.map((pkg, idx) => (
                        <div 
                          key={idx} 
                          className="rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-sm transition-all overflow-hidden"
                        >
                          {/* Tier Card Header */}
                          <div className="px-4 sm:px-5 py-3 bg-neutral-50/90 border-b border-neutral-200/80 flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white shrink-0 shadow-2xs">
                                Tier #{idx + 1}
                              </span>
                              <span className="font-outfit font-black text-sm text-neutral-900 truncate">
                                {pkg.name || `Package Tier ${idx + 1}`}
                              </span>
                              {pkg.price ? (
                                <span className="text-xs font-black text-[#E5383B] bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg shrink-0">
                                  ₹{Number(pkg.price).toLocaleString('en-IN')}
                                </span>
                              ) : null}
                              {pkg.badge && (
                                <span className="hidden sm:inline-block text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full truncate shrink-0">
                                  {pkg.badge}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemovePackage(idx)}
                              className="px-2.5 py-1.5 rounded-xl text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 text-xs font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer shrink-0"
                              title="Delete this package tier"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Remove</span>
                            </button>
                          </div>

                          {/* Tier Card Fields Body */}
                          <div className="p-4 sm:p-5 space-y-4">
                            
                            {/* Inputs Grid: Name, Price, Badge */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                              <div>
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-600 mb-1">
                                  Package Name *
                                </label>
                                <input
                                  type="text"
                                  value={pkg.name}
                                  onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                                  placeholder="e.g. Base to Base Package"
                                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] transition"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-600 mb-1">
                                  Price / Person (₹) *
                                </label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-black text-neutral-400">
                                    ₹
                                  </span>
                                  <input
                                    type="number"
                                    value={pkg.price}
                                    onChange={(e) => handlePackageChange(idx, 'price', Number(e.target.value))}
                                    placeholder="8999"
                                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-extrabold text-[#E5383B] focus:outline-none focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] transition"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-600 mb-1">
                                  Badge / Tag (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={pkg.badge || ''}
                                  onChange={(e) => handlePackageChange(idx, 'badge', e.target.value)}
                                  placeholder="e.g. Minimum 3 members, Best Value"
                                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] transition"
                                />
                              </div>
                            </div>

                            {/* Description & Perks */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-600">
                                  Package Description &amp; Highlights
                                </label>
                                <span className="text-[10px] text-neutral-400 font-medium">
                                  Supports multiline text (Photographs, Reels, Certificates, etc.)
                                </span>
                              </div>
                              <textarea
                                rows={3}
                                value={pkg.desc}
                                onChange={(e) => handlePackageChange(idx, 'desc', e.target.value)}
                                placeholder="Describe photography perks, transit reporting, mountain certificates, or special batch details..."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 leading-relaxed focus:outline-none focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] transition resize-y min-h-[72px]"
                              />
                            </div>

                            {/* Included In This Package */}
                            <div className="p-3.5 rounded-xl bg-neutral-50/70 border border-neutral-200 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Included In This Package ({Array.isArray(pkg.includes) ? pkg.includes.length : 0} Items)</span>
                                </label>
                                <span className="text-[10px] text-neutral-400">
                                  Displays with green checkmarks on trek page
                                </span>
                              </div>

                              {/* Visual Chips */}
                              {Array.isArray(pkg.includes) && pkg.includes.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {pkg.includes.map((item, incIdx) => (
                                    <span 
                                      key={incIdx}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-emerald-950 border border-emerald-200/90 shadow-2xs"
                                    >
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                      <span>{item}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newIncludes = pkg.includes.filter((_, i) => i !== incIdx);
                                          handlePackageChange(idx, 'includes', newIncludes);
                                        }}
                                        className="text-neutral-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                                        title="Remove item"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Input for comma-separated items */}
                              <div>
                                <input
                                  type="text"
                                  value={Array.isArray(pkg.includes) ? pkg.includes.join(', ') : ''}
                                  onChange={(e) => handlePackageChange(idx, 'includes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                  placeholder="e.g. All meals on trek, Dome tents, Guide, Forest permits (comma-separated)"
                                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] transition"
                                />
                                <p className="text-[10px] text-neutral-400 mt-1">
                                  Tip: Separate items with commas to automatically create individual bullet points.
                                </p>
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 6: INCLUSIONS & GEAR LIST */}
              {activeTabInModal === 'checklist' && (
                <div className="space-y-4 animate-editorial-fade">
                  {/* Inclusions */}
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>What is Included ({formData.inclusions.length} Points)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddStringItem('inclusions', 'New inclusion item')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-950 cursor-pointer"
                      >
                        + Add Inclusion
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.inclusions.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleStringItemChange('inclusions', idx, e.target.value)}
                            placeholder="e.g. Best Hotels and Homestays / Meals included"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveStringItem('inclusions', idx)}
                            className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {formData.inclusions.length === 0 && (
                        <p className="text-neutral-400 text-xs italic py-1">No inclusion points added yet. Click &quot;+ Add Inclusion&quot; above.</p>
                      )}
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>What is Not Included ({formData.exclusions.length} Points)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddStringItem('exclusions', 'New exclusion item')}
                        className="text-xs font-bold text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        + Add Exclusion
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.exclusions.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleStringItemChange('exclusions', idx, e.target.value)}
                            placeholder="e.g. Transport from home city / Personal offloading"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveStringItem('exclusions', idx)}
                            className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {formData.exclusions.length === 0 && (
                        <p className="text-neutral-400 text-xs italic py-1">No exclusion points added yet. Click &quot;+ Add Exclusion&quot; above.</p>
                      )}
                    </div>
                  </div>

                  {/* Gear List */}
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                        <Sparkles className="w-4 h-4 text-[#E5383B]" />
                        <span>Gear Checklist ({formData.gearList.length} Items)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddStringItem('gearList', 'New gear item')}
                        className="text-xs font-bold text-[#E5383B] hover:text-[#c92a2a] cursor-pointer"
                      >
                        + Add Gear
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formData.gearList.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleStringItemChange('gearList', idx, e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveStringItem('gearList', idx)}
                            className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </form>

            {/* 4. STICKY MODAL FOOTER (ALWAYS VISIBLE AT BOTTOM) */}
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
                form="trek-modal-form"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-950 hover:from-neutral-950 hover:to-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition cursor-pointer flex items-center gap-2"
              >
                {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingTrek ? 'Update Trek Live' : 'Save Trek to Catalog'}</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
