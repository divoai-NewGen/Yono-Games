'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, Home } from 'lucide-react';
import { Game } from '@/types/game';

interface CompactGameCardProps {
  game: Game;
  rank?: number;
  onDownloadClick?: (e: React.MouseEvent, game: Game) => void;
}

export function formatBonus(bonus?: string): string {
  if (!bonus) return '₹500';
  const match = bonus.match(/₹[\d,]+/);
  return match ? match[0] : bonus;
}

export default function CompactGameCard({ game, rank, onDownloadClick }: CompactGameCardProps) {
  const bonusText = formatBonus(game.bonus);

  return (
    <div className="relative bg-white rounded-2xl border border-[#E5E7EB] p-3.5 sm:p-4 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex items-center justify-between gap-3 sm:gap-4 group">
      {/* Top Left Rank Badge */}
      {rank !== undefined && (
        <div className="absolute -top-2.5 -left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#FFA000] text-white flex items-center justify-center font-black text-xs shadow-xs z-10 select-none">
          {rank}
        </div>
      )}

      {/* Left: App Icon + Info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {/* App Icon */}
        <Link
          href={`/games/${game.slug}`}
          className="relative w-[54px] h-[54px] sm:w-[62px] sm:h-[62px] rounded-2xl overflow-hidden bg-[#172331] border border-[#E5E7EB] flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
        >
          <Image
            src={game.logo || game.thumbnail}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 54px, 62px"
            className="object-cover"
          />
        </Link>

        {/* Title & Stats */}
        <div className="min-w-0 flex-1 space-y-1">
          <Link href={`/games/${game.slug}`} className="block">
            <h3 className="font-bold text-[15px] sm:text-base text-[#111827] leading-tight line-clamp-1 group-hover:text-[#087F5B] transition-colors">
              {game.name}
            </h3>
          </Link>

          {/* Sign Up Bonus */}
          <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#DC2626] font-semibold">
            <Gift className="w-3.5 h-3.5 text-[#DC2626] flex-shrink-0" />
            <span className="truncate">Sign Up Bonus {bonusText}</span>
          </div>

          {/* Min Withdraw */}
          <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#059669] font-medium">
            <Home className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
            <span>Min Withdrawal ₹100</span>
          </div>
        </div>
      </div>

      {/* Right: Crimson Download Button (Matches screenshot) */}
      <Link
        href={`/games/${game.slug}`}
        onClick={(e) => {
          if (onDownloadClick) {
            onDownloadClick(e, game);
          }
        }}
        className="flex-shrink-0 inline-flex items-center justify-center px-5 sm:px-7 py-2 sm:py-2.5 rounded-xl bg-[#C2185B] hover:bg-[#AD1457] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all tracking-wide"
      >
        <span>Download</span>
      </Link>
    </div>
  );
}
