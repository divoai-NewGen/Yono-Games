import React from 'react';

interface ArtworkCoinsProps {
  layer: 'back' | 'front';
}

export default function ArtworkCoins({ layer }: ArtworkCoinsProps) {
  if (layer === 'back') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-[3] overflow-visible">
        {/* Back Coin 1 - Upper Right (Behind phone, angled) */}
        <div 
          className="hero-coin hero-coin-back-1 absolute top-[10%] right-[14%] w-14 h-14 drop-shadow-[0_10px_18px_rgba(214,168,62,0.35)]"
          style={{ transform: 'rotate(-15deg)' }}
        >
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <circle cx="30" cy="30" r="28" fill="url(#gold_grad_base)" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="30" cy="30" r="24" stroke="url(#gold_rim)" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="30" cy="30" r="21" fill="url(#gold_inner)" />
            <text x="30" y="37" fontSize="22" fontWeight="900" textAnchor="middle" fill="#854D0E" fontFamily="sans-serif">
              7
            </text>
            <defs>
              <linearGradient id="gold_grad_base" x1="5" y1="5" x2="55" y2="55" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="0.4" stopColor="#EAB308" />
                <stop offset="0.8" stopColor="#CA8A04" />
                <stop offset="1" stopColor="#854D0E" />
              </linearGradient>
              <linearGradient id="gold_rim" x1="10" y1="10" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.5" stopColor="#FACC15" />
                <stop offset="1" stopColor="#713F12" />
              </linearGradient>
              <linearGradient id="gold_inner" x1="12" y1="12" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047" />
                <stop offset="0.6" stopColor="#EAB308" />
                <stop offset="1" stopColor="#A16207" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Back Coin 2 - High Right (Smaller, depth distance) */}
        <div 
          className="hero-coin hero-coin-back-2 absolute top-[4%] right-[24%] w-10 h-10 drop-shadow-[0_8px_14px_rgba(214,168,62,0.3)]"
          style={{ transform: 'rotate(22deg)' }}
        >
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <circle cx="30" cy="30" r="28" fill="url(#gold_grad_base)" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="30" cy="30" r="21" fill="url(#gold_inner)" />
            <text x="30" y="35" fontSize="12" fontWeight="800" textAnchor="middle" fill="#713F12" fontFamily="sans-serif">
              yono
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // Foreground Coins (Layer 8) - Larger, crisp, in front
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-[8] overflow-visible">
      {/* Front Coin 1 - Large Rupee Coin (Right side, tilted 3D) */}
      <div 
        className="hero-coin hero-coin-front-1 absolute top-[22%] right-[4%] w-18 h-18 drop-shadow-[0_16px_28px_rgba(214,168,62,0.4)]"
        style={{ transform: 'rotate(12deg)' }}
      >
        <svg viewBox="0 0 72 72" fill="none" className="w-full h-full">
          <circle cx="36" cy="36" r="34" fill="url(#gold_front_base)" stroke="#A16207" strokeWidth="2.5" />
          <circle cx="36" cy="36" r="30" stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="36" cy="36" r="26" fill="url(#gold_front_inner)" />
          {/* Rupee Symbol */}
          <text x="36" y="45" fontSize="28" fontWeight="900" textAnchor="middle" fill="#713F12" fontFamily="sans-serif">
            ₹
          </text>
          <defs>
            <linearGradient id="gold_front_base" x1="6" y1="6" x2="66" y2="66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFBEB" />
              <stop offset="0.3" stopColor="#FDE047" />
              <stop offset="0.7" stopColor="#D97706" />
              <stop offset="1" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="gold_front_inner" x1="14" y1="14" x2="58" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="0.5" stopColor="#EAB308" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Front Coin 2 - "RS" Coin (Mid Right below Rupee coin) */}
      <div 
        className="hero-coin hero-coin-front-2 absolute top-[36%] right-[10%] w-16 h-16 drop-shadow-[0_14px_24px_rgba(214,168,62,0.38)]"
        style={{ transform: 'rotate(-8deg)' }}
      >
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
          <circle cx="32" cy="32" r="30" fill="url(#gold_front_base)" stroke="#B45309" strokeWidth="2" />
          <circle cx="32" cy="32" r="26" stroke="#FEF08A" strokeWidth="1.2" strokeDasharray="2.5 1.5" />
          <circle cx="32" cy="32" r="22" fill="url(#gold_front_inner)" />
          <text x="32" y="38" fontSize="16" fontWeight="900" textAnchor="middle" fill="#78350F" fontFamily="sans-serif">
            RS
          </text>
        </svg>
      </div>

      {/* Front Coin 3 - Lucky 7 Coin (Tumbling near bottom chip stack) */}
      <div 
        className="hero-coin hero-coin-front-3 absolute bottom-[14%] right-[32%] w-11 h-11 drop-shadow-[0_12px_20px_rgba(214,168,62,0.35)]"
        style={{ transform: 'rotate(28deg)' }}
      >
        <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
          <circle cx="30" cy="30" r="28" fill="url(#gold_front_base)" stroke="#A16207" strokeWidth="2" />
          <circle cx="30" cy="30" r="22" fill="url(#gold_front_inner)" />
          <text x="30" y="38" fontSize="22" fontWeight="900" textAnchor="middle" fill="#713F12" fontFamily="sans-serif">
            7
          </text>
        </svg>
      </div>
    </div>
  );
}
