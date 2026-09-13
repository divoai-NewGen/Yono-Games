'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Trophy, Flame, Bell, ChevronRight, Gamepad2, Layers } from 'lucide-react';

export default function ArtworkPhone() {
  return (
    <div 
      className="hero-phone relative z-[5] w-[230px] sm:w-[260px] aspect-[9/18.5] mx-auto select-none pointer-events-auto drop-shadow-[0_24px_48px_rgba(7,85,63,0.3)]"
      style={{
        transform: 'rotate(7.5deg)',
      }}
    >
      {/* Phone Outer Metallic Chassis (Titanium Emerald Frame) */}
      <div className="w-full h-full rounded-[44px] p-2.5 bg-gradient-to-br from-[#16A36F] via-[#07553F] to-[#043325] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_0_0_1px_rgba(7,85,63,0.5)] relative">
        
        {/* Antenna bands / edge reflections */}
        <div className="absolute top-24 -left-[2px] w-[3px] h-10 bg-[#16A36F] rounded-r-xs opacity-60" />
        <div className="absolute top-36 -left-[2px] w-[3px] h-10 bg-[#16A36F] rounded-r-xs opacity-60" />
        <div className="absolute top-28 -right-[2px] w-[3px] h-14 bg-[#16A36F] rounded-l-xs opacity-60" />

        {/* Screen Inner Bezel */}
        <div className="w-full h-full rounded-[36px] bg-[#07553F] p-2 overflow-hidden relative shadow-[inset_0_0_12px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          
          {/* Top Status Bar & Dynamic Island */}
          <div className="relative pt-1 px-3 flex items-center justify-between z-20">
            <span className="text-[10px] font-bold text-white/90 font-mono">9:41</span>
            
            {/* Dynamic Island pill */}
            <div className="w-20 h-4 bg-black rounded-full mx-auto flex items-center justify-center gap-1.5 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#172331]" />
            </div>

            <div className="flex items-center gap-1 text-[10px] text-white/90">
              <span className="text-[9px]">5G</span>
              <div className="w-4 h-2 rounded-xs border border-white/80 p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App Header */}
          <div className="px-3 pt-2.5 pb-2 flex items-center justify-between border-b border-white/10 relative z-20">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-[#D6A83E]/40 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Yono App Icon"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-black tracking-tight text-white">YONO</p>
                <p className="text-[8px] font-bold text-[#D6A83E] uppercase -mt-0.5">Games</p>
              </div>
            </div>

            <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <Bell className="w-3 h-3 text-[#FEF08A]" />
            </div>
          </div>

          {/* Wallet Balance Widget */}
          <div className="mx-2 mt-2 p-2.5 rounded-2xl bg-gradient-to-br from-[#087F5B] to-[#054331] border border-white/15 shadow-sm relative z-20">
            <div className="flex items-center justify-between text-[9px] text-emerald-200">
              <span className="font-semibold uppercase tracking-wider">Available Coins</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#D6A83E]/20 text-[#FEF08A] font-bold text-[8px] border border-[#D6A83E]/40">
                VIP Tier 4
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-base font-black text-white tracking-tight">₹2,45,670</p>
              <span className="text-[9px] font-bold text-[#D6A83E] flex items-center gap-0.5">
                +₹1,500 Bonus
              </span>
            </div>
          </div>

          {/* Mini Popular Game Strip */}
          <div className="px-2 mt-2 space-y-1.5 relative z-20">
            <div className="flex items-center justify-between text-[9px] font-bold text-white/80 px-1">
              <span>FEATURED ROOMS</span>
              <span className="text-[8px] text-[#D6A83E]">Live (25K+)</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {/* Game 1: 777 Slots */}
              <div className="p-1.5 rounded-xl bg-white/10 border border-white/10 text-center flex flex-col items-center">
                <span className="text-sm">🎰</span>
                <span className="text-[8px] font-bold text-white mt-0.5">777 Gold</span>
                <span className="text-[7px] text-[#FEF08A]">Jackpot</span>
              </div>
              {/* Game 2: Rummy */}
              <div className="p-1.5 rounded-xl bg-white/10 border border-white/10 text-center flex flex-col items-center">
                <span className="text-sm">🃏</span>
                <span className="text-[8px] font-bold text-white mt-0.5">Rummy</span>
                <span className="text-[7px] text-emerald-300">101 Pool</span>
              </div>
              {/* Game 3: Aviator */}
              <div className="p-1.5 rounded-xl bg-white/10 border border-white/10 text-center flex flex-col items-center">
                <span className="text-sm">🚀</span>
                <span className="text-[8px] font-bold text-white mt-0.5">Aviator</span>
                <span className="text-[7px] text-[#FEF08A]">50x Max</span>
              </div>
            </div>
          </div>

          {/* Featured Jackpot Banner */}
          <div className="mx-2 mt-2 p-2 rounded-xl bg-gradient-to-r from-[#D97706]/90 via-[#B45309] to-[#07553F] border border-[#FEF08A]/40 text-white relative z-20 overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-[#FEF08A]">Mega Grand Pool</p>
                <p className="text-xs font-black tracking-tight text-white">₹1,30,00,000</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="px-4 py-2 border-t border-white/10 bg-black/30 rounded-b-[30px] flex items-center justify-between text-white/60 relative z-20">
            <div className="flex flex-col items-center text-[#FEF08A]">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="text-[7px] font-bold mt-0.5">Lobby</span>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-[7px] font-medium mt-0.5">Contests</span>
            </div>
            <div className="flex flex-col items-center">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[7px] font-medium mt-0.5">Wallet</span>
            </div>
          </div>

          {/* Realistic Specular Glass Light Reflection Angle */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-[36px] z-30"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0) 65%)',
            }}
          />

        </div>
      </div>
    </div>
  );
}
