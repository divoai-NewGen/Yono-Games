'use client';

import React from 'react';
import { Gamepad2, Users, Trophy, Headphones } from 'lucide-react';
import { SITE_STATS } from '@/data/games';

export default function StatsPanel() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-[#087F5B]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#087F5B]" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-[#087F5B]" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-[#087F5B]" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-[#087F5B]" />;
    }
  };

  return (
    <div className="hidden md:block w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 relative z-20">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#E4ECE7] shadow-[0_10px_35px_-4px_rgba(8,127,91,0.08),0_2px_10px_-1px_rgba(23,35,49,0.04)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y-0 md:divide-x divide-[#E4ECE7]">
          {SITE_STATS.map((stat) => (
            <div 
              key={stat.label} 
              className="flex items-center gap-4 px-2 sm:px-4 first:pl-0 last:pr-0 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EEF8F2] group-hover:bg-[#087F5B]/10 border border-[#087F5B]/15 flex items-center justify-center flex-shrink-0 transition-colors">
                {getIcon(stat.iconName)}
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#172331] tracking-tight group-hover:text-[#087F5B] transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#07553F]">
                  {stat.label}
                </div>
                <div className="text-[11px] text-[#5D6B78] hidden sm:block">
                  {stat.sublabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
