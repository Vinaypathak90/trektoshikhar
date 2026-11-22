import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, ArrowLeft, Compass, ShieldAlert } from 'lucide-react';

export default function NotFoundPage({ message, title }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#E5383B]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[#FFD700]/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto shadow-2xl">
          <Compass className="w-10 h-10 text-[#E5383B] animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-[#FFD700] uppercase tracking-widest">
            Elevation Error • 404
          </span>
          <h1 className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight">
            {title || "The Trail Ends Here"}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            {message || "There are no camps, trails, or coordinates located at this elevation. The requested sanctuary path does not exist."}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-white hover:to-white hover:text-[#0A0A0A] text-white text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Base Camp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
