import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  Mountain, 
  Compass, 
  Users, 
  MapPin, 
  Activity, 
  Tent, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';

export default function AboutUsPage({ onBackToHome, onExploreTreks, onContactWhatsApp }) {
  const navigate = useNavigate();
  const handleBack = onBackToHome || (() => navigate('/'));
  const handleExplore = onExploreTreks || (() => navigate('/track'));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const milestones = [
    {
      year: "2018",
      title: "Born on the Trails of Shimla & Dehradun",
      desc: "Founded by childhood mountain friends and certified NIM Uttarkashi graduates who wanted to change how trekking was done in India."
    },
    {
      year: "2020",
      title: "Strict 15-Trekker Small Batch Policy",
      desc: "While commercial agencies expanded to 40+ people herds, we capped our groups strictly at 12–15 to preserve genuine camaraderie and safety."
    },
    {
      year: "2023",
      title: "100% Medical Grade Altitude Protocols",
      desc: "Equipped every expedition with high-altitude portable oxygen cylinders, pulse oximeters, and certified Wilderness First Responders."
    },
    {
      year: "2026",
      title: "2,400+ Trekkers Guided to Their Shikhar",
      desc: "Maintaining an unblemished safety record and a 4.9★ rating across Uttarakhand and Himachal Pradesh."
    }
  ];

  const standards = [
    {
      icon: Award,
      title: "Govt. Accredited Mountaineers",
      desc: "Every expedition is led by leaders certified from Nehru Institute of Mountaineering (NIM) or ABVIMAS Manali with a minimum of 8+ years Himalayan experience."
    },
    {
      icon: Activity,
      title: "Medical-Grade Safety Kits",
      desc: "Equipped with high-altitude portable oxygen cylinders, pulse oximeters, AMS preventative medications, and certified Wilderness First Aid response."
    },
    {
      icon: Tent,
      title: "Tested 4-Season Alpine Gear",
      desc: "Custom waterproof double-layered dome tents, -10°C rated thermal sleeping bags, high-traction crampons, microspikes, and freshly cooked nutritious meals."
    },
    {
      icon: HeartHandshake,
      title: "Leave No Trace (Eco-Trek)",
      desc: "Strict zero-plastic protocol. Our teams actively clean trash left behind by commercial tourists on summit ridges and carry it down for recycling."
    }
  ];

  const bases = [
    {
      name: "Dehradun Expedition Base",
      state: "Uttarakhand",
      address: "Rajpur Road & Pantwari Base Station",
      coverage: "Kedarkantha, Nag Tibba, Har Ki Dun, Govind Sanctuary",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Shimla Foothills Base",
      state: "Himachal Pradesh",
      address: "The Mall & Narkanda Apple Valley Camp",
      coverage: "Hatu Peak, Churdhar Sanctuary, Shrikhand, Kinnaur Ridge",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] pb-24 selection:bg-[#E5383B] selection:text-white pt-24 sm:pt-28">
      
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-[#E5383B] transition-colors cursor-pointer group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Hero Banner Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white p-8 sm:p-14 border border-neutral-800 shadow-2xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80" 
              alt="Himalayan Background" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#FFD700] bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Certified Himalayan Heritage</span>
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit uppercase tracking-tight text-white leading-tight">
              Born from the Shivalik Foothills to High Glacial Summits.
            </h1>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed mt-4 font-normal">
              We started TrekToShikhar with one uncompromising belief: Himalayan trekking should be authentic, uncrowded, and deeply connected to nature — led exclusively by certified mountaineers who know these ridges like the back of their hands.
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================================
          1. THE ORIGIN STORY & ETHOS
         ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-[#E5383B] uppercase tracking-widest block mb-2">
              Our Founding Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-outfit text-[#0A0A0A] leading-tight">
              Why We Rejected the "Commercial Herd" Culture
            </h2>
            <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
              In recent years, Himalayan trekking has become an assembly-line industry. Large commercial companies march 40–50 strangers together in overcrowded lines, turning pristine sacred trails into loud tourist corridors.
            </p>
            <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
              At <strong>TrekToShikhar</strong>, we chose the opposite path:
            </p>

            <div className="mt-6 space-y-3.5">
              {[
                "Strictly 12–15 trekkers per batch for personal safety and real camaraderie.",
                "100% Leaders certified from NIM Uttarkashi or ABVIMAS Manali.",
                "Hot, freshly cooked nutritious meals using locally sourced Himalayan produce.",
                "Zero-compromise safety gear: Sub-zero sleeping bags and medical oxygen on every single departure."
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-neutral-800">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-neutral-200 h-64 sm:h-80">
              <img 
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80" 
                alt="Mountaineer on Ridge" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg border border-neutral-200 h-64 sm:h-80 translate-y-6">
              <img 
                src="https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80" 
                alt="Alpine Camp Under Stars" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. THE SHIKHAR STANDARDS (CORE SAFETY & QUALITY PILLARS)
         ==================================================================== */}
      <section className="bg-neutral-50 py-16 px-4 sm:px-6 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#E5383B] uppercase tracking-widest">
              Uncompromising Safety
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-outfit text-[#0A0A0A] mt-1">
              The Shikhar Standard
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              The four foundational pillars that guarantee your summit attempt is safe, ethical, and unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E5383B] border border-red-100 flex items-center justify-center mb-5">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-outfit font-black text-lg text-[#0A0A0A] mb-2">
                      {s.title}
                    </h3>
                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-5 border-t border-neutral-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Certified Standard</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. OUR DUAL MOUNTAIN BASES (SHIMLA & DEHRADUN)
         ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#E5383B] uppercase tracking-widest">
            Local Himalayan Footholds
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-outfit text-[#0A0A0A] mt-1">
            Our Two Mountain Operational Bases
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            We don't operate out of city call centers. Our teams are permanently based in the mountains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bases.map((base, idx) => (
            <div 
              key={idx}
              className="rounded-3xl border border-neutral-200 overflow-hidden shadow-md hover:shadow-xl transition-all bg-white flex flex-col sm:flex-row"
            >
              <div className="sm:w-1/2 h-56 sm:h-auto overflow-hidden">
                <img 
                  src={base.image} 
                  alt={base.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-50 text-[#E5383B] border border-red-100">
                    {base.state}
                  </span>
                  <h3 className="font-outfit font-black text-xl text-[#0A0A0A] mt-2">
                    {base.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#E5383B] shrink-0" />
                    <span>{base.address}</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    <strong>Trails Covered:</strong> {base.coverage}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Full Base Logistics & Rescue Ready</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          4. JOURNEY TIMELINE / MILESTONES
         ==================================================================== */}
      <section className="bg-neutral-900 text-white py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#FFD700] uppercase tracking-widest">
              The Journey So Far
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-outfit text-white mt-1">
              Milestones On The Mountain Path
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <div 
                key={i}
                className="p-6 rounded-3xl bg-neutral-800/80 border border-neutral-700/80 shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="font-outfit font-black text-3xl text-[#FFD700] block mb-2">
                    {m.year}
                  </span>
                  <h4 className="font-outfit font-extrabold text-base text-white mb-2 leading-snug">
                    {m.title}
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. BOTTOM CALL TO ACTION
         ==================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#F05558] via-[#E5383B] to-[#DA2F33] text-white shadow-2xl relative overflow-hidden">
          <h2 className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight">
            Ready to Reach Your Shikhar?
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto mt-2 leading-relaxed font-medium">
            Join a small, certified batch to Kedarkantha, Nag Tibba, Hatu Peak, or Churdhar. Guaranteed mountain safety and memories for life.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleExplore}
              className="px-6 py-3.5 rounded-2xl bg-white text-[#0A0A0A] font-extrabold text-sm hover:bg-neutral-900 hover:text-white transition-all shadow-md hover:shadow-xl cursor-pointer flex items-center gap-2"
            >
              <span>Explore All Treks</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onContactWhatsApp}
              className="px-6 py-3.5 rounded-2xl bg-black/30 hover:bg-black/50 text-white font-extrabold text-sm border border-white/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Talk to Trek Leader (+91 87912 18377)</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
