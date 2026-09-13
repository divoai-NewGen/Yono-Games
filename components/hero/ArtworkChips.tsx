import React from 'react';

export default function ArtworkChips() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-[7] overflow-visible">
      {/* Chip Stack at Lower Right - 3 stacked casino chips */}
      <div className="hero-chips absolute bottom-[12%] right-[12%] sm:right-[15%] w-24 h-24 drop-shadow-[0_16px_28px_rgba(7,85,63,0.35)]">
        {/* Chip 1 (Bottom of stack) */}
        <div 
          className="hero-chip hero-chip-1 absolute bottom-0 left-0 w-22 h-14"
          style={{ transform: 'rotate(-8deg)' }}
        >
          <svg viewBox="0 0 90 56" fill="none" className="w-full h-full">
            <ellipse cx="45" cy="28" rx="42" ry="24" fill="#07553F" stroke="#16A36F" strokeWidth="2" />
            <ellipse cx="45" cy="28" rx="36" ry="20" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 4" />
            <ellipse cx="45" cy="28" rx="26" ry="14" fill="#087F5B" />
            <text x="45" y="32" fontSize="9" fontWeight="900" textAnchor="middle" fill="#FFFFFF" letterSpacing="1" fontFamily="sans-serif">
              YONO
            </text>
          </svg>
        </div>

        {/* Chip 2 (Middle of stack) */}
        <div 
          className="hero-chip hero-chip-2 absolute -bottom-3 left-2 w-22 h-14"
          style={{ transform: 'rotate(6deg)' }}
        >
          <svg viewBox="0 0 90 56" fill="none" className="w-full h-full">
            <ellipse cx="45" cy="28" rx="42" ry="24" fill="#087F5B" stroke="#D6A83E" strokeWidth="2.5" />
            <ellipse cx="45" cy="28" rx="36" ry="20" stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="6 4" />
            <ellipse cx="45" cy="28" rx="26" ry="14" fill="#07553F" />
            <text x="45" y="32" fontSize="9" fontWeight="900" textAnchor="middle" fill="#D6A83E" letterSpacing="1" fontFamily="sans-serif">
              YONO
            </text>
          </svg>
        </div>

        {/* Chip 3 (Top of stack - crisp tilted view) */}
        <div 
          className="hero-chip hero-chip-3 absolute -bottom-6 left-1 w-22 h-14"
          style={{ transform: 'rotate(-4deg)' }}
        >
          <svg viewBox="0 0 90 56" fill="none" className="w-full h-full">
            <ellipse cx="45" cy="28" rx="42" ry="24" fill="url(#chip_grad_emerald)" stroke="#FFFFFF" strokeWidth="2" />
            <ellipse cx="45" cy="28" rx="36" ry="20" stroke="#D6A83E" strokeWidth="1.8" strokeDasharray="6 4" />
            <ellipse cx="45" cy="28" rx="26" ry="14" fill="#07553F" />
            <text x="45" y="32" fontSize="9" fontWeight="900" textAnchor="middle" fill="#FFFFFF" letterSpacing="1" fontFamily="sans-serif">
              YONO
            </text>
            <defs>
              <linearGradient id="chip_grad_emerald" x1="5" y1="5" x2="85" y2="50" gradientUnits="userSpaceOnUse">
                <stop stopColor="#16A36F" />
                <stop offset="0.6" stopColor="#087F5B" />
                <stop offset="1" stopColor="#07553F" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
