import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Mountain, 
  Calendar, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { AGENCY_CONTACT } from '../data/treksData';
import { openWhatsAppBooking } from '../lib/whatsapp';

export default function BookingModal({ isOpen, onClose, trek, selectedPackage }) {
  if (!isOpen || !trek) return null;

  // Active package details
  const activePackage = selectedPackage || (trek.packages && trek.packages[0]) || {
    name: "Standard Batch",
    price: trek.price,
    duration: trek.duration
  };

  const [trekkers, setTrekkers] = useState(2);
  const [selectedBatch, setSelectedBatch] = useState("Upcoming Weekend (Sat - Sun)");
  const [customNote, setCustomNote] = useState('');

  // Sample upcoming batches for quick selection
  const upcomingBatches = [
    "Upcoming Weekend (Sat - Sun)",
    "28 Nov – 02 Dec 2026",
    "05 Dec – 09 Dec 2026",
    "15 Dec – 19 Dec 2026 (Snow Batch)",
    "24 Dec – 28 Dec 2026 (Christmas Special)",
    "30 Dec – 03 Jan 2027 (New Year Summit Push)",
    "Custom Group Departure (Flexible)"
  ];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  const unitPrice = activePackage.price || trek.price || 0;
  const totalPrice = unitPrice * trekkers;

  const handleLaunchWhatsApp = () => {
    const noteText = `Batch: ${selectedBatch} | Trekkers: ${trekkers} Person${trekkers > 1 ? 's' : ''}${customNote ? ` | Note: ${customNote}` : ''}`;
    openWhatsAppBooking({ 
      trek, 
      pkg: activePackage, 
      customNote: noteText 
    });
    onClose();
  };

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
    >
      {/* SCREEN-LEVEL FIXED CLOSE BUTTON */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000000] px-4 py-2 rounded-full bg-neutral-900/95 hover:bg-[#E5383B] text-white text-xs font-black shadow-2xl border border-white/25 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
        <span>Close</span>
      </button>

      {/* MODAL CARD */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden text-[#0A0A0A] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#F05558] via-[#E5383B] to-[#DA2F33] text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/25 hover:bg-black/50 text-white text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer border border-white/20"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-white/25">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Direct WhatsApp Booking</span>
          </div>

          <h3 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            Connect With Guide Team
          </h3>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Zero complex forms. Opens directly into WhatsApp with your selected trek details!
          </p>
        </div>

        {/* Selected Trek Snapshot Bar */}
        <div className="bg-neutral-50 px-5 sm:px-6 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-outfit font-black text-base text-[#0A0A0A] flex items-center gap-1.5">
              <Mountain className="w-4.5 h-4.5 text-[#E5383B]" />
              <span>{trek.title}</span>
            </p>
            <p className="text-neutral-500 text-xs mt-0.5">
              {activePackage.name} • {trek.duration} • Base: {trek.baseCamp || trek.location}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-500 block">Package Rate</span>
            <span className="font-black text-lg text-[#E5383B]">
              ₹{unitPrice.toLocaleString('en-IN')}
              <span className="text-[11px] text-neutral-500 font-normal"> /person</span>
            </span>
          </div>
        </div>

        {/* Quick Options */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Quick Batch Selection */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Select Target Departure Batch
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#E5383B] bg-white text-neutral-800"
              >
                {upcomingBatches.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Trekkers Count */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/90 flex items-center justify-between gap-3">
            <div>
              <span className="block text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
                Group Size / Trekkers
              </span>
              <span className="text-[11px] text-neutral-500">
                Total Estimate: <strong className="text-[#E5383B]">₹{totalPrice.toLocaleString('en-IN')}</strong> ({trekkers} Pax)
              </span>
            </div>

            <div className="flex items-center border border-neutral-300 rounded-xl bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setTrekkers(p => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 font-bold rounded-l-xl transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-9 text-center font-bold text-xs text-neutral-900">
                {trekkers}
              </span>
              <button
                type="button"
                onClick={() => setTrekkers(p => Math.min(20, p + 1))}
                className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 font-bold rounded-r-xl transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Quick Note (Optional) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Custom Note / Questions <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Need rental gear / coming from Delhi / student discount"
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#E5383B]"
            />
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLaunchWhatsApp}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-neutral-950 hover:to-neutral-900 text-white hover:text-[#25D366] font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer border border-transparent hover:border-[#25D366]"
            >
              <MessageSquare className="w-5 h-5 fill-white shrink-0" />
              <span>Launch WhatsApp Chat Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] text-neutral-400 mt-2">
              ⚡ Pre-fills <strong className="text-neutral-700">{trek.title}</strong>, price &amp; batch details directly to our team ({AGENCY_CONTACT.displayPhone}).
            </p>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
