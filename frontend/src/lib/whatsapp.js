import { AGENCY_CONTACT } from '../data/treksData';

/**
 * Builds a clean, professional, high-converting WhatsApp message
 * tailored to the specific trek and package selected by the user.
 */
export function buildWhatsAppBookingMessage({ trek = null, pkg = null, customNote = '' } = {}) {
  // 1. Generic inquiry if no specific trek is provided
  if (!trek) {
    return `Namaste TrekToShikhar Team! 🏔️

I am planning a Himalayan trek and would like to know about your upcoming expeditions, batch dates, and pricing.

Could you please connect with me and share the available options?
Thank you!`;
  }

  // 2. Specific Trek Inquiry / Booking
  const trekTitle = trek.title || 'Himalayan Expedition';
  const duration = trek.duration || '';
  const altitude = trek.altitude ? ` (${trek.altitude})` : '';
  const location = trek.baseCamp || trek.location || trek.region || '';
  
  // Format price string
  let priceStr = '';
  if (pkg && pkg.price) {
    const pVal = typeof pkg.price === 'number' ? `₹${pkg.price.toLocaleString('en-IN')}` : pkg.price;
    priceStr = `${pVal} per person`;
  } else if (trek.price) {
    const pVal = typeof trek.price === 'number' ? `₹${trek.price.toLocaleString('en-IN')}` : (trek.formattedPrice || `₹${trek.price}`);
    priceStr = `${pVal} per person`;
  }

  const lines = [
    `Namaste TrekToShikhar Team! 🏔️`,
    ``,
    `I want to inquire & book this Himalayan trek:`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🏔️ *Trek:* ${trekTitle}${altitude}`,
  ];

  if (priceStr) {
    lines.push(`💰 *Price:* ${priceStr}`);
  }

  if (duration) {
    lines.push(`⏱️ *Duration:* ${duration}`);
  }

  if (location) {
    lines.push(`📍 *Base / Region:* ${location}`);
  }

  if (pkg && (pkg.name || pkg.title)) {
    lines.push(`📦 *Selected Package:* ${pkg.name || pkg.title}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(``);
  lines.push(`Could you please share:`);
  lines.push(`1. Upcoming batch departure dates & seat availability`);
  lines.push(`2. Complete day-wise itinerary & inclusions`);
  lines.push(`3. Booking & payment confirmation details`);

  if (customNote) {
    lines.push(``);
    lines.push(`💬 *Note:* ${customNote}`);
  }

  lines.push(``);
  lines.push(`Looking forward to trekking with TrekToShikhar!`);

  return lines.join('\n');
}

/**
 * Directly launches WhatsApp with zero intermediate forms.
 * Opens in a new tab, or redirects smoothly if popup blocker restricts new tabs.
 */
export function openWhatsAppBooking({ trek = null, pkg = null, customNote = '' } = {}) {
  const phone = AGENCY_CONTACT.whatsappNumber || '918791218377';
  const message = buildWhatsAppBookingMessage({ trek, pkg, customNote });
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // Non-blocking fail-safe lead capture to backend if available
  try {
    if (trek && typeof window !== 'undefined' && window.fetch) {
      fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trek_id: trek.id || trek.slug || 'trek',
          trek_title: trek.title || 'Inquiry',
          package_name: pkg?.name || 'Standard',
          source: 'direct_whatsapp_click',
          created_at: new Date().toISOString()
        })
      }).catch(() => {});
    }
  } catch {
    // Silent
  }

  // Directly open WhatsApp
  if (typeof window !== 'undefined') {
    const newWin = window.open(waUrl, '_blank', 'noopener,noreferrer');
    // If popup blocker intervened, fall back to setting window.location
    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      window.location.href = waUrl;
    }
  }

  return waUrl;
}
