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

            {/* Hero CTA Buttons */}
            <div 
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href="/games/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white font-bold text-base shadow-[0_8px_25px_-4px_rgba(8,127,91,0.35)] hover:shadow-[0_12px_32px_-4px_rgba(8,127,91,0.45)] transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <span>Explore Games</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/games?filter=new"
                className="hidden sm:inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-[#EEF8F2] text-[#087F5B] font-bold text-base border-2 border-[#087F5B]/30 hover:border-[#087F5B] shadow-xs hover:shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-[#D6A83E]" />
                <span>New Releases</span>
              </Link>
            </div>

            {/* Micro verification trust text */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-medium text-[#5D6B78]">
              <div className="flex items-center gap-1.5 text-[#087F5B]">
                <ShieldCheck className="w-4 h-4" />
                <span>Gaming Discovery</span>
              </div>
              <span>•</span>
              <span>Curated Titles</span>
              <span>•</span>
              <span>Daily Updates</span>
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
