import React from 'react';

export default function ArtworkAmbientGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible select-none">
      {/* Primary mint/emerald ambient radial glow */}
      <div 
        className="hero-ambient-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(238, 248, 242, 0.95) 0%, rgba(22, 163, 111, 0.12) 40%, rgba(255, 255, 255, 0) 70%)',
        }}
      />

      {/* Warm gold ambient accent behind upper coin zone */}
      <div 
        className="hero-ambient-gold absolute top-[18%] right-[12%] w-[280px] h-[280px] rounded-full blur-2xl opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(214, 168, 62, 0.18) 0%, rgba(255, 255, 255, 0) 70%)',
        }}
      />

      {/* Organic curved shape (Layer 1) - soft translucent emerald wave */}
      <svg 
        className="hero-ambient-shape absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[580px] opacity-25"
        viewBox="0 0 680 580" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M120 280C90 160 220 80 380 90C540 100 620 220 590 360C560 500 420 540 280 520C140 500 150 400 120 280Z" 
          fill="url(#ambient_grad)" 
          filter="blur(40px)"
        />
        <defs>
          <linearGradient id="ambient_grad" x1="120" y1="90" x2="590" y2="520" gradientUnits="userSpaceOnUse">
            <stop stopColor="#16A36F" stopOpacity="0.4" />
            <stop offset="0.6" stopColor="#EEF8F2" stopOpacity="0.8" />
            <stop offset="1" stopColor="#087F5B" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
