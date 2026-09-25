'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, Gift, Wallet } from 'lucide-react';
import { Game } from '@/types/game';

interface CompactGameCardProps {
  game: Game;
  onDownloadClick?: (e: React.MouseEvent, game: Game) => void;
}

export function formatBonus(bonus?: string): string {
  if (!bonus) return '₹500';
  const match = bonus.match(/₹[\d,]+/);
  return match ? match[0] : bonus;
}

export default function CompactGameCard({ game, onDownloadClick }: CompactGameCardProps) {
  const bonusText = formatBonus(game.bonus);

  return (
    <div className="relative bg-white rounded-2xl border border-[#E4ECE7] p-3.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex items-center justify-between gap-3 group">
      {/* Left: App Icon + Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* App Icon */}
        <Link
          href={`/games/${game.slug}`}
          className="relative w-[54px] h-[54px] rounded-2xl overflow-hidden bg-[#F7FBF8] border border-[#E4ECE7] flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
        >
          <Image
            src={game.logo || game.thumbnail}
            alt={game.name}
            fill
            sizes="54px"
            className="object-cover"
          />
        </Link>

        {/* Title & Stats */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <Link href={`/games/${game.slug}`} className="block">
            <h3 className="font-bold text-[15px] text-[#172331] leading-tight line-clamp-1 group-hover:text-[#087F5B] transition-colors">
              {game.name}
            </h3>
          </Link>

          {/* Sign Up Bonus */}
          <div className="flex items-center gap-1.5 text-xs text-[#E03131] font-bold">
            <Gift className="w-3.5 h-3.5 text-[#E03131] flex-shrink-0" />
            <span className="truncate">Sign Up Bonus {bonusText}</span>
          </div>

          {/* Min Withdraw */}
          <div className="flex items-center gap-1.5 text-xs text-[#5D6B78] font-semibold">
            <Wallet className="w-3.5 h-3.5 text-[#172331] flex-shrink-0" />
            <span>Min. Withdraw ₹100</span>
          </div>
        </div>
      </div>

      {/* Right: Action Button */}
      {game.downloadUrl ? (
        <a
          href={game.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (onDownloadClick) {
              onDownloadClick(e, game);
            }
          }}
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#07553F] active:scale-95 text-white text-xs font-bold shadow-[0_3px_10px_-2px_rgba(8,127,91,0.4)] transition-all"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Download</span>
        </a>
      ) : (
        <Link
          href={`/games/${game.slug}`}
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#EEF8F2] hover:bg-[#E1F3E9] text-[#087F5B] text-xs font-bold border border-[#087F5B]/30 transition-all"
        >
          <span>Play Now</span>
        </Link>
      )}
    </div>
  );
}
