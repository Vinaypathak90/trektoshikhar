import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink, 
  Compass, 
  Navigation, 
  Users,
  AlertCircle,
  Building2,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { AGENCY_CONTACT, TREKS } from '../data/treksData';
import { getContactData, submitInquiry } from '../lib/contactApi';

// Helper to generate sanitized WhatsApp URL with prefilled text
const getCleanWhatsAppUrl = (rawPhone, customMessage) => {
  const digits = String(rawPhone || '918791218377').replace(/\D/g, '');
  const cleanPhone = digits.length === 10 ? `91${digits}` : (digits || '918791218377');
  const msg = customMessage || 'Namaste TrekToShikhar Team! 🏔️ I am reaching out from your Contact Us page and would like to inquire about upcoming Himalayan treks, batch dates, and bookings.';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
};

export default function ContactUsPage({ onBackToHome, onOpenBookingModal }) {
  const navigate = useNavigate();
  const handleBack = onBackToHome || (() => navigate('/'));
  const mapSectionRef = useRef(null);

  // Dynamic Settings & Offices State
  const [settings, setSettings] = useState({
    phone: AGENCY_CONTACT.displayPhone || "+91 87912 18377",
    whatsapp: AGENCY_CONTACT.whatsappNumber || "918791218377",
    email: AGENCY_CONTACT.email || "bookings@trektoshikhar.com",
    hours: "7:00 AM – 10:00 PM IST (Mon – Sun)",
    emergency_line: "24/7 Active Trail Dispatch & Rescue Helpline",
    response_time: "Within 15 minutes"
  });

  const [offices, setOffices] = useState([
    {
      id: 'office-dehradun-hq',
      name: 'Dehradun Main HQ & Garhwal Base',
      city: 'Dehradun',
      badge: 'Main Headquarters • Uttarakhand',
      address: 'Rajpur Road, Near Clock Tower, Dehradun, Uttarakhand 248001',
      landmark: 'Near Clock Tower & Gandhi Park',
      phone: '+91 87912 18377',
      email: 'bookings@trektoshikhar.com',
      hours: '7:00 AM – 9:00 PM IST',
      map_embed_url: 'https://maps.google.com/maps?q=Rajpur+Road+Dehradun+Clock+Tower&t=&z=14&ie=UTF8&iwloc=&output=embed',
      is_main_hq: true
    },
    {
      id: 'office-haldwani-foothills',
      name: 'Haldwani Foothills Hub & Kumaon Gateway',
      city: 'Haldwani',
      badge: 'Kumaon Regional Hub • Uttarakhand',
      address: 'Nainital Road, Near Tikonia Chauraha, Haldwani, Uttarakhand 263139',
      landmark: 'Near Tikonia Chauraha & Kathgodam Rail Link',
      phone: '+91 87912 18377',
      email: 'haldwani@trektoshikhar.com',
      hours: '8:00 AM – 8:00 PM IST',
      map_embed_url: 'https://maps.google.com/maps?q=Tikonia+Chauraha+Nainital+Road+Haldwani&t=&z=14&ie=UTF8&iwloc=&output=embed',
      is_main_hq: false
    },
    {
      id: 'office-shimla-ridge',
      name: 'Shimla Ridge Base & Himachal Command',
      city: 'Shimla',
      badge: 'Himachal Expedition Base',
      address: 'The Ridge, Near Christ Church, Shimla, Himachal Pradesh 171001',
      landmark: 'The Ridge, Adjacent to Mall Road',
      phone: '+91 87912 18377',
      email: 'shimla@trektoshikhar.com',
      hours: '7:30 AM – 8:30 PM IST',
      map_embed_url: 'https://maps.google.com/maps?q=The+Ridge+Christ+Church+Shimla&t=&z=14&ie=UTF8&iwloc=&output=embed',
      is_main_hq: false
    }
  ]);

  const [selectedOfficeId, setSelectedOfficeId] = useState('all');

  // Contact Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    trekInterest: 'Nag Tibba Weekend Trek',
    trekkerCount: '2',
    travelMonth: 'Upcoming Weekend',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedWaUrl, setSubmittedWaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [faqCategory, setFaqCategory] = useState('all');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleEmailClick = (e) => {
    if (e) e.preventDefault();
    const targetEmail = settings.email || 'bookings@trektoshikhar.com';
    const subject = 'Expedition Inquiry - TrekToShikhar';
    const body = 'Hi TrekToShikhar Team,\n\nI would like to inquire about upcoming trek batches and itinerary details.\n\nThank you!';

    // 1. Copy to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(targetEmail);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = targetEmail;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }

    // 2. Open Gmail Web compose in a new tab (Universal - works on all browsers without desktop mail client)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    // 3. Fallback: if popup was blocked or desktop client preferred
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const handleCopyEmailOnly = (e) => {
    if (e) e.stopPropagation();
    const targetEmail = settings.email || 'bookings@trektoshikhar.com';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(targetEmail);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = targetEmail;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }
  };

  // FAQs State
  const [faqsList, setFaqsList] = useState([
    {
      id: 1,
      category: 'beginners',
      question: "Are Himalayan weekend treks safe for absolute beginners with zero prior trekking experience?",
      answer: "Yes, absolutely! Introductory treks like Nag Tibba (9,915 ft) and Hatu Peak (11,150 ft) are paced scientifically with gradual slopes and frequent hydration breaks. Certified leaders from NIM (National Institute of Mountaineering) guide every step with a relaxed pace, making them 100% beginner and family friendly."
    },
    {
      id: 2,
      category: 'safety',
      question: "What emergency medical protocols and oxygen backups are available on the trail?",
      answer: "Every single expedition batch is equipped with a high-altitude emergency oxygen cylinder, portable pulse oximeter for daily acclimatization checks, and a comprehensive wilderness medical kit. All trek leaders are certified Wilderness First Responders (WFR)."
    },
    {
      id: 3,
      category: 'booking',
      question: "How do I reach your mountain coordination desk directly for urgent booking?",
      answer: "You can instantly connect with our lead coordinators via WhatsApp or direct phone call at +91 87912 18377. Our operations desk is active 7 days a week from 7:00 AM to 10:00 PM IST."
    },
    {
      id: 4,
      category: 'safety',
      question: "Why do you strictly limit batch sizes to 12–15 trekkers per expedition?",
      answer: "We reject commercial crowd-herding. A capped batch size of 12–15 trekkers ensures a 1:6 guide-to-trekker safety ratio, personalized health monitoring, peaceful alpine campsites, and strictly zero trail littering."
    },
    {
      id: 5,
      category: 'gear',
      question: "What tents and sleeping equipment does TrekToShikhar provide?",
      answer: "We provide high-grade waterproof 4-season dome tents (twin/triple sharing), sub-zero thermal sleeping bags rated down to -10°C, freshly laundered thermal fleece liners, and insulated moisture-proof foam sleeping mats."
    },
    {
      id: 6,
      category: 'transport',
      question: "How does pickup and transport work from Dehradun or Shimla?",
      answer: "For Uttarakhand routes (Nag Tibba, Kedarkantha), shared pickup departs from Dehradun Railway Station at 6:30 AM in comfortable mountain cabs. For Himachal routes (Hatu Peak, Churdhar), pickups are organized from Shimla Old Bus Stand / ISBT."
    }
  ]);

  // Load live data from Backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await getContactData({ admin: false });
        if (res && res.success && isMounted) {
          if (res.settings) setSettings(res.settings);
          if (Array.isArray(res.offices) && res.offices.length > 0) {
            setOffices(res.offices);
          }
          if (Array.isArray(res.faqs) && res.faqs.length > 0) {
            setFaqsList(res.faqs);
          }
        }
      } catch (err) {
        console.warn('Using offline contact defaults:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Selected office for map view
  const currentOfficeForMap = selectedOfficeId === 'all'
    ? (offices.find(o => o.is_main_hq) || offices[0])
    : (offices.find(o => o.id === selectedOfficeId) || offices[0]);

  const mapEmbedUrl = currentOfficeForMap?.map_embed_url || 
    `https://maps.google.com/maps?q=${encodeURIComponent(currentOfficeForMap?.address || 'Dehradun, Uttarakhand')}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const handleSelectMapOffice = (officeId) => {
    setSelectedOfficeId(officeId);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Contact form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit inquiry: saves to DB AND opens WhatsApp!
  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert("Please provide your full name and WhatsApp phone number.");
      return;
    }

    // 1. Build rich structured WhatsApp inquiry message
    const waMsg = `🏔️ *NEW EXPEDITION INQUIRY - TREKTOSHIKHAR*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Name:* ${formData.fullName}\n` +
      `📱 *Phone:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email || 'Not provided'}\n` +
      `🌲 *Trek:* ${formData.trekInterest}\n` +
      `👥 *Trekkers:* ${formData.trekkerCount}\n` +
      `📅 *Preferred Date:* ${formData.travelMonth}\n` +
      `💬 *Message:* ${formData.message || 'I would like to inquire about batch availability and itinerary details.'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Sent from TrekToShikhar Official Contact Portal_`;

    const waUrl = getCleanWhatsAppUrl(settings.whatsapp || settings.phone, waMsg);
    setSubmittedWaUrl(waUrl);

    // Open WhatsApp synchronously inside user click event to prevent popup blocker
    const win = window.open(waUrl, '_blank', 'noopener,noreferrer');

    setIsSubmitting(true);

    // 2. Submit lead to database in background
    try {
      await submitInquiry({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        trekInterest: formData.trekInterest,
        trekkerCount: formData.trekkerCount,
        travelMonth: formData.travelMonth,
        message: formData.message
      });
    } catch (err) {
      console.warn('Could not record inquiry in DB:', err);
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }

    // Fallback if browser blocked the new tab
    if (!win || win.closed || typeof win.closed === 'undefined') {
      console.info('WhatsApp popup handled via confirmation screen CTA');
    }
  };

  const filteredFaqs = faqCategory === 'all' 
    ? faqsList 
    : faqsList.filter(f => f.category === faqCategory);

  return (
    <div className="min-h-screen bg-neutral-50/50 text-[#0A0A0A] selection:bg-[#E5383B] selection:text-white pt-24 sm:pt-28">
      
      {/* ====================================================================
          1. TOP BANNER / BREADCRUMB HEADER
         ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        
        {/* Back Link */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-[#E5383B] transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Title Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2 bg-red-50/80 px-3.5 py-1.5 rounded-full border border-red-100">
              <Sparkles className="w-3.5 h-3.5 text-[#E5383B]" />
              <span>24/7 Expedition Dispatch &amp; Mountain Bases</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black font-outfit text-[#0A0A0A] tracking-tight">
              Contact TrekToShikhar
            </h1>
            
            <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Have questions regarding trail conditions, winter gear requirements, or customized batches? Reach our certified Himalayan leaders directly across our mountain bases.
            </p>
          </div>

          {/* Live Desk Status Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white px-4 py-2.5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs">
              <span className="font-extrabold text-[#0A0A0A] block">Lead Desk Active</span>
              <span className="text-neutral-500 text-[11px]">{settings.hours || "7:00 AM – 10:00 PM IST"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. DYNAMIC CONTACT & PHYSICAL OFFICE CARDS GRID
         ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* CARD 1: DIRECT LEAD COORDINATOR LINE */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E5383B] to-[#C92A2A] text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E5383B]">Direct Coordinator Line</span>
              <h3 className="font-outfit font-black text-xl text-[#0A0A0A] mt-1 mb-2">
                {settings.phone || "+91 87912 18377"}
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Call or message directly for immediate slot booking, weather reports, and trail advisories.
              </p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2">
              <a
                href={`tel:${String(settings.phone || '+918791218377').replace(/[^\d+]/g, '')}`}
                className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 text-white text-xs font-bold text-center hover:bg-[#E5383B] transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href={getCleanWhatsAppUrl(
                  settings.whatsapp || settings.phone,
                  "Namaste TrekToShikhar Team! 🏔️ I am reaching out from your Contact Us page and would like to inquire about upcoming Himalayan treks, batch dates, and bookings."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* DYNAMIC OFFICE CARDS (FROM DATABASE: DEHRADUN HQ, HALDWANI BASE, SHIMLA, ETC.) */}
          {offices.map((office, idx) => (
            <div 
              key={office.id || idx}
              className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#E5383B]">
                  {office.badge || `${office.city} Expedition Base`}
                </span>
                <h3 className="font-outfit font-black text-lg text-[#0A0A0A] mt-1 mb-2">
                  {office.name}
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  {office.address}
                </p>
                {office.landmark && (
                  <p className="text-neutral-400 text-[11px] mt-1">
                    Landmark: {office.landmark}
                  </p>
                )}
              </div>
              
              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2">
                <button
                  onClick={() => handleSelectMapOffice(office.id)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#E5383B]" />
                  <span>View on Map</span>
                </button>
              </div>
            </div>
          ))}

          {/* CARD: OFFICIAL EMAIL */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                {copiedEmail && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black animate-fade-in flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </span>
                )}
              </div>
              
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">Official Inquiries</span>
              <div className="flex items-center gap-1.5 mt-1 mb-2">
                <h3 
                  onClick={handleEmailClick}
                  className="font-outfit font-black text-base sm:text-lg text-[#0A0A0A] truncate cursor-pointer hover:text-blue-600 transition"
                  title="Click to compose in Gmail"
                >
                  {settings.email || "bookings@trektoshikhar.com"}
                </h3>
                <button
                  type="button"
                  onClick={handleCopyEmailOnly}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-neutral-500 text-xs leading-relaxed">
                For corporate offsites, custom private group batches, and institutional expeditions.
              </p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2">
              <button
                type="button"
                onClick={handleEmailClick}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:bg-neutral-900 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </button>

              <button
                type="button"
                onClick={handleCopyEmailOnly}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                  copiedEmail 
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700' 
                    : 'border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
                title="Copy email to clipboard"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ====================================================================
          3. INTERACTIVE SECTION: INQUIRY FORM + DYNAMIC GOOGLE MAP EMBED
         ==================================================================== */}
      <div ref={mapSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 6 COLS: MODERN EXPEDITION INQUIRY FORM */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-9 border border-neutral-200/90 shadow-sm">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Quick Mountain Consultation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[#0A0A0A]">
                Send Direct Message
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                Fill the details below. Our certified leaders will respond with trail status and batch options.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-editorial-fade">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-outfit font-black text-xl text-neutral-900">
                  Inquiry Dispatched to Operations Desk!
                </h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. Your inquiry for <strong>{formData.trekInterest}</strong> has been recorded. If WhatsApp didn't open automatically, click the button below:
                </p>
                <div className="pt-2">
                  <a
                    href={submittedWaUrl || getCleanWhatsAppUrl(settings.whatsapp || settings.phone, 'Namaste TrekToShikhar Team! 🏔️ I submitted an inquiry from your Contact page.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-md transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open WhatsApp Chat Directly</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="text-xs text-neutral-500 hover:text-black underline block mx-auto cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                
                {/* Row 1: Full Name & WhatsApp Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Your Full Name <span className="text-[#E5383B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Vinay Pathak"
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 bg-neutral-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      WhatsApp Phone <span className="text-[#E5383B]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 8791218377"
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 bg-neutral-50/50"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Number of Trekkers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="vinay@example.com"
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 bg-neutral-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Number of Trekkers
                    </label>
                    <select
                      name="trekkerCount"
                      value={formData.trekkerCount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 bg-neutral-50/50 cursor-pointer"
                    >
                      <option value="1">1 Trekker (Solo Adventurer)</option>
                      <option value="2">2 Trekkers (Duo / Couple)</option>
                      <option value="3-5">3 - 5 Trekkers (Small Group)</option>
                      <option value="6-10">6 - 10 Trekkers (Private Batch)</option>
                      <option value="10+">10+ Trekkers (Corporate / Group)</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Trek Interest & Preferred Month */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Trek of Interest
                    </label>
                    <select
                      name="trekInterest"
                      value={formData.trekInterest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 bg-neutral-50/50 cursor-pointer"
                    >
                      {TREKS.map(t => (
                        <option key={t.id} value={t.title}>
                          {t.title} ({t.altitude})
                        </option>
                      ))}
                      <option value="General Mountain Guidance">Not decided yet / General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Target Travel Window
                    </label>
                    <select
                      name="travelMonth"
                      value={formData.travelMonth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 bg-neutral-50/50 cursor-pointer"
                    >
                      <option value="Upcoming Weekend">Upcoming Weekend</option>
                      <option value="Next 15 Days">Within Next 15 Days</option>
                      <option value="Next Month">Next Month</option>
                      <option value="Winter Season (Dec–Feb)">Winter Snow Season (Dec–Feb)</option>
                      <option value="Spring / Summer (Mar–Jun)">Spring / Summer (Mar–Jun)</option>
                    </select>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Your Question / Custom Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="e.g. Inquiring about snow level at Nag Tibba summit, pickup from Haldwani/Dehradun, or need private tent accommodation."
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 bg-neutral-50/50 resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5383B] via-[#D90429] to-[#C1121F] hover:from-neutral-900 hover:to-neutral-900 text-white font-black text-sm tracking-wide shadow-[0_8px_25px_rgba(229,56,59,0.4)] hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Logging Inquiry...' : `Send Inquiry to Mountain Team (${settings.phone || '+91 87912 18377'})`}</span>
                </button>

                <p className="text-[11px] text-neutral-400 text-center">
                  ⚡ Pre-fills directly to WhatsApp &amp; recorded on lead desk. Zero spam guaranteed.
                </p>

              </form>
            )}
          </div>

          {/* RIGHT 6 COLS: DYNAMIC INTERACTIVE HIMALAYAN MAP EMBED */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-9 border border-neutral-200/90 shadow-sm flex flex-col justify-between">
            
            <div>
              {/* Header with Switcher Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Himalayan Gateway Hubs</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-outfit text-[#0A0A0A]">
                    Interactive Base Map
                  </h3>
                </div>

                {/* Dynamic Map Base Selector Tabs */}
                <div className="inline-flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200 text-xs font-bold shrink-0 self-start sm:self-auto overflow-x-auto max-w-full scrollbar-none">
                  {offices.map((office) => (
                    <button
                      key={office.id}
                      onClick={() => setSelectedOfficeId(office.id)}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                        (selectedOfficeId === office.id || (selectedOfficeId === 'all' && office.is_main_hq)) 
                          ? 'bg-white text-[#E5383B] shadow-2xs font-black' 
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      {office.city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Map Iframe Container */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-inner h-72 sm:h-84 bg-neutral-100">
                <iframe
                  title="TrekToShikhar Base Camps Map"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Map Overlay Pill */}
                <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/85 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E5383B] shrink-0" />
                    <div>
                      <span className="font-bold block">
                        {currentOfficeForMap?.name || 'TrekToShikhar Base Hub'}
                      </span>
                      <span className="text-[11px] text-white/70">
                        {currentOfficeForMap?.address || 'Himalayan Mountain Coordination Center'}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(currentOfficeForMap?.address || currentOfficeForMap?.name || 'Dehradun')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white text-white hover:text-black font-extrabold text-[11px] transition flex items-center gap-1"
                  >
                    <span>Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Dynamic Base Camp Highlights from DB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-neutral-100 text-xs">
              {offices.slice(0, 2).map((off) => (
                <div key={off.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <span className="font-bold text-[#0A0A0A] block">{off.name}</span>
                  <p className="text-neutral-500 text-[11px] mt-0.5">{off.address}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ====================================================================
          4. MODERN STYLISH ANIMATED ACCORDION FAQS SECTION
         ==================================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5383B] uppercase tracking-widest mb-2 bg-red-50/80 px-3.5 py-1.5 rounded-full border border-red-100">
            <Compass className="w-3.5 h-3.5 text-[#E5383B]" />
            <span>Essential Himalayan Guidance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-outfit text-[#0A0A0A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            Everything you need to know about trail difficulty, altitude safety, equipment, and batch bookings.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'beginners', label: 'First Timers' },
              { id: 'safety', label: 'Safety & Medical' },
              { id: 'gear', label: 'Gear & Tents' },
              { id: 'booking', label: 'Bookings & Refunds' },
              { id: 'transport', label: 'Pickups & Transport' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFaqCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  faqCategory === cat.id
                    ? 'bg-[#E5383B] text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
                  isOpen 
                    ? 'border-[#E5383B]/50 shadow-[0_8px_25px_rgba(229,56,59,0.12)]' 
                    : 'border-neutral-200/90 shadow-2xs hover:border-neutral-300'
                }`}
              >
                {/* Accordion Question Trigger */}
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className={`font-outfit font-extrabold text-base sm:text-lg transition-colors leading-snug ${
                    isOpen ? 'text-[#E5383B]' : 'text-[#0A0A0A]'
                  }`}>
                    {faq.question}
                  </span>
                  
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'bg-[#E5383B] text-white rotate-180' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {/* Animated Accordion Body */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 animate-editorial-fade">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* ====================================================================
          5. BOTTOM DIRECT REACH SECTION (FULL-BLEED DARK OBSIDIAN THEME)
         ==================================================================== */}
      <section className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 bg-neutral-900 text-white border-t border-neutral-800">
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(229,56,59,0.28) 0%, rgba(255,215,0,0.06) 45%, transparent 72%)'
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950/90 border border-neutral-800 hover:border-[#E5383B]/45 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
            <div className="text-left relative z-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#FFD700] mb-1.5 block">
                Still Have Custom Questions?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-outfit text-white">
                Talk Directly with Our Lead Guide
              </h3>
              <p className="text-neutral-300 text-xs sm:text-sm mt-1">
                Call or WhatsApp anytime at <strong className="text-white">{settings.phone || '+91 87912 18377'}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
              <a
                href={getCleanWhatsAppUrl(
                  settings.whatsapp || settings.phone,
                  "Namaste TrekToShikhar Team! 🏔️ I would like to speak directly with the Lead Mountain Coordinator regarding upcoming Himalayan treks, custom batches, and weather advisories."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              
              <a
                href={`tel:${String(settings.phone || '+918791218377').replace(/[^\d+]/g, '')}`}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FFD700] text-[#0A0A0A] font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#E5383B]" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
