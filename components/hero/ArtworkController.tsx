import React from 'react';

export default function ArtworkController() {
  return (
    <div 
      className="hero-controller absolute bottom-[16%] left-[2%] sm:left-[5%] w-[190px] sm:w-[240px] aspect-[1.35/1] z-[6] pointer-events-none select-none drop-shadow-[0_24px_40px_rgba(7,85,63,0.3)]"
      style={{ transform: 'rotate(-12deg)' }}
    >
      <svg viewBox="0 0 320 236" fill="none" className="w-full h-full">
        {/* Ambient Under-Drop Shadow */}
        <ellipse cx="160" cy="220" rx="130" ry="14" fill="rgba(7,85,63,0.25)" filter="blur(10px)" />

        {/* Controller Main Body Contour (DualSense / Elite Style) */}
        <path 
          d="M70 20C110 18 135 32 160 32C185 32 210 18 250 20C290 22 315 75 305 155C295 215 260 225 240 215C220 205 200 145 160 145C120 145 100 205 80 215C60 225 25 215 15 155C5 75 30 22 70 20Z" 
          fill="url(#ctrl_body_grad)" 
          stroke="#E4ECE7" 
          strokeWidth="2.5"
        />

        {/* Inner Ergonomic Grip Accents (Emerald Green Wings) */}
        <path 
          d="M20 130C15 155 25 195 55 208C65 212 75 205 78 195C85 165 80 135 60 120C45 110 25 115 20 130Z" 
          fill="url(#ctrl_grip_left)" 
        />
        <path 
          d="M300 130C305 155 295 195 265 208C255 212 245 205 242 195C235 165 240 135 260 120C275 110 295 115 300 130Z" 
          fill="url(#ctrl_grip_right)" 
        />

        {/* Center Touchpad / Brand Panel with Emerald Accent Strip */}
        <path 
          d="M115 45H205L195 105H125L115 45Z" 
          fill="#FFFFFF" 
          stroke="#087F5B" 
          strokeWidth="1.5" 
          strokeDasharray="4 2"
        />
        {/* Subtle LED Glow Bar */}
        <path d="M125 46H195" stroke="#10B981" strokeWidth="3" strokeLinecap="round" filter="drop-shadow(0 0 4px #10B981)" />
        
        {/* Yono Star Logo on Touchpad */}
        <circle cx="160" cy="74" r="10" fill="#EEF8F2" stroke="#087F5B" strokeWidth="1" />
        <text x="160" y="78" fontSize="10" fontWeight="900" textAnchor="middle" fill="#087F5B" fontFamily="sans-serif">
          Y★
        </text>

        {/* Left D-Pad (Emerald Green Cross) */}
        <g transform="translate(68, 72)">
          <circle cx="22" cy="22" r="28" fill="#F7FBF8" stroke="#E4ECE7" strokeWidth="1.5" />
          <path d="M16 8H28V16H36V28H28V36H16V28H8V16H16V8Z" fill="#07553F" stroke="#16A36F" strokeWidth="1" />
          {/* Subtle directional indicators */}
          <polygon points="22,10 20,13 24,13" fill="#D6A83E" />
          <polygon points="22,34 20,31 24,31" fill="#D6A83E" />
          <polygon points="10,22 13,20 13,24" fill="#D6A83E" />
          <polygon points="34,22 31,20 31,24" fill="#D6A83E" />
        </g>

        {/* Right Action Buttons (A, B, X, Y in emerald & gold) */}
        <g transform="translate(208, 72)">
          <circle cx="22" cy="22" r="28" fill="#F7FBF8" stroke="#E4ECE7" strokeWidth="1.5" />
          {/* Top Button (Y) */}
          <circle cx="22" cy="7" r="6" fill="#087F5B" stroke="#D6A83E" strokeWidth="0.8" />
          <text x="22" y="10" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">Y</text>
          {/* Bottom Button (A) */}
          <circle cx="22" cy="37" r="6" fill="#087F5B" stroke="#D6A83E" strokeWidth="0.8" />
          <text x="22" y="40" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">A</text>
          {/* Left Button (X) */}
          <circle cx="7" cy="22" r="6" fill="#087F5B" stroke="#D6A83E" strokeWidth="0.8" />
          <text x="7" y="25" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">X</text>
          {/* Right Button (B) */}
          <circle cx="37" cy="22" r="6" fill="#087F5B" stroke="#D6A83E" strokeWidth="0.8" />
          <text x="37" y="25" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">B</text>
        </g>

        {/* Dual Analog Thumbsticks (Lower Center) with Gold Rims */}
        {/* Left Thumbstick */}
        <g transform="translate(108, 128)">
          <circle cx="16" cy="16" r="22" fill="#E4ECE7" />
          <circle cx="16" cy="16" r="18" fill="url(#stick_gold_rim)" />
          <circle cx="16" cy="16" r="15" fill="#07553F" />
          <circle cx="16" cy="16" r="8" fill="#087F5B" stroke="#16A36F" strokeWidth="1" strokeDasharray="3 2" />
        </g>

        {/* Right Thumbstick */}
        <g transform="translate(180, 128)">
          <circle cx="16" cy="16" r="22" fill="#E4ECE7" />
          <circle cx="16" cy="16" r="18" fill="url(#stick_gold_rim)" />
          <circle cx="16" cy="16" r="15" fill="#07553F" />
          <circle cx="16" cy="16" r="8" fill="#087F5B" stroke="#16A36F" strokeWidth="1" strokeDasharray="3 2" />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="ctrl_body_grad" x1="50" y1="20" x2="270" y2="210" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#F7FBF8" />
            <stop offset="1" stopColor="#EEF8F2" />
          </linearGradient>
          <linearGradient id="ctrl_grip_left" x1="20" y1="120" x2="80" y2="210" gradientUnits="userSpaceOnUse">
            <stop stopColor="#087F5B" />
            <stop offset="1" stopColor="#07553F" />
          </linearGradient>
          <linearGradient id="ctrl_grip_right" x1="300" y1="120" x2="240" y2="210" gradientUnits="userSpaceOnUse">
            <stop stopColor="#087F5B" />
            <stop offset="1" stopColor="#07553F" />
          </linearGradient>
          <linearGradient id="stick_gold_rim" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FACC15" />
            <stop offset="0.5" stopColor="#CA8A04" />
            <stop offset="1" stopColor="#713F12" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
