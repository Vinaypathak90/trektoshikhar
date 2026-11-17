import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';
import { AGENCY_CONTACT } from '../data/treksData';

export default function ContactModule() {
  const [activeTab, setActiveTab] = useState('contact_info');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Contact Settings State
  const [contactSettings, setContactSettings] = useState({
    phone: AGENCY_CONTACT.displayPhone || "+91 87912 18377",
    whatsapp: AGENCY_CONTACT.whatsappNumber || "918791218377",
    email: AGENCY_CONTACT.email || "bookings@trektoshikhar.com",
    shimlaHub: "The Ridge, Near Christ Church, Shimla, HP 171001",
    dehradunHub: "Rajpur Road, Near Clock Tower, Dehradun, UK 248001",
    hours: "7:00 AM – 10:00 PM IST (Mon – Sun)",
    emergencyLine: "24/7 Active Trail Dispatch"
  });

  const handleSaveContactInfo = (e) => {
    e.preventDefault();
    showToast("Contact details & mountain base hubs updated!");
  };

  // 2. Inquiries State (Sample live inquiries list)
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      name: "Vinay Pathak",
      phone: "8791218377",
      email: "vinay@example.com",
      trek: "Kedarkantha Summit Expedition",
      trekkers: 4,
      date: "Upcoming Weekend",
      status: "new",
      time: "10 mins ago",
      notes: "Need private tent accommodation for family."
    },
    {
      id: 2,
      name: "Rohit Deshmukh",
      phone: "9820145678",
      email: "rohit.d@gmail.com",
      trek: "Nag Tibba Weekend Trek",
      trekkers: 2,
      date: "Next 15 Days",
      status: "contacted",
      time: "2 hours ago",
      notes: "Pickup from Dehradun railway station."
    },
    {
      id: 3,
      name: "Sneha Rawat",
      phone: "9711234560",
      email: "sneha.rawat@outlook.com",
      trek: "Hatu Peak & Alpine Ridge",
      trekkers: 6,
      date: "December 2026",
      status: "confirmed",
      time: "Yesterday",
      notes: "Looking for winter snow gear rental on spot."
    }
  ]);

  const handleUpdateInquiryStatus = (id, newStatus) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    showToast(`Inquiry #${id} marked as ${newStatus}.`);
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm("Delete this inquiry record?")) {
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      showToast("Inquiry removed.");
    }
  };

  // 3. FAQs State
  const [faqsList, setFaqsList] = useState([
    {
      id: 1,
      category: 'beginners',
      question: "Are Himalayan weekend treks safe for absolute beginners with zero prior trekking experience?",
      answer: "Yes, absolutely! Introductory treks like Nag Tibba (9,915 ft) and Hatu Peak (11,150 ft) are paced scientifically with gradual slopes and frequent hydration breaks."
    },
    {
      id: 2,
      category: 'safety',
      question: "What emergency medical protocols and oxygen backups are available on the trail?",
      answer: "Every single expedition batch is equipped with a high-altitude emergency oxygen cylinder, portable pulse oximeter for daily acclimatization checks, and a comprehensive wilderness medical kit."
    },
    {
      id: 3,
      category: 'booking',
      question: "How do I reach your mountain coordination desk directly for urgent booking?",
      answer: "You can instantly connect with our lead coordinators via WhatsApp or direct phone call at +91 87912 18377."
    },
    {
      id: 4,
      category: 'safety',
      question: "Why do you strictly limit batch sizes to 12–15 trekkers per expedition?",
      answer: "We reject commercial crowd-herding. A capped batch size of 12–15 trekkers ensures a 1:6 guide-to-trekker safety ratio, personalized health monitoring, and zero trail littering."
    }
  ]);

  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    category: 'beginners',
    question: '',
    answer: ''
  });

  // Lock body scroll when FAQ modal is open
  React.useEffect(() => {
    if (faqModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [faqModalOpen]);

  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ category: 'beginners', question: '', answer: '' });
    setFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqForm({ ...faq });
    setFaqModalOpen(true);
  };

  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      alert("Please enter question and answer.");
      return;
    }
    if (editingFaq) {
      setFaqsList(prev => prev.map(f => f.id === editingFaq.id ? { ...faqForm, id: editingFaq.id } : f));
      showToast("FAQ updated!");
    } else {
      setFaqsList(prev => [...prev, { ...faqForm, id: Date.now() }]);
      showToast("New FAQ added to Contact page!");
    }
    setFaqModalOpen(false);
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm("Delete this FAQ item?")) {
      setFaqsList(prev => prev.filter(f => f.id !== id));
      showToast("FAQ deleted.");
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

      {/* Module Title Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>Module 3 • Contact Us, Inquiries &amp; FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[#0A0A0A] tracking-tight">
            Contact Operations &amp; Inquiries
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Manage official helpline numbers, base locations, website inquiry inbox, and customer FAQs.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="inline-flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200 text-xs font-bold shrink-0 self-start md:self-auto overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setActiveTab('contact_info')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'contact_info' ? 'bg-white text-[#E5383B] shadow-2xs font-extrabold' : 'text-neutral-600 hover:text-black'
            }`}
          >
            Hubs &amp; Helplines
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'inquiries' ? 'bg-white text-[#E5383B] shadow-2xs font-extrabold' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <span>Inquiries Inbox</span>
            <span className="w-4 h-4 rounded-full bg-[#E5383B] text-white text-[10px] flex items-center justify-center font-bold">
              {inquiries.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'faqs' ? 'bg-white text-[#E5383B] shadow-2xs font-extrabold' : 'text-neutral-600 hover:text-black'
            }`}
          >
            FAQs ({faqsList.length})
          </button>
        </div>
      </div>

      {/* ====================================================================
          TAB 1: CONTACT INFO & BASE CAMP HUBS
         ==================================================================== */}
      {activeTab === 'contact_info' && (
        <form onSubmit={handleSaveContactInfo} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6 animate-editorial-fade">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-outfit font-black text-lg text-[#0A0A0A]">
              Official Helplines &amp; Dispatch Coordinates
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Updates phone numbers across the Navbar, Floating Buttons, Booking Modal, and Contact page.
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
                  onChange={(e) => setContactSettings(p => ({ ...p, phone: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-bold focus:border-[#E5383B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                WhatsApp E.164 Number *
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Shimla Hub Physical Address
              </label>
              <textarea
                rows={2}
                value={contactSettings.shimlaHub}
                onChange={(e) => setContactSettings(p => ({ ...p, shimlaHub: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Dehradun Hub Physical Address
              </label>
              <textarea
                rows={2}
                value={contactSettings.dehradunHub}
                onChange={(e) => setContactSettings(p => ({ ...p, dehradunHub: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#E5383B] hover:bg-[#c92a2a] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition cursor-pointer"
            >
              Save Helpline Details
            </button>
          </div>
        </form>
      )}

      {/* ====================================================================
          TAB 2: INQUIRIES INBOX
         ==================================================================== */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4 animate-editorial-fade">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black font-outfit text-[#0A0A0A]">
              Recent Customer Inquiries ({inquiries.length})
            </h3>
            <span className="text-xs text-neutral-400">
              ⚡ Click any phone to launch instant WhatsApp response
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="font-outfit font-black text-base text-[#0A0A0A]">
                      {inq.name}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      inq.status === 'new' ? 'bg-red-100 text-[#E5383B]' : inq.status === 'contacted' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {inq.status}
                    </span>
                    <span className="text-xs text-neutral-400">• {inq.time}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 mb-2">
                    <span className="font-bold text-[#E5383B]">{inq.trek}</span>
                    <span>• {inq.trekkers} Trekkers</span>
                    <span>• Target: {inq.date}</span>
                    <span>• {inq.email}</span>
                  </div>

                  {inq.notes && (
                    <p className="text-xs text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100 max-w-xl">
                      "{inq.notes}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <a
                    href={`https://wa.me/${inq.phone}?text=Hello%20${encodeURIComponent(inq.name)}%2C%20this%20is%20TrekToShikhar%20Mountain%20Desk%20regarding%20your%20inquiry%20for%20${encodeURIComponent(inq.trek)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp ({inq.phone})</span>
                  </a>

                  <select
                    value={inq.status}
                    onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                    className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold bg-white cursor-pointer"
                  >
                    <option value="new">Mark New</option>
                    <option value="contacted">Mark Contacted</option>
                    <option value="confirmed">Mark Confirmed</option>
                  </select>

                  <button
                    onClick={() => handleDeleteInquiry(inq.id)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 3: FAQS MANAGER
         ==================================================================== */}
      {activeTab === 'faqs' && (
        <div className="space-y-4 animate-editorial-fade">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black font-outfit text-[#0A0A0A]">
              Frequently Asked Questions ({faqsList.length})
            </h3>
            <button
              onClick={handleOpenAddFaq}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5383B] text-white text-xs font-bold hover:bg-[#c92a2a] transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqsList.map((faq, idx) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                      #{idx + 1} {faq.category}
                    </span>
                    <h4 className="font-outfit font-bold text-sm sm:text-base text-[#0A0A0A]">
                      {faq.question}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-3xl">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => handleOpenEditFaq(faq)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ ADD / EDIT MODAL (NEVER OVERFLOWS SCREEN) */}
      {faqModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
          onClick={() => setFaqModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-xl h-[86vh] max-h-[580px] shadow-2xl border border-neutral-200/90 flex flex-col overflow-hidden animate-editorial-fade"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* 1. STICKY MODAL HEADER */}
            <div className="px-5 sm:px-7 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E5383B] block">
                  FAQ Knowledge Base Editor
                </span>
                <h3 className="font-outfit font-black text-lg sm:text-xl text-[#0A0A0A]">
                  {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Question'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFaqModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
              >
                <Trash2 className="w-0 h-0 hidden" />
                <span className="text-xl font-bold leading-none">&times;</span>
              </button>
            </div>

            {/* 2. SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveFaq} id="faq-modal-form" className="px-5 sm:px-7 py-5 overflow-y-auto flex-1 space-y-4 bg-neutral-50/40">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] focus:outline-none bg-white font-medium"
                >
                  <option value="beginners">First Timers / Beginners</option>
                  <option value="safety">Safety &amp; Medical Backup</option>
                  <option value="booking">Bookings &amp; Cancellations</option>
                  <option value="gear">Alpine Gear &amp; Tents</option>
                  <option value="transport">Pickups &amp; Transport</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm(p => ({ ...p, question: e.target.value }))}
                  placeholder="e.g. Can solo female trekkers join safely?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] focus:outline-none font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Detailed Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm(p => ({ ...p, answer: e.target.value }))}
                  placeholder="Provide complete, reassuring guidance for trekkers..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:border-[#E5383B] focus:ring-1 focus:ring-[#E5383B] focus:outline-none resize-none bg-white leading-relaxed"
                />
              </div>
            </form>

            {/* 3. STICKY MODAL FOOTER */}
            <div className="px-5 sm:px-7 py-3.5 border-t border-neutral-200/90 bg-white flex items-center justify-end gap-3 shrink-0 shadow-lg">
              <button
                type="button"
                onClick={() => setFaqModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="faq-modal-form"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:bg-neutral-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition cursor-pointer"
              >
                Save FAQ
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
