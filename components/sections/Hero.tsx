'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Gamepad2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import StatsPanel from './StatsPanel';
import HeroArtwork from '@/components/hero/HeroArtwork';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo(
        headlineRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );
    }
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden pt-4 pb-4 sm:pt-10 sm:pb-16 bg-white"
    >
      {/* Subtle ambient light-green radial glow bleeding directly into white */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-radial-ambient pointer-events-none -z-10 blur-3xl opacity-60" />
      <div className="absolute top-1/4 left-[-150px] w-[450px] h-[450px] bg-[#EEF8F2]/60 rounded-full pointer-events-none -z-10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-0 lg:min-h-[72vh]">
          
          {/* Left Column on Desktop / Second on Mobile: Headline, Badge, Copy, CTAs */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-6 sm:space-y-8 z-10 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#07553F] text-xs sm:text-sm font-semibold shadow-xs">
              <Gamepad2 className="w-4 h-4 text-[#087F5B]" />
              <span>India&apos;s Favourite Gaming Platform</span>
            </div>

            {/* Dominant Headline */}
            <h1 
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#172331] leading-[1.12]"
            >
              Your Next Game Is{' '}
              <span className="text-[#087F5B] block sm:inline">Waiting.</span>
            </h1>

            {/* Supporting Copy */}
            <p 
              ref={descRef}
              className="text-base sm:text-lg text-[#5D6B78] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Discover exciting games, explore new releases, and find your next favourite — all in one place.
            </p>

            {/* Hero CTA Buttons: Two side-by-side buttons on mobile and desktop */}
            <div 
              ref={ctaRef}
              className="flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 w-full pt-2"
            >
              <Link
                href="/games/"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white font-bold text-xs sm:text-base shadow-[0_6px_20px_-3px_rgba(8,127,91,0.35)] hover:shadow-[0_10px_28px_-3px_rgba(8,127,91,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <span>Explore Games</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              </Link>

              <a
                href="https://t.me/PredictionAndGiveaways"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-[#EEF8F2] text-[#087F5B] hover:text-[#066145] font-bold text-xs sm:text-base border-2 border-[#087F5B]/30 hover:border-[#087F5B] shadow-xs hover:shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#24A1DE] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                <span>Join Telegram</span>
              </a>
            </div>

            {/* Micro verification trust text */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-medium text-[#5D6B78]">
              <div className="flex items-center gap-1.5 text-[#087F5B]">
                <ShieldCheck className="w-4 h-4" />
                <span>Official Direct APK</span>
              </div>
              <span>•</span>
              <span>Fast Withdrawals</span>
              <span>•</span>
              <span>100% Verified RNG</span>
            </div>

          </div>

          {/* Right Column on Desktop / First on Mobile: True Layered Hero Artwork */}
          <div className="order-1 lg:order-2 lg:col-span-6 relative flex items-center justify-center overflow-visible">
            <HeroArtwork />
          </div>

        </div>

        {/* Floating Stats Panel */}
        <StatsPanel />

      </div>
    </section>
  );
}
