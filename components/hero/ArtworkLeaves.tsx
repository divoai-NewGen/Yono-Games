'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';

export default function ArtworkLeaves() {
  const leaf1Ref = useRef<HTMLDivElement>(null);
  const leaf2Ref = useRef<HTMLDivElement>(null);
  const leaf3Ref = useRef<HTMLDivElement>(null);
  const leaf4Ref = useRef<HTMLDivElement>(null);
  const leaf5Ref = useRef<HTMLDivElement>(null);

  // Interactive touch / hover trigger: touched leaf goes to opposite side, opposite leaf comes here
  const handleLeafTouch = (leafIndex: number) => {
    // When left leaves (1 or 4) are touched, they fly right, and right leaves (2 or 3) fly left
    if (leafIndex === 1 || leafIndex === 4) {
      const touchedEl = leafIndex === 1 ? leaf1Ref.current : leaf4Ref.current;
      const oppositeEl = leafIndex === 1 ? leaf2Ref.current : leaf3Ref.current;

      if (touchedEl && oppositeEl) {
        // Touched left leaf glides towards right
        gsap.to(touchedEl, {
          x: '+=50',
          y: '+=15',
          rotation: '+=45',
          scale: 1.18,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(touchedEl, {
              x: 0,
              y: 0,
              rotation: leafIndex === 1 ? -25 : -48,
              scale: 1,
              duration: 1.4,
              ease: 'elastic.out(1, 0.4)',
            });
          },
        });

        // Opposite right leaf swoops towards left
        gsap.to(oppositeEl, {
          x: '-=45',
          y: '-=10',
          rotation: '-=40',
          scale: 1.15,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(oppositeEl, {
              x: 0,
              y: 0,
              rotation: leafIndex === 1 ? 42 : 15,
              scale: 1,
              duration: 1.4,
              ease: 'elastic.out(1, 0.4)',
            });
          },
        });
      }
    } else if (leafIndex === 2 || leafIndex === 3) {
      // Right leaves touched: fly left, and left leaves (1 or 4) fly right
      const touchedEl = leafIndex === 2 ? leaf2Ref.current : leaf3Ref.current;
      const oppositeEl = leafIndex === 2 ? leaf1Ref.current : leaf4Ref.current;

      if (touchedEl && oppositeEl) {
        gsap.to(touchedEl, {
          x: '-=50',
          y: '+=15',
          rotation: '-=45',
          scale: 1.18,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(touchedEl, {
              x: 0,
              y: 0,
              rotation: leafIndex === 2 ? 42 : 15,
              scale: 1,
              duration: 1.4,
              ease: 'elastic.out(1, 0.4)',
            });
          },
        });

        gsap.to(oppositeEl, {
          x: '+=45',
          y: '-=10',
          rotation: '+=40',
          scale: 1.15,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(oppositeEl, {
              x: 0,
              y: 0,
              rotation: leafIndex === 2 ? -25 : -48,
              scale: 1,
              duration: 1.4,
              ease: 'elastic.out(1, 0.4)',
            });
          },
        });
      }
    } else {
      // Bottom leaf (5) touched: dynamic swirl reaction with leaf 1 & 3
      if (leaf5Ref.current) {
        gsap.to(leaf5Ref.current, {
          x: '-=40',
          y: '-=30',
          rotation: '+=90',
          scale: 1.25,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(leaf5Ref.current, {
              x: 0,
              y: 0,
              rotation: 70,
              scale: 1,
              duration: 1.5,
              ease: 'elastic.out(1, 0.4)',
            });
          },
        });
      }
      if (leaf3Ref.current) {
        gsap.to(leaf3Ref.current, {
          x: '+=30',
          y: '+=20',
          rotation: '-=30',
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(leaf3Ref.current, { x: 0, y: 0, rotation: 15, duration: 1.4, ease: 'elastic.out(1, 0.4)' });
          },
        });
      }
    }
  };

  return (
    <div className="absolute inset-0 select-none z-20 overflow-visible pointer-events-none">
      {/* Leaf 1 - Top Left */}
      <div 
        ref={leaf1Ref}
        onMouseEnter={() => handleLeafTouch(1)}
        onTouchStart={() => handleLeafTouch(1)}
        className="hero-leaf hero-leaf-1 absolute -top-4 left-10 w-11 h-15 drop-shadow-[0_8px_16px_rgba(8,127,91,0.2)] cursor-pointer pointer-events-auto transition-transform"
        style={{ transform: 'rotate(-25deg)' }}
        title="Touch leaf!"
      >
        <svg viewBox="0 0 48 64" fill="none" className="w-full h-full">
          <path 
            d="M24 2C36 14 46 32 38 52C30 58 18 58 10 50C2 30 12 14 24 2Z" 
            fill="url(#leaf_grad_1)" 
          />
          <path d="M24 6C23 25 24 45 24 55" stroke="#07553F" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
          <path d="M24 20C28 22 34 26 35 28" stroke="#07553F" strokeWidth="0.8" strokeOpacity="0.3" />
          <path d="M24 32C19 34 14 38 13 40" stroke="#07553F" strokeWidth="0.8" strokeOpacity="0.3" />
          <defs>
            <linearGradient id="leaf_grad_1" x1="24" y1="2" x2="24" y2="55" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22C55E" />
              <stop offset="0.7" stopColor="#087F5B" />
              <stop offset="1" stopColor="#07553F" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Leaf 2 - Upper Right */}
      <div 
        ref={leaf2Ref}
        onMouseEnter={() => handleLeafTouch(2)}
        onTouchStart={() => handleLeafTouch(2)}
        className="hero-leaf hero-leaf-2 absolute top-4 right-8 w-10 h-14 drop-shadow-[0_6px_14px_rgba(8,127,91,0.18)] cursor-pointer pointer-events-auto transition-transform"
        style={{ transform: 'rotate(42deg)' }}
        title="Touch leaf!"
      >
        <svg viewBox="0 0 40 56" fill="none" className="w-full h-full">
          <path 
            d="M20 2C30 12 38 28 32 45C25 50 15 50 8 44C2 26 10 12 20 2Z" 
            fill="url(#leaf_grad_2)" 
          />
          <path d="M20 5C19 22 20 39 20 48" stroke="#07553F" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
          <defs>
            <linearGradient id="leaf_grad_2" x1="20" y1="2" x2="20" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4ADE80" />
              <stop offset="0.6" stopColor="#16A36F" />
              <stop offset="1" stopColor="#07553F" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Leaf 3 - Mid Right */}
      <div 
        ref={leaf3Ref}
        onMouseEnter={() => handleLeafTouch(3)}
        onTouchStart={() => handleLeafTouch(3)}
        className="hero-leaf hero-leaf-3 absolute top-[44%] -right-2 w-13 h-17 drop-shadow-[0_10px_20px_rgba(8,127,91,0.22)] cursor-pointer pointer-events-auto transition-transform"
        style={{ transform: 'rotate(15deg)' }}
        title="Touch leaf!"
      >
        <svg viewBox="0 0 48 64" fill="none" className="w-full h-full">
          <path 
            d="M24 2C36 14 46 32 38 52C30 58 18 58 10 50C2 30 12 14 24 2Z" 
            fill="url(#leaf_grad_3)" 
          />
          <path d="M24 6C23 25 24 45 24 55" stroke="#07553F" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
          <defs>
            <linearGradient id="leaf_grad_3" x1="24" y1="2" x2="24" y2="55" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="0.7" stopColor="#087F5B" />
              <stop offset="1" stopColor="#07553F" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Leaf 4 - Mid-Left */}
      <div 
        ref={leaf4Ref}
        onMouseEnter={() => handleLeafTouch(4)}
        onTouchStart={() => handleLeafTouch(4)}
        className="hero-leaf hero-leaf-4 absolute top-[52%] -left-4 w-10 h-14 drop-shadow-[0_8px_16px_rgba(8,127,91,0.2)] cursor-pointer pointer-events-auto transition-transform"
        style={{ transform: 'rotate(-48deg)' }}
        title="Touch leaf!"
      >
        <svg viewBox="0 0 44 60" fill="none" className="w-full h-full">
          <path 
            d="M22 2C33 13 42 30 35 48C28 54 17 54 9 46C2 28 11 13 22 2Z" 
            fill="url(#leaf_grad_4)" 
          />
          <path d="M22 6C21 24 22 42 22 51" stroke="#07553F" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
          <defs>
            <linearGradient id="leaf_grad_4" x1="22" y1="2" x2="22" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#86EFAC" />
              <stop offset="0.5" stopColor="#16A36F" />
              <stop offset="1" stopColor="#087F5B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Leaf 5 - Bottom Foreground */}
      <div 
        ref={leaf5Ref}
        onMouseEnter={() => handleLeafTouch(5)}
        onTouchStart={() => handleLeafTouch(5)}
        className="hero-leaf hero-leaf-5 absolute bottom-1 right-[26%] w-11 h-15 drop-shadow-[0_12px_24px_rgba(8,127,91,0.24)] cursor-pointer pointer-events-auto transition-transform"
        style={{ transform: 'rotate(70deg)' }}
        title="Touch leaf!"
      >
        <svg viewBox="0 0 48 64" fill="none" className="w-full h-full">
          <path 
            d="M24 2C36 14 46 32 38 52C30 58 18 58 10 50C2 30 12 14 24 2Z" 
            fill="url(#leaf_grad_5)" 
          />
          <path d="M24 6C23 25 24 45 24 55" stroke="#07553F" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
          <defs>
            <linearGradient id="leaf_grad_5" x1="24" y1="2" x2="24" y2="55" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4ADE80" />
              <stop offset="0.7" stopColor="#087F5B" />
              <stop offset="1" stopColor="#07553F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
