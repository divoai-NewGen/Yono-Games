import React from 'react';
import { Crown, Sparkles, Gem } from 'lucide-react';

export default function ArtworkFloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-[4] overflow-visible">
      {/* Floating Crown above phone screen */}
      <div 
        className="hero-float-icon hero-icon-crown absolute top-[6%] left-[45%] w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FEF08A] to-[#D97706] p-2.5 shadow-[0_10px_25px_rgba(214,168,62,0.4)] border border-white/80 flex items-center justify-center text-amber-950"
        style={{ transform: 'rotate(-8deg)' }}
      >
        <Crown className="w-6 h-6 fill-current text-[#78350F]" />
      </div>

      {/* Floating Emerald Gem (Upper Left) */}
      <div 
        className="hero-float-icon hero-icon-gem absolute top-[16%] left-[10%] w-10 h-10 rounded-xl bg-gradient-to-br from-[#34D399] to-[#07553F] p-2 shadow-[0_8px_20px_rgba(8,127,91,0.35)] border border-[#A7F3D0]/60 flex items-center justify-center text-white"
        style={{ transform: 'rotate(18deg)' }}
      >
        <Gem className="w-5 h-5 fill-current text-[#A7F3D0]" />
      </div>

      {/* Floating Sparkle / Star (Far Right) */}
      <div 
        className="hero-float-icon hero-icon-sparkle absolute top-[30%] -right-2 w-9 h-9 rounded-full bg-white border border-[#E4ECE7] shadow-sm flex items-center justify-center text-[#D6A83E]"
        style={{ transform: 'rotate(12deg)' }}
      >
        <Sparkles className="w-4 h-4 text-[#D6A83E]" />
      </div>
    </div>
  );
}
