'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArtworkAmbientGlow from './ArtworkAmbientGlow';
import ArtworkLeaves from './ArtworkLeaves';
import ArtworkCoins from './ArtworkCoins';
import ArtworkFloatingIcons from './ArtworkFloatingIcons';
import { useHeroParallax } from './useHeroParallax';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroArtwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax wrapper refs (mouse quickTo updates these)
  const glowRef = useRef<HTMLDivElement>(null);
  const mainCenterpieceParallaxRef = useRef<HTMLDivElement>(null);
  const backCoinsParallaxRef = useRef<HTMLDivElement>(null);
  const frontCoinsParallaxRef = useRef<HTMLDivElement>(null);
  const leavesParallaxRef = useRef<HTMLDivElement>(null);
  const dummyRef = useRef<HTMLDivElement>(null);

  // Floating refs (gentle continuous sine loops update these)
  const mainCenterpieceFloatRef = useRef<HTMLDivElement>(null);
  const iconsFloatRef = useRef<HTMLDivElement>(null);
  const leavesFloatRef = useRef<HTMLDivElement>(null);

  // Wire up decoupled mouse parallax
  useHeroParallax({
    containerRef,
    phoneRef: mainCenterpieceParallaxRef,
    controllerRef: dummyRef,
    backCardsRef: dummyRef,
    frontCardsRef: dummyRef,
    backCoinsRef: backCoinsParallaxRef,
    frontCoinsRef: frontCoinsParallaxRef,
    chipsRef: dummyRef,
    leavesRef: leavesParallaxRef,
    glowRef,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Initial Staggered Entrance Animation
      const enterTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      enterTl
        .fromTo(glowRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
        .fromTo(
          mainCenterpieceFloatRef.current,
          { opacity: 0, y: 35, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out' },
          '-=0.6'
        )
        .fromTo(
          leavesFloatRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.8 },
          '-=0.4'
        );

      // 2. Subtle Continuous Floating Animation (Decoupled, zero hover vibration)
      gsap.to(mainCenterpieceFloatRef.current, {
        y: -6,
        rotation: 0.4,
        duration: 4.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Floating Leaves
      gsap.to(leavesFloatRef.current, {
        y: -4,
        x: 3,
        duration: 5.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.3,
      });

      // 3. Scroll Parallax via ScrollTrigger
      if (containerRef.current) {
        gsap.to(mainCenterpieceParallaxRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[540px] lg:max-w-[600px] h-[360px] sm:h-[420px] lg:h-[460px] mx-auto flex items-center justify-center overflow-visible select-none px-2"
      style={{ perspective: 1200 }}
    >
      {/* LAYER 0 & 1: Ambient Background & Organic Glow (Zero card border) */}
      <div ref={glowRef} className="absolute inset-0 pointer-events-none">
        <ArtworkAmbientGlow />
      </div>

      {/* LAYER 2: Main Vibrant 3D Masterpiece (Phone + 777 Slot + Controller + King + Chips + Cards + Full Uncut Ribbons) */}
      <div ref={mainCenterpieceParallaxRef} className="relative z-[5] w-full h-full flex items-center justify-center">
        <div 
          ref={mainCenterpieceFloatRef} 
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* High-Impact Vibrant 3D Composition with true transparent background (No Card / No Box) */}
          <div className="relative w-full h-full max-w-[580px] lg:max-w-[640px] max-h-[460px] flex items-center justify-center">
            <Image
              src="/images/hero-full-ribbon-3d.png"
              alt="Yono Games Vibrant 3D Gaming Showcase - Play Win Enjoy"
              fill
              priority
              className="object-contain pointer-events-auto"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
            />
          </div>
        </div>
      </div>

      {/* LAYER 4: Interactive Botanical Leaves in front (touch/hover triggers glide & swoop reaction) */}
      <div ref={leavesParallaxRef} className="absolute inset-0 z-20 pointer-events-none">
        <div ref={leavesFloatRef} className="w-full h-full">
          <ArtworkLeaves />
        </div>
      </div>

      {/* Hidden dummy ref to satisfy hook options */}
      <div ref={dummyRef} className="hidden" />
      <div ref={backCoinsParallaxRef} className="hidden" />
      <div ref={frontCoinsParallaxRef} className="hidden" />
    </div>
  );
}
