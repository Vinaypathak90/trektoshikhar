import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ExternalLink, 
  Clock, 
  Users, 
  Send,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  RefreshCw,
  X,
  Compass,
  Building2,
  Search,
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react';
import { 
  getContactData, 
  updateContactSettings, 
  createOffice, 
  updateOffice, 
  deleteOffice, 
  updateInquiryStatus, 
  deleteInquiry,
  createFaq,
  updateFaq,
  deleteFaq
} from '../lib/contactApi';

export default function ContactModule() {
  const [activeTab, setActiveTab] = useState('offices');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Helplines & Settings State
  const [contactSettings, setContactSettings] = useState({
    phone: '+91 87912 18377',
    display_phone: '+91 87912 18377',
    whatsapp: '918791218377',
    email: 'bookings@trektoshikhar.com',
    hours: '7:00 AM – 10:00 PM IST (Mon – Sun)',
    emergency_line: '24/7 Active Trail Dispatch & Rescue Helpline',
    response_time: 'Within 15 minutes'
  });

  // 2. Dynamic Offices List
  const [officesList, setOfficesList] = useState([]);
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  const [officeForm, setOfficeForm] = useState({
    name: '',
    city: '',
    badge: '',
    address: '',
    landmark: '',
    phone: '+91 87912 18377',
    email: 'bookings@trektoshikhar.com',
    hours: '7:00 AM – 9:00 PM IST',
    description: '',
    map_embed_url: '',
    map_query: '',
    is_main_hq: false,
    is_active: true
  });

  // 3. Inquiries List
  const [inquiriesList, setInquiriesList] = useState([]);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // 4. FAQs List
  const [faqsList, setFaqsList] = useState([]);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    category: 'beginners',
    question: '',
    answer: '',
    is_active: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Load live data from Backend API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getContactData({ admin: true });
      if (res && res.success) {
        if (res.settings) setContactSettings(res.settings);
        if (Array.isArray(res.offices)) setOfficesList(res.offices);
        if (Array.isArray(res.inquiries)) setInquiriesList(res.inquiries);
        if (Array.isArray(res.faqs)) setFaqsList(res.faqs);
      }
    } catch (err) {
      console.warn('API fetch failed, retaining existing state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Body scroll lock on modals
  useEffect(() => {
    if (isOfficeModalOpen || isFaqModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOfficeModalOpen, isFaqModalOpen]);

  // ============================================================================
  // SETTINGS HANDLER
  // ============================================================================
  const handleSaveContactInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateContactSettings(contactSettings);
      showToast('Official Helplines & Settings saved successfully!');
    } catch (err) {
      console.error(err);
      showToast('Saved locally: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // OFFICES HANDLERS
  // ============================================================================
  const handleOpenAddOffice = () => {
    setEditingOffice(null);
    setOfficeForm({
      name: '',
      city: '',
      badge: '',
      address: '',
      landmark: '',
      phone: contactSettings.phone || '+91 87912 18377',
      email: contactSettings.email || 'bookings@trektoshikhar.com',
      hours: '7:00 AM – 9:00 PM IST',
      description: '',
      map_embed_url: '',
      map_query: '',
      is_main_hq: false,
      is_active: true
    });
    setIsOfficeModalOpen(true);
  };

  const handleOpenEditOffice = (office) => {
    setEditingOffice(office);
    setOfficeForm({
      name: office.name || '',
      city: office.city || '',
      badge: office.badge || '',
      address: office.address || '',
      landmark: office.landmark || '',
      phone: office.phone || contactSettings.phone || '+91 87912 18377',
      email: office.email || contactSettings.email || 'bookings@trektoshikhar.com',
      hours: office.hours || '7:00 AM – 9:00 PM IST',
      description: office.description || '',
      map_embed_url: office.map_embed_url || '',
      map_query: office.map_query || '',
      is_main_hq: Boolean(office.is_main_hq),
      is_active: office.is_active !== false
    });
    setIsOfficeModalOpen(true);
  };

  const handleSaveOffice = async (e) => {
    e.preventDefault();
    if (!officeForm.name.trim() || !officeForm.city.trim() || !officeForm.address.trim()) {
      alert('Please provide Office Name, City, and Full Physical Address.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingOffice) {
        const res = await updateOffice(editingOffice.id, officeForm);
        setOfficesList(prev => prev.map(o => o.id === editingOffice.id ? res.office || { ...o, ...officeForm } : o));
        showToast(`Office "${officeForm.name}" updated live!`);
      } else {
        const res = await createOffice(officeForm);
        setOfficesList(prev => [...prev, res.office || { ...officeForm, id: `office-${Date.now()}` }]);
        showToast(`New office "${officeForm.name}" added to database!`);
      }
      setIsOfficeModalOpen(false);
    } catch (err) {
      console.error(err);
      if (editingOffice) {
        setOfficesList(prev => prev.map(o => o.id === editingOffice.id ? { ...o, ...officeForm } : o));
      } else {
        setOfficesList(prev => [...prev, { ...officeForm, id: `office-${Date.now()}` }]);
      }
      showToast('Office saved locally');
      setIsOfficeModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOffice = async (office) => {
    if (!window.confirm(`Permanently remove office "${office.name}" from website and map?`)) return;

    try {
      await deleteOffice(office.id);
      setOfficesList(prev => prev.filter(o => o.id !== office.id));
      showToast(`Office "${office.name}" deleted.`);
    } catch (err) {
      console.error(err);
      setOfficesList(prev => prev.filter(o => o.id !== office.id));
      showToast(`Office removed locally.`);
    }
  };

  // Helper to preview map in modal
  const getModalMapPreviewUrl = () => {
    const raw = officeForm.map_embed_url || officeForm.address || officeForm.city;
    if (!raw) return '';
    if (raw.includes('src="')) {
      const match = raw.match(/src=["'](.*?)["']/);
      if (match && match[1]) return match[1];
    }
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      if (raw.includes('maps/embed') || raw.includes('output=embed')) {
        return raw;
      }
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(raw)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  // ============================================================================
  // INQUIRIES HANDLERS
  // ============================================================================
  const handleUpdateStatus = async (inqId, newStatus) => {
    try {
      await updateInquiryStatus(inqId, newStatus);
      setInquiriesList(prev => prev.map(i => i.id === inqId ? { ...i, status: newStatus } : i));
      showToast(`Inquiry status updated to ${newStatus}`);
    } catch (err) {
      setInquiriesList(prev => prev.map(i => i.id === inqId ? { ...i, status: newStatus } : i));
      showToast(`Status updated locally`);
    }
  };

  const handleDeleteInquiryRecord = async (inqId) => {
    if (!window.confirm('Delete this inquiry record permanently?')) return;
    try {
      await deleteInquiry(inqId);
      setInquiriesList(prev => prev.filter(i => i.id !== inqId));
      showToast('Inquiry removed');
    } catch (err) {
      setInquiriesList(prev => prev.filter(i => i.id !== inqId));
      showToast('Inquiry removed locally');
    }
  };

  const filteredInquiries = inquiriesList.filter(i => {
    const q = inquirySearch.toLowerCase().trim();
    const matchesQ = !q || 
      (i.full_name && i.full_name.toLowerCase().includes(q)) ||
      (i.phone && i.phone.includes(q)) ||
      (i.email && i.email.toLowerCase().includes(q)) ||
      (i.trek_interest && i.trek_interest.toLowerCase().includes(q));
    const matchesStatus = inquiryStatusFilter === 'all' || i.status === inquiryStatusFilter;
    return matchesQ && matchesStatus;
  });

  // ============================================================================
  // FAQS HANDLERS
  // ============================================================================
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ category: 'beginners', question: '', answer: '', is_active: true });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqForm({
      category: faq.category || 'beginners',
      question: faq.question || '',
      answer: faq.answer || '',
      is_active: faq.is_active !== false
    });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      alert('Please provide question and answer.');
      return;
    }

    try {
      if (editingFaq) {
        const res = await updateFaq(editingFaq.id, faqForm);
        setFaqsList(prev => prev.map(f => f.id === editingFaq.id ? res.faq || { ...f, ...faqForm } : f));
        showToast('FAQ updated live!');
      } else {
        const res = await createFaq(faqForm);
        setFaqsList(prev => [...prev, res.faq || { ...faqForm, id: `faq-${Date.now()}` }]);
        showToast('New FAQ created!');
      }
      setIsFaqModalOpen(false);
    } catch (err) {
      if (editingFaq) {
        setFaqsList(prev => prev.map(f => f.id === editingFaq.id ? { ...f, ...faqForm } : f));
      } else {
        setFaqsList(prev => [...prev, { ...faqForm, id: `faq-${Date.now()}` }]);
      }
      showToast('FAQ saved locally');
      setIsFaqModalOpen(false);
    }
  };

  const handleDeleteFaqItem = async (faqId) => {
    if (!window.confirm('Delete this FAQ item?')) return;
    try {
      await deleteFaq(faqId);
      setFaqsList(prev => prev.filter(f => f.id !== faqId));
      showToast('FAQ deleted.');
    } catch (err) {
      setFaqsList(prev => prev.filter(f => f.id !== faqId));
      showToast('FAQ removed locally');
    }
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

      {/* Header Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Module 6 • Contact &amp; Expedition Base Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[#0A0A0A] tracking-tight">
            Contact Hubs &amp; Inquiries Manager
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Manage physical office addresses, Google Maps coordinates, official helplines, lead inquiries, and customer FAQs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-3 rounded-2xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition cursor-pointer"
            title="Reload from Database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#E5383B]' : ''}`} />
          </button>

          {activeTab === 'offices' && (
            <button
              onClick={handleOpenAddOffice}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Office Hub</span>
            </button>
          )}

          {activeTab === 'faqs' && (
            <button
              onClick={handleOpenAddFaq}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="inline-flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200 text-xs font-bold shrink-0 self-start overflow-x-auto max-w-full scrollbar-none shadow-2xs">
        <button
          onClick={() => setActiveTab('offices')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'offices' ? 'bg-white text-[#E5383B] shadow-2xs font-black' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Offices &amp; Base Hubs ({officesList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('contact_info')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'contact_info' ? 'bg-white text-[#E5383B] shadow-2xs font-black' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Helplines &amp; Settings</span>
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'inquiries' ? 'bg-white text-[#E5383B] shadow-2xs font-black' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Inquiries Inbox</span>
          {inquiriesList.filter(i => i.status === 'new').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#E5383B] text-white text-[10px] font-black">
              {inquiriesList.filter(i => i.status === 'new').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'faqs' ? 'bg-white text-[#E5383B] shadow-2xs font-black' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQs ({faqsList.length})</span>
        </button>
      </div>

      {/* ====================================================================
          TAB 1: DYNAMIC OFFICES & BASE HUBS (The core feature user stressed)
         ==================================================================== */}
      {activeTab === 'offices' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {officesList.map((office) => {
              const mapUrl = office.map_embed_url || `https://maps.google.com/maps?q=${encodeURIComponent(office.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
              return (
                <div 
                  key={office.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-[#E5383B]/30 transition-all duration-300 group"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 text-[10px] font-black uppercase tracking-wider text-neutral-800 mb-1.5">
                          <MapPin className="w-3 h-3 text-[#E5383B]" />
                          <span>{office.badge || `${office.city} Base`}</span>
                          {office.is_main_hq && (
                            <span className="ml-1 text-[#E5383B] font-black">★ MAIN HQ</span>
                          )}
                        </div>
                        <h3 className="font-outfit font-black text-xl text-[#0A0A0A]">
                          {office.name}
                        </h3>
                        <p className="text-xs font-bold text-neutral-500">
                          City: <span className="text-[#0A0A0A]">{office.city}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditOffice(office)}
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-[#E5383B] hover:text-white text-neutral-700 transition cursor-pointer"
                          title="Edit Office"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOffice(office)}
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-red-600 hover:text-white text-neutral-700 transition cursor-pointer"
                          title="Delete Office"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Address details */}
                    <div className="space-y-2 text-xs text-neutral-600 mb-4 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-100">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{office.address}</span>
                      </div>
                      {office.landmark && (
                        <div className="flex items-center gap-2 text-neutral-500 text-[11px] pl-6">
                          <span>Landmark: {office.landmark}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-200/60 text-[11px]">
                        <div className="flex items-center gap-1.5 text-neutral-700 font-bold">
                          <Phone className="w-3.5 h-3.5 text-[#E5383B]" />
                          <span>{office.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-700 font-bold truncate">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          <span className="truncate">{office.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Map Preview */}
                    <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 h-44 relative">
                      <iframe
                        src={mapUrl}
                        title={`Map for ${office.name}`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className={`inline-flex items-center gap-1.5 font-bold ${office.is_active ? 'text-emerald-700' : 'text-neutral-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${office.is_active ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                      <span>{office.is_active ? 'Visible on Website & Map' : 'Hidden / Inactive'}</span>
                    </span>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(office.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E5383B] hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {officesList.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200">
              <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h4 className="font-outfit font-bold text-lg text-neutral-800">No Office Locations Added Yet</h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-4">
                Click the button below to add your first physical mountain hub (e.g. Dehradun HQ, Haldwani Base, etc.).
              </p>
              <button
                onClick={handleOpenAddOffice}
                className="px-5 py-2.5 rounded-xl bg-[#E5383B] text-white text-xs font-bold"
              >
                + Add Office Location
              </button>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          TAB 2: HELPLINES & CONTACT SETTINGS
         ==================================================================== */}
      {activeTab === 'contact_info' && (
        <form onSubmit={handleSaveContactInfo} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6 animate-editorial-fade">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
              Official Helplines &amp; Operations Support
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Syncs phone numbers, WhatsApp, and emergency lines across Navbar, Floating Hotline, Contact page, and booking alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Primary Phone Display *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={contactSettings.phone}
                  onChange={(e) => setContactSettings(p => ({ ...p, phone: e.target.value, display_phone: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-bold focus:border-[#E5383B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                WhatsApp E.164 Number (e.g. 918791218377) *
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-[#25D366] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={contactSettings.whatsapp}
                  onChange={(e) => setContactSettings(p => ({ ...p, whatsapp: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-bold focus:border-[#E5383B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Official Inquiries Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={contactSettings.email}
                  onChange={(e) => setContactSettings(p => ({ ...p, email: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Operational Support Hours
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={contactSettings.hours}
                  onChange={(e) => setContactSettings(p => ({ ...p, hours: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                24/7 Emergency Trail Dispatch Line
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-[#E5383B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={contactSettings.emergency_line}
                  onChange={(e) => setContactSettings(p => ({ ...p, emergency_line: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Response Time Promise
              </label>
              <div className="relative">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={contactSettings.response_time}
                  onChange={(e) => setContactSettings(p => ({ ...p, response_time: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save Helplines & Settings'}
            </button>
          </div>
        </form>
      )}

      {/* ====================================================================
          TAB 3: INQUIRIES INBOX
         ==================================================================== */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4 animate-editorial-fade">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                placeholder="Search inquiries by trekker name, phone, email, or trek..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none bg-neutral-50/50"
              />
            </div>

            <div className="inline-flex p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs font-bold shrink-0 self-start sm:self-auto">
              {['all', 'new', 'contacted', 'confirmed', 'archived'].map(status => (
                <button
                  key={status}
                  onClick={() => setInquiryStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                    inquiryStatusFilter === status ? 'bg-white text-[#E5383B] shadow-2xs' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Inquiries List */}
          <div className="space-y-3">
            {filteredInquiries.map((inq) => {
              const waReplyText = encodeURIComponent(`Hi ${inq.full_name || 'Trekker'}, this is TrekToShikhar mountain team regarding your inquiry for ${inq.trek_interest || 'the upcoming trek'}. How can we assist you?`);
              const waUrl = `https://wa.me/91${String(inq.phone || '').replace(/\D/g, '')}?text=${waReplyText}`;

              return (
                <div 
                  key={inq.id}
                  className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#E5383B]/30 transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-outfit font-black text-base text-[#0A0A0A]">
                        {inq.full_name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        inq.status === 'new' ? 'bg-red-100 text-red-700' :
                        inq.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        inq.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>
                        {inq.status}
                      </span>
                      <span className="text-neutral-400 text-xs">
                        {inq.created_at ? new Date(inq.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 font-medium">
                      <span>Trek: <strong className="text-[#0A0A0A]">{inq.trek_interest}</strong></span>
                      <span>•</span>
                      <span>Trekkers: <strong>{inq.trekker_count}</strong></span>
                      <span>•</span>
                      <span>Date: <strong>{inq.travel_month}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-neutral-700">{inq.phone}</span>
                    </div>

                    {inq.message && (
                      <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 mt-2">
                        "{inq.message}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                      className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold bg-neutral-50 focus:outline-none"
                    >
                      <option value="new">Mark New</option>
                      <option value="contacted">Mark Contacted</option>
                      <option value="confirmed">Mark Confirmed</option>
                      <option value="archived">Mark Archived</option>
                    </select>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-xs"
                      title="Open WhatsApp chat with this trekker"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleDeleteInquiryRecord(inq.id)}
                      className="p-2 rounded-xl border border-neutral-200 hover:bg-red-50 hover:text-red-600 text-neutral-500 transition cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredInquiries.length === 0 && (
              <div className="p-10 text-center bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-500">
                No inquiries found matching current filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 4: CUSTOMER FAQS
         ==================================================================== */}
      {activeTab === 'faqs' && (
        <div className="space-y-4 animate-editorial-fade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqsList.map((faq) => (
              <div 
                key={faq.id}
                className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs flex flex-col justify-between hover:border-[#E5383B]/30 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-black uppercase tracking-wider text-neutral-700">
                      {faq.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditFaq(faq)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600"
                        title="Edit FAQ"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaqItem(faq.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-neutral-400"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-outfit font-black text-sm text-[#0A0A0A] mb-1.5">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          OFFICE ADD/EDIT MODAL
         ==================================================================== */}
      {isOfficeModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto border border-neutral-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E5383B]">
                  {editingOffice ? 'EDIT OFFICE LOCATION' : 'NEW EXPEDITION BASE HUB'}
                </span>
                <h3 className="text-xl font-black font-outfit text-[#0A0A0A]">
                  {editingOffice ? `Edit: ${editingOffice.name}` : 'Add Physical Base Camp / HQ'}
                </h3>
              </div>
              <button
                onClick={() => setIsOfficeModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Office / Base Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={officeForm.name}
                    onChange={(e) => setOfficeForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Haldwani Foothills Hub"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    City / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={officeForm.city}
                    onChange={(e) => setOfficeForm(p => ({ ...p, city: e.target.value }))}
                    placeholder="e.g. Haldwani, Dehradun, Shimla, Manali"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Badge Tag (Header Pill)
                  </label>
                  <input
                    type="text"
                    value={officeForm.badge}
                    onChange={(e) => setOfficeForm(p => ({ ...p, badge: e.target.value }))}
                    placeholder="e.g. Kumaon Regional Hub • Uttarakhand"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Landmark / Proximity
                  </label>
                  <input
                    type="text"
                    value={officeForm.landmark}
                    onChange={(e) => setOfficeForm(p => ({ ...p, landmark: e.target.value }))}
                    placeholder="e.g. Near Tikonia Chauraha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Physical Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={officeForm.address}
                  onChange={(e) => setOfficeForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="e.g. Nainital Road, Near Tikonia Chauraha, Haldwani, Uttarakhand 263139"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={officeForm.phone}
                    onChange={(e) => setOfficeForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#E5383B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={officeForm.email}
                    onChange={(e) => setOfficeForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#E5383B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={officeForm.hours}
                    onChange={(e) => setOfficeForm(p => ({ ...p, hours: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#E5383B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Google Maps Embed / Query */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Google Maps Embed URL or Address Query
                </label>
                <input
                  type="text"
                  value={officeForm.map_embed_url}
                  onChange={(e) => setOfficeForm(p => ({ ...p, map_embed_url: e.target.value }))}
                  placeholder="Paste embed iframe URL, or leave blank to use Address automatically"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#E5383B] focus:outline-none font-mono"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Tip: You can paste a Google Maps iframe code/URL or simply let the system auto-generate the map from the address!
                </p>
              </div>

              {/* Live Map Preview inside Modal */}
              {getModalMapPreviewUrl() && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-500">Live Map Preview:</span>
                  <div className="h-36 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                    <iframe
                      src={getModalMapPreviewUrl()}
                      title="Map Preview"
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-neutral-100 text-xs font-bold text-neutral-700">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={officeForm.is_main_hq}
                    onChange={(e) => setOfficeForm(p => ({ ...p, is_main_hq: e.target.checked }))}
                    className="w-4 h-4 text-[#E5383B] rounded focus:ring-0"
                  />
                  <span>Mark as Main Company Headquarters (HQ)</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={officeForm.is_active}
                    onChange={(e) => setOfficeForm(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-4 h-4 text-[#E5383B] rounded focus:ring-0"
                  />
                  <span>Active (Visible on Website)</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsOfficeModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold hover:bg-neutral-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition cursor-pointer"
                >
                  {isSaving ? 'Saving...' : editingOffice ? 'Update Office Location' : 'Save Office Location'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ====================================================================
          FAQ ADD/EDIT MODAL
         ==================================================================== */}
      {isFaqModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-black font-outfit text-[#0A0A0A]">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="p-1.5 rounded-lg text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                >
                  <option value="beginners">Beginners &amp; First-Timers</option>
                  <option value="safety">Wilderness Safety &amp; Medical</option>
                  <option value="booking">Booking &amp; Batch Policies</option>
                  <option value="gear">Gear &amp; Weather</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm(p => ({ ...p, question: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:border-[#E5383B] focus:outline-none"
                  placeholder="e.g. What safety gear do you provide?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm(p => ({ ...p, answer: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:border-[#E5383B] focus:outline-none resize-none"
                  placeholder="Detailed answer..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E5383B] text-white text-xs font-bold"
                >
                  {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
