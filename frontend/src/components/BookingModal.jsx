import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Calendar, 
  Users, 
  Phone, 
  User, 
  Mail, 
  Mountain, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { AGENCY_CONTACT } from '../data/treksData';

export default function BookingModal({ isOpen, onClose, trek, selectedPackage }) {
  if (!isOpen || !trek) return null;

  // Active package details
  const activePackage = selectedPackage || (trek.packages && trek.packages[0]) || {
    name: "Standard Batch",
    price: trek.price,
    duration: trek.duration
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    trekkers: 2,
    batchDate: '',
    customNote: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [generatedWaUrl, setGeneratedWaUrl] = useState('');

  // Sample upcoming batches for convenient selection
  const upcomingBatches = [
    "Upcoming Weekend (Sat - Sun)",
    "28 Nov – 02 Dec 2026",
    "05 Dec – 09 Dec 2026",
    "15 Dec – 19 Dec 2026 (Snow Batch)",
    "24 Dec – 28 Dec 2026 (Christmas Special)",
    "30 Dec – 03 Jan 2027 (New Year Summit Push)",
    "Custom Date (Mention in Note)"
  ];

  useEffect(() => {
    // Default batch date
    if (!formData.batchDate) {
      setFormData(prev => ({ ...prev, batchDate: upcomingBatches[0] }));
    }
  }, [trek]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const unitPrice = activePackage.price || trek.price;
  const totalPrice = unitPrice * formData.trekkers;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTrekkersChange = (delta) => {
    setFormData(prev => ({
      ...prev,
      trekkers: Math.max(1, Math.min(15, prev.trekkers + delta))
    }));
  };

  // Construct structured WhatsApp booking message
  const generateWhatsAppMessage = () => {
    return `Namaste TrekToShikhar! 🏔️
I would like to book a batch for:
━━━━━━━━━━━━━━━━━━━━
📍 Trek: ${trek.title}
⏳ Duration: ${trek.duration}
⛺ Base: ${trek.baseCamp || trek.location}
📦 Package: ${activePackage.name} (₹${unitPrice.toLocaleString('en-IN')}/person)
📅 Batch Date: ${formData.batchDate}
👥 Number of Trekkers: ${formData.trekkers} Person${formData.trekkers > 1 ? 's' : ''}
💵 Estimated Total: ₹${totalPrice.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━
👤 Name: ${formData.name || 'Not provided'}
📱 WhatsApp: ${formData.phone || 'Not provided'}
${formData.email ? `✉️ Email: ${formData.email}\n` : ''}${formData.customNote ? `💬 Note: ${formData.customNote}\n` : ''}━━━━━━━━━━━━━━━━━━━━
Please confirm slot availability and payment details!`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please provide your Name and WhatsApp phone number.");
      return;
    }

    setIsSubmitting(true);
    const message = generateWhatsAppMessage();
    const waUrl = `https://wa.me/${AGENCY_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
    setGeneratedWaUrl(waUrl);

    // 1. Log lead into backend API if server is alive (fail-safe)
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        trek_id: trek.id,
        trek_title: trek.title,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        batch_date: formData.batchDate,
        trekkers_count: formData.trekkers,
        total_amount: totalPrice,
        package_name: activePackage.name,
        notes: formData.customNote
      }, { timeout: 3500 });
    } catch (err) {
      console.warn("Backend API offline or silent; proceeding to direct WhatsApp dispatch.", err);
    }

    // 2. Open WhatsApp Web / App directly
    setIsSubmitting(false);
    setSubmittedSuccess(true);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-editorial-fade"
    >
      {/* 1. SCREEN-LEVEL FIXED CLOSE BUTTON (ALWAYS VISIBLE & NEVER CUT OFF) */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-60 px-4 py-2 rounded-full bg-neutral-900/95 hover:bg-[#E5383B] text-white text-xs font-black shadow-2xl border border-white/25 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
        title="Close form (Esc)"
      >
        <X className="w-4 h-4" />
        <span>Close (Esc)</span>
      </button>

      {/* 2. MODAL CARD (FLEX CONTAINER WITH MAX-HEIGHT TO FIT ON ANY SCREEN) */}
      <div 
        className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden text-[#0A0A0A] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Ribbon Header */}
        <div className="bg-gradient-to-r from-[#F05558] via-[#E5383B] to-[#DA2F33] text-white p-4 sm:p-5 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/30 hover:bg-black/60 text-white text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer border border-white/20 shadow-xs"
            aria-label="Close booking modal"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-white/25">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Instant WhatsApp Booking</span>
          </div>

          <h3 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            Book Batch Slot
          </h3>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Pre-fills your inquiry directly to our certified mountain team on WhatsApp.
          </p>
        </div>

        {/* Selected Trek Snapshot Bar */}
        <div className="bg-neutral-50 px-5 sm:px-6 py-3 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div>
            <p className="font-outfit font-black text-sm text-[#0A0A0A] flex items-center gap-1.5">
              <Mountain className="w-4 h-4 text-[#E5383B]" />
              <span>{trek.title}</span>
            </p>
            <p className="text-neutral-500 text-[11px] mt-0.5">
              {activePackage.name} • {trek.duration} • Base: {trek.baseCamp || trek.location}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-500 block">Package Rate</span>
            <span className="font-black text-base text-[#E5383B]">
              ₹{unitPrice.toLocaleString('en-IN')}
              <span className="text-[10px] text-neutral-500 font-normal"> /person</span>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        {submittedSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h4 className="font-outfit font-black text-2xl text-[#0A0A0A]">
              WhatsApp Booking Initiated!
            </h4>

            <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed">
              Your inquiry for <strong className="text-neutral-900">{trek.title}</strong> has been prepared. If WhatsApp didn't open automatically, click the button below:
            </p>

            <div className="pt-2">
              <a
                href={generatedWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp Chat Now</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#E5383B] text-white text-xs font-bold transition cursor-pointer mt-2"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close Window</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Vinay Pathak"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  WhatsApp Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 8791218377"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15"
                  />
                </div>
              </div>
            </div>

            {/* Email (Optional) & Preferred Batch Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vinay@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#E5383B] focus:ring-2 focus:ring-[#E5383B]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Preferred Batch Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    name="batchDate"
                    value={formData.batchDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#E5383B] bg-white text-neutral-800"
                  >
                    {upcomingBatches.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Trekkers Counter & Total Calculation */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
                  Number of Trekkers
                </span>
                <span className="text-[11px] text-neutral-500">
                  Batches capped strictly at 12–15 persons
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-neutral-300 rounded-xl bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => handleTrekkersChange(-1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-l-xl transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-9 text-center font-black text-sm text-neutral-900">
                    {formData.trekkers}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTrekkersChange(1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-r-xl transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="text-right pl-3 border-l border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Estimated Total</span>
                  <span className="font-outfit font-black text-lg text-[#E5383B]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Special Note / Custom Request <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <textarea
                name="customNote"
                rows="2"
                value={formData.customNote}
                onChange={handleChange}
                placeholder="e.g. Need transport from Dehradun station, or looking for private tent."
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#E5383B]"
              />
            </div>

            {/* Live WhatsApp Preview Box */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Clicking <strong>"Proceed to WhatsApp Booking"</strong> will launch WhatsApp with your pre-filled expedition details to our team (<span className="font-bold">{AGENCY_CONTACT.displayPhone}</span>).
              </p>
            </div>

            {/* Submit and Cancel CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3.5 px-5 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shrink-0"
              >
                Cancel / Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0f7a6d] text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>{isSubmitting ? 'Preparing WhatsApp...' : 'Proceed to WhatsApp Booking'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
