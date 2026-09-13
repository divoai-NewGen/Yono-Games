'use client';

import { useEffect, RefObject } from 'react';
import gsap from 'gsap';

interface UseHeroParallaxOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  phoneRef: RefObject<HTMLDivElement | null>;
  controllerRef: RefObject<HTMLDivElement | null>;
  backCardsRef: RefObject<HTMLDivElement | null>;
  frontCardsRef: RefObject<HTMLDivElement | null>;
  backCoinsRef: RefObject<HTMLDivElement | null>;
  frontCoinsRef: RefObject<HTMLDivElement | null>;
  chipsRef: RefObject<HTMLDivElement | null>;
  leavesRef: RefObject<HTMLDivElement | null>;
  glowRef: RefObject<HTMLDivElement | null>;
}

export function useHeroParallax({
  containerRef,
  phoneRef,
  controllerRef,
  backCardsRef,
  frontCardsRef,
  backCoinsRef,
  frontCoinsRef,
  chipsRef,
  leavesRef,
  glowRef,
}: UseHeroParallaxOptions) {
  useEffect(() => {
    // Accessibility check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Create quickTo interpolators for silky smooth luxury 60fps tracking
      const setGlowX = glowRef.current ? gsap.quickTo(glowRef.current, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
      const setGlowY = glowRef.current ? gsap.quickTo(glowRef.current, 'y', { duration: 1.2, ease: 'power2.out' }) : null;

      const setBackCardsX = backCardsRef.current ? gsap.quickTo(backCardsRef.current, 'x', { duration: 0.9, ease: 'power2.out' }) : null;
      const setBackCardsY = backCardsRef.current ? gsap.quickTo(backCardsRef.current, 'y', { duration: 0.9, ease: 'power2.out' }) : null;

      const setBackCoinsX = backCoinsRef.current ? gsap.quickTo(backCoinsRef.current, 'x', { duration: 0.8, ease: 'power2.out' }) : null;
      const setBackCoinsY = backCoinsRef.current ? gsap.quickTo(backCoinsRef.current, 'y', { duration: 0.8, ease: 'power2.out' }) : null;

      const setPhoneX = phoneRef.current ? gsap.quickTo(phoneRef.current, 'x', { duration: 0.7, ease: 'power2.out' }) : null;
      const setPhoneY = phoneRef.current ? gsap.quickTo(phoneRef.current, 'y', { duration: 0.7, ease: 'power2.out' }) : null;

      const setControllerX = controllerRef.current ? gsap.quickTo(controllerRef.current, 'x', { duration: 0.6, ease: 'power2.out' }) : null;
      const setControllerY = controllerRef.current ? gsap.quickTo(controllerRef.current, 'y', { duration: 0.6, ease: 'power2.out' }) : null;

      const setChipsX = chipsRef.current ? gsap.quickTo(chipsRef.current, 'x', { duration: 0.6, ease: 'power2.out' }) : null;
      const setChipsY = chipsRef.current ? gsap.quickTo(chipsRef.current, 'y', { duration: 0.6, ease: 'power2.out' }) : null;

      const setFrontCoinsX = frontCoinsRef.current ? gsap.quickTo(frontCoinsRef.current, 'x', { duration: 0.5, ease: 'power2.out' }) : null;
      const setFrontCoinsY = frontCoinsRef.current ? gsap.quickTo(frontCoinsRef.current, 'y', { duration: 0.5, ease: 'power2.out' }) : null;

      const setFrontCardsX = frontCardsRef.current ? gsap.quickTo(frontCardsRef.current, 'x', { duration: 0.6, ease: 'power2.out' }) : null;
      const setFrontCardsY = frontCardsRef.current ? gsap.quickTo(frontCardsRef.current, 'y', { duration: 0.6, ease: 'power2.out' }) : null;

      const setLeavesX = leavesRef.current ? gsap.quickTo(leavesRef.current, 'x', { duration: 1.0, ease: 'power2.out' }) : null;
      const setLeavesY = leavesRef.current ? gsap.quickTo(leavesRef.current, 'y', { duration: 1.0, ease: 'power2.out' }) : null;

      const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 1024) return; // Desktop only

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const normX = (e.clientX - centerX) / centerX; // -1 to +1
        const normY = (e.clientY - centerY) / centerY; // -1 to +1

        // Strict limit caps (max 2px to 12px)
        setGlowX?.(normX * 2);
        setGlowY?.(normY * 2);

        setBackCardsX?.(normX * 4);
        setBackCardsY?.(normY * 4);

        setBackCoinsX?.(normX * 5);
        setBackCoinsY?.(normY * 5);

        setPhoneX?.(normX * 7);
        setPhoneY?.(normY * 7);

        setControllerX?.(normX * 9);
        setControllerY?.(normY * 9);

        setChipsX?.(normX * 10);
        setChipsY?.(normY * 10);

        setFrontCoinsX?.(normX * 12);
        setFrontCoinsY?.(normY * 12);

        setFrontCardsX?.(normX * 8);
        setFrontCardsY?.(normY * 8);

        setLeavesX?.(normX * 6);
        setLeavesY?.(normY * 6);
      };

      const handleMouseLeave = () => {
        // Return smoothly to rest
        setGlowX?.(0);
        setGlowY?.(0);
        setBackCardsX?.(0);
        setBackCardsY?.(0);
        setBackCoinsX?.(0);
        setBackCoinsY?.(0);
        setPhoneX?.(0);
        setPhoneY?.(0);
        setControllerX?.(0);
        setControllerY?.(0);
        setChipsX?.(0);
        setChipsY?.(0);
        setFrontCoinsX?.(0);
        setFrontCoinsY?.(0);
        setFrontCardsX?.(0);
        setFrontCardsY?.(0);
        setLeavesX?.(0);
        setLeavesY?.(0);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [
    containerRef,
    phoneRef,
    controllerRef,
    backCardsRef,
    frontCardsRef,
    backCoinsRef,
    frontCoinsRef,
    chipsRef,
    leavesRef,
    glowRef,
  ]);
}
