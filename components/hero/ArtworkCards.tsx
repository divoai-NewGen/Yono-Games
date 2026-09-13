import React from 'react';

interface ArtworkCardsProps {
  layer: 'back' | 'front';
}

export default function ArtworkCards({ layer }: ArtworkCardsProps) {
  if (layer === 'back') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-[2] overflow-visible">
        {/* Card 1 - King of Spades (Peeking top-left behind phone) */}
        <div 
          className="hero-card hero-card-back-1 absolute top-[20%] left-[22%] w-28 sm:w-32 aspect-[5/7] rounded-xl bg-white border border-[#E4ECE7] shadow-[0_15px_30px_-5px_rgba(7,85,63,0.22)] overflow-hidden p-2"
          style={{ transform: 'rotate(-24deg)' }}
        >
          <div className="w-full h-full border border-[#D6A83E]/40 rounded-lg p-1.5 flex flex-col justify-between bg-gradient-to-br from-white via-[#F7FBF8] to-[#EEF8F2]">
            <div className="text-left font-black text-xs text-[#07553F] leading-none">
              K<br /><span className="text-[10px]">♠</span>
            </div>
            <div className="self-center my-auto">
              <span className="text-2xl sm:text-3xl text-[#087F5B]">♠</span>
            </div>
            <div className="text-right font-black text-xs text-[#07553F] leading-none rotate-180">
              K<br /><span className="text-[10px]">♠</span>
            </div>
          </div>
        </div>

        {/* Card 2 - Ace of Diamonds (Behind phone top) */}
        <div 
          className="hero-card hero-card-back-2 absolute top-[14%] left-[34%] w-28 sm:w-32 aspect-[5/7] rounded-xl bg-white border border-[#E4ECE7] shadow-[0_18px_32px_-6px_rgba(7,85,63,0.25)] overflow-hidden p-2"
          style={{ transform: 'rotate(-10deg)' }}
        >
          <div className="w-full h-full border border-[#D6A83E]/50 rounded-lg p-1.5 flex flex-col justify-between bg-gradient-to-br from-white to-[#FFFBEB]">
            <div className="text-left font-black text-xs text-[#D6A83E] leading-none">
              A<br /><span className="text-[10px]">♦</span>
            </div>
            <div className="self-center my-auto">
              <span className="text-2xl sm:text-3xl text-[#D6A83E]">♦</span>
            </div>
            <div className="text-right font-black text-xs text-[#D6A83E] leading-none rotate-180">
              A<br /><span className="text-[10px]">♦</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Foreground Cards (Layer 9) - Overlapping lower phone and controller
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-[9] overflow-visible">
      {/* Front Card 1 - Luxury Ace of Spades (Angled fanned out at bottom center-left) */}
      <div 
        className="hero-card hero-card-front-1 absolute bottom-[10%] left-[24%] sm:left-[28%] w-32 sm:w-36 aspect-[5/7] rounded-2xl bg-white border border-[#E4ECE7] shadow-[0_20px_40px_-8px_rgba(7,85,63,0.32)] overflow-hidden p-2.5"
        style={{ transform: 'rotate(-14deg)' }}
      >
        <div className="w-full h-full border-2 border-[#D6A83E] rounded-xl p-2 flex flex-col justify-between bg-gradient-to-br from-[#FFFFFF] via-[#F7FBF8] to-[#EEF8F2] relative">
          <div className="text-left font-black text-sm text-[#07553F] leading-none">
            A<br /><span className="text-xs text-[#087F5B]">♠</span>
          </div>

          {/* Luxury Spade Center with Gold Trim */}
          <div className="self-center my-auto flex flex-col items-center">
            <span className="text-4xl sm:text-5xl text-[#087F5B] filter drop-shadow-[0_2px_4px_rgba(8,127,91,0.3)]">
              ♠
            </span>
            <div className="w-6 h-0.5 bg-[#D6A83E] rounded-full mt-1" />
          </div>

          <div className="text-right font-black text-sm text-[#07553F] leading-none rotate-180">
            A<br /><span className="text-xs text-[#087F5B]">♠</span>
          </div>
        </div>
      </div>

      {/* Front Card 2 - King of Hearts (Layered behind the front Ace) */}
      <div 
        className="hero-card hero-card-front-2 absolute bottom-[8%] left-[32%] sm:left-[36%] w-32 sm:w-36 aspect-[5/7] rounded-2xl bg-white border border-[#E4ECE7] shadow-[0_22px_44px_-10px_rgba(7,85,63,0.35)] overflow-hidden p-2.5"
        style={{ transform: 'rotate(4deg)' }}
      >
        <div className="w-full h-full border-2 border-[#D6A83E] rounded-xl p-2 flex flex-col justify-between bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#EEF8F2] relative">
          <div className="text-left font-black text-sm text-[#07553F] leading-none">
            K<br /><span className="text-xs text-[#D6A83E]">♥</span>
          </div>

          <div className="self-center my-auto flex flex-col items-center">
            <span className="text-4xl sm:text-5xl text-[#07553F] filter drop-shadow-[0_2px_4px_rgba(7,85,63,0.3)]">
              ♥
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D6A83E]">
              YONO
            </span>
          </div>

          <div className="text-right font-black text-sm text-[#07553F] leading-none rotate-180">
            K<br /><span className="text-xs text-[#D6A83E]">♥</span>
          </div>
        </div>
      </div>
    </div>
  );
}
