'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Download, Sparkles, ArrowUpRight } from 'lucide-react';
import { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
  priority?: boolean;
}

export default function GameCard({
  game,
  priority = false,
}: GameCardProps) {
  const gameUrl = `/games/${game.slug}`;

  return (
    <article className="group relative bg-white rounded-3xl border border-[#E4ECE7] overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col">

      {/* Visual Artwork Container */}
      <Link
        href={gameUrl}
        className="block relative w-full aspect-[4/3] overflow-hidden bg-[#F7FBF8]"
        aria-label={`View ${game.name} game details`}
      >
        <Image
          src={game.thumbnail}
          alt={`${game.name} game`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-bold text-[#07553F] border border-[#E4ECE7] shadow-xs">
            {game.category}
          </span>

          {game.newRelease && (
            <span className="px-2.5 py-1 rounded-full bg-[#087F5B] text-[11px] font-bold text-white shadow-xs flex items-center gap-1">
              <Sparkles
                aria-hidden="true"
                className="w-3 h-3 text-[#D6A83E]"
              />
              NEW
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 z-10">
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-[#172331] border border-[#E4ECE7] shadow-xs"
            aria-label={`Rating ${game.rating}`}
          >
            <Star
              aria-hidden="true"
              className="w-3.5 h-3.5 text-[#D6A83E] fill-current"
            />
            <span>{game.rating}</span>
          </div>
        </div>

        {/* Subtle Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

        {/* Game Information */}
        <div>
          <div className="flex items-start justify-between gap-2">

            <Link href={gameUrl}>
              <h3 className="text-base font-bold text-[#172331] group-hover:text-[#087F5B] transition-colors line-clamp-1">
                {game.name}
              </h3>
            </Link>

            <Link
              href={gameUrl}
              className="text-[#5D6B78] group-hover:text-[#087F5B] transition-colors"
              aria-label={`View ${game.name} details`}
            >
              <ArrowUpRight
                aria-hidden="true"
                className="w-4 h-4"
              />
            </Link>
          </div>

          <p className="text-xs text-[#5D6B78] mt-1 line-clamp-2 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Game Metadata */}
        <div className="space-y-3 pt-2 border-t border-[#E4ECE7]/80">

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#087F5B] bg-[#EEF8F2] px-2 py-0.5 rounded-md">
              {game.bonus}
            </span>

            <span className="text-[#5D6B78] font-medium text-[11px]">
              {game.downloads}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={gameUrl}
              className={`flex items-center justify-center py-2.5 px-3 rounded-xl bg-[#F7FBF8] hover:bg-[#EEF8F2] text-[#07553F] text-xs font-semibold border border-[#E4ECE7] hover:border-[#087F5B]/30 transition-all text-center ${
                !game.downloadUrl ? 'col-span-2' : ''
              }`}
            >
              View Details
            </Link>

            {game.downloadUrl && (
              <a
                href={game.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download ${game.name} APK`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
              >
                <Download
                  aria-hidden="true"
                  className="w-3.5 h-3.5"
                />
                <span>Get APK</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}