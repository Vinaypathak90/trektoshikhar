import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { AGENCY_CONTACT, TREKS } from '../data/treksData';

export default function ContactUsPage({ onBackToHome, onOpenBookingModal }) {
  const navigate = useNavigate();
  const handleBack = onBackToHome || (() => navigate('/'));

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
  const [activeFaq, setActiveFaq] = useState(0);
  const [faqCategory, setFaqCategory] = useState('all');
  const [selectedMapBase, setSelectedMapBase] = useState('both');

  // Contact form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit inquiry -> opens WhatsApp with structured details
  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert("Please provide your full name and WhatsApp phone number.");
      return;
    }

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

    const waUrl = `https://wa.me/${AGENCY_CONTACT.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
    
    setFormSubmitted(true);
    
    // Open WhatsApp in new tab
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  // Modern FAQs Dataset
  const FAQS = [
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
    },
    {
      id: 7,
      category: 'booking',
      question: "What is your rescheduling and cancellation policy?",
      answer: "Mountain weather and personal plans change. Notify us 7+ days before departure for a 100% trek credit voucher valid for 1 full year with zero transfer fee. Cancellations made 3-6 days in advance receive an 80% voucher."
    },
    {
      id: 8,
      category: 'safety',
      question: "Can solo female trekkers join TrekToShikhar batches safely?",
      answer: "Over 40% of our regular trekkers are solo women. We offer dedicated, secure tent allocations for female travelers, female-friendly hygiene amenities on trail, and a strictly vetted, respectful camp community."
    }
  ];

  const filteredFaqs = faqCategory === 'all' 
    ? FAQS 
    : FAQS.filter(f => f.category === faqCategory);

  // Map Embed URLs
  const MAP_URLS = {
    dehradun: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.74637207436!2d77.96288349257631!3d30.32556456722883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888af%3A0x4c3562c032518799!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    shimla: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109312.98677464062!2d77.10098906322301!3d31.10481454179313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390578e3e35d6e67%3A0x1f7e7ff6ff9f54b7!2sShimla%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    both: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d882583.567823521!2d77.6258905390625!3d30.718890250000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24 text-[#0A0A0A] selection:bg-[#E5383B] selection:text-white pt-24 sm:pt-28">
      
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
              Have questions regarding trail conditions, winter gear requirements, or customized batches? Reach our certified Himalayan leaders directly in <strong>Shimla</strong> and <strong>Dehradun</strong>.
            </p>
          </div>

          {/* Live Desk Status Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white px-4 py-2.5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs">
              <span className="font-extrabold text-[#0A0A0A] block">Mountain Desk Online</span>
              <span className="text-neutral-500 text-[11px]">Instant reply via WhatsApp / Call</span>
            </div>
          </div>
        </div>

      </div>

      {/* ====================================================================
          2. 4 PREMIUM CONTACT CARDS (GLASSMORPHISM WITH THEME ACCENTS)
         ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* CARD 1: DIRECT PHONE & WHATSAPP */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E5383B] to-[#C92A2A] text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E5383B]">Direct Coordinator Line</span>
              <h3 className="font-outfit font-black text-xl text-[#0A0A0A] mt-1 mb-2">
                +91 87912 18377
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Call or message directly for immediate slot booking, weather reports, and trail advisories.
              </p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2">
              <a
                href={`tel:+918791218377`}
                className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 text-white text-xs font-bold text-center hover:bg-[#E5383B] transition-colors"
              >
                Call Now
              </a>
              <a
                href={`https://wa.me/${AGENCY_CONTACT.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold text-center hover:bg-[#20bd5a] transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* CARD 2: SHIMLA BASE HUB */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">Himachal Expedition Base</span>
              <h3 className="font-outfit font-black text-lg text-[#0A0A0A] mt-1 mb-2">
                Shimla Hub
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                The Ridge, Near Christ Church, Shimla, HP 171001. Gateway for Hatu Peak, Churdhar &amp; Kinnaur.
              </p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setSelectedMapBase('shimla')}
                className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[#E5383B]" />
                <span>View on Map</span>
              </button>
            </div>
          </div>

          {/* CARD 3: DEHRADUN BASE HUB */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 text-[#E5383B]" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E5383B]">Uttarakhand Expedition Base</span>
              <h3 className="font-outfit font-black text-lg text-[#0A0A0A] mt-1 mb-2">
                Dehradun Hub
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Rajpur Road, Near Clock Tower, Dehradun, UK 248001. Gateway for Nag Tibba, Kedarkantha &amp; Kuari Pass.
              </p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setSelectedMapBase('dehradun')}
                className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[#E5383B]" />
                <span>View on Map</span>
              </button>
            </div>
          </div>

          {/* CARD 4: OFFICIAL EMAIL */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">Official Inquiries</span>
              <h3 className="font-outfit font-black text-lg text-[#0A0A0A] mt-1 mb-2 truncate">
                bookings@trektoshikhar.com
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                For corporate offsites, custom private group batches, and institutional expeditions.
              </p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-neutral-100">
              <a
                href="mailto:bookings@trektoshikhar.com"
                className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-blue-600 hover:text-white text-neutral-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 block"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ====================================================================
          3. INTERACTIVE SECTION: INQUIRY FORM + DEFAULT GOOGLE MAP EMBED
         ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
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
                  Inquiry Dispatched to WhatsApp!
                </h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. Your inquiry for <strong>{formData.trekInterest}</strong> has been prepared. If WhatsApp didn't open automatically, click the button below:
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${AGENCY_CONTACT.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-md transition cursor-pointer"
                  >
                    <span>Open WhatsApp Chat Directly</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="text-xs font-bold text-neutral-500 hover:text-black underline block mx-auto cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                
                {/* Row 1: Name & Phone */}
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
                      <option value="December 2026 (Winter Snow)">December 2026 (Winter Snow)</option>
                      <option value="January 2027 (Peak Snow)">January 2027 (Peak Snow)</option>
                      <option value="Spring / Summer 2027">Spring / Summer 2027</option>
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
                    placeholder="e.g. Inquiring about snow level at Nag Tibba summit, or need private tent accommodation."
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15 bg-neutral-50/50 resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5383B] via-[#D90429] to-[#C1121F] hover:from-neutral-900 hover:to-neutral-900 text-white font-black text-sm tracking-wide shadow-[0_8px_25px_rgba(229,56,59,0.4)] hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry to Mountain Team (+91 87912 18377)</span>
                </button>

                <p className="text-[11px] text-neutral-400 text-center">
                  ⚡ Pre-fills directly to WhatsApp. Zero spam guaranteed.
                </p>

              </form>
            )}
          </div>

          {/* RIGHT 6 COLS: DEFAULT INTERACTIVE HIMALAYAN MAP EMBED */}
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

                {/* Map Base Selector Tabs */}
                <div className="inline-flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200 text-xs font-bold shrink-0 self-start sm:self-auto">
                  <button
                    onClick={() => setSelectedMapBase('both')}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                      selectedMapBase === 'both' ? 'bg-white text-[#E5383B] shadow-2xs' : 'text-neutral-600'
                    }`}
                  >
                    All Hubs
                  </button>
                  <button
                    onClick={() => setSelectedMapBase('dehradun')}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                      selectedMapBase === 'dehradun' ? 'bg-white text-[#E5383B] shadow-2xs' : 'text-neutral-600'
                    }`}
                  >
                    Dehradun
                  </button>
                  <button
                    onClick={() => setSelectedMapBase('shimla')}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                      selectedMapBase === 'shimla' ? 'bg-white text-[#E5383B] shadow-2xs' : 'text-neutral-600'
                    }`}
                  >
                    Shimla
                  </button>
                </div>
              </div>

              {/* Default Map Iframe Container */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-inner h-72 sm:h-84 bg-neutral-100">
                <iframe
                  title="TrekToShikhar Base Camps Map"
                  src={MAP_URLS[selectedMapBase]}
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
                        {selectedMapBase === 'shimla' ? 'Shimla Base Hub (HP)' : selectedMapBase === 'dehradun' ? 'Dehradun Base Hub (UK)' : 'Himalayan Corridor Base Hubs'}
                      </span>
                      <span className="text-[11px] text-white/70">
                        {selectedMapBase === 'shimla' ? 'The Ridge, Christ Church' : selectedMapBase === 'dehradun' ? 'Rajpur Road, Clock Tower' : 'Dual Headquarters across Shimla & Dehradun'}
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com"
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

            {/* Bottom Base Camp Highlights */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-neutral-100 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="font-bold text-[#0A0A0A] block">Dehradun Station Hub</span>
                <p className="text-neutral-500 text-[11px] mt-0.5">Pickup at 6:30 AM for Nag Tibba &amp; Kedarkantha.</p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="font-bold text-[#0A0A0A] block">Shimla ISBT Hub</span>
                <p className="text-neutral-500 text-[11px] mt-0.5">Direct departures for Hatu Peak &amp; Churdhar.</p>
              </div>
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
          {filteredFaqs.map((faq, index) => {
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
          5. BOTTOM DIRECT REACH BANNER
         ==================================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-neutral-950 via-[#180406] to-neutral-950 border border-[#E5383B]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left relative z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FFD700] mb-1.5 block">
              Still Have Custom Questions?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-white">
              Talk Directly with Our Lead Guide
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm mt-1">
              Call or WhatsApp anytime at <strong className="text-white">+91 87912 18377</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <a
              href={`https://wa.me/${AGENCY_CONTACT.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            
            <a
              href="tel:+918791218377"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-100 text-[#0A0A0A] font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#E5383B]" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
