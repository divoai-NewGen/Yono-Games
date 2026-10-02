'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Mail, Home, Gamepad2, Phone, AlertTriangle, ShieldCheck } from 'lucide-react';
import SearchModal from '@/components/ui/SearchModal';
import DownloadModal from '@/components/ui/DownloadModal';

const TELEGRAM_URL = 'https://t.me/PredictionAndGiveaways';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut (Cmd+K / Ctrl+K) for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Nav links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Games', href: '/games' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ];

  // Mobile horizontal bar links with matching icons
  const mobileNavItems = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="w-3.5 h-3.5" />,
      isExternal: false,
    },
    {
      name: 'Games',
      href: '/games',
      icon: <Gamepad2 className="w-3.5 h-3.5" />,
      isExternal: false,
    },
    {
      name: 'Contact',
      href: '/contact-us',
      icon: <Phone className="w-3.5 h-3.5" />,
      isExternal: false,
    },
    {
      name: 'Disclaimer',
      href: '/disclaimer',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      isExternal: false,
    },
    {
      name: 'Telegram',
      href: TELEGRAM_URL,
      icon: (
        <svg
          className="w-3.5 h-3.5 text-[#24A1DE]"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      ),
      isExternal: true,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/' || href === '/home/') {
      return pathname === '/' || pathname === '/home' || pathname === '/home/';
    }
    return pathname.startsWith(href) || pathname === href.replace(/\/$/, '');
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#07553F] md:bg-white/95 md:backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(8,127,91,0.15)] md:shadow-[0_4px_20px_-2px_rgba(8,127,91,0.08)] border-b border-[#064E3B] md:border-[#E4ECE7]'
            : 'bg-[#07553F] md:bg-white/90 md:backdrop-blur-sm border-b border-[#064E3B] md:border-[#E4ECE7]/70'
        }`}
      >
        {/* Top Navbar Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-sm group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all flex-shrink-0 border-2 border-white/40 md:border-[#E4ECE7]/60 bg-white">
              <Image
                src="/logonew.png"
                alt="Real Yono Games Logo"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="40px"
              />
            </div>

            <div className="flex items-baseline text-xl sm:text-2xl font-black tracking-tight leading-none">
              <span className="text-white md:text-[#172331] drop-shadow-xs md:drop-shadow-none">Real Yono</span>
              <span className="text-[#FFD166] md:text-[#087F5B] ml-1 sm:ml-1.5 font-black">Games</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#EEF8F2] text-[#07553F] font-semibold shadow-xs'
                      : 'text-[#5D6B78] hover:text-[#172331] hover:bg-[#F7FBF8]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Utility Controls (Search Pill + Contact Us CTA) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button / Pill */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/20 hover:bg-white/30 md:bg-[#F7FBF8] md:hover:bg-[#EEF8F2] border border-white/30 md:border-[#E4ECE7] text-white md:text-[#5D6B78] hover:text-white md:hover:text-[#172331] text-xs font-medium transition-all shadow-xs group backdrop-blur-xs md:backdrop-blur-none"
              aria-label="Search games"
            >
              <Search className="w-3.5 h-3.5 text-white md:text-[#087F5B] group-hover:scale-110 transition-transform" />
              <span className="hidden xs:inline sm:inline">Search games...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#E4ECE7] rounded text-gray-400">
                ⌘K
              </kbd>
            </button>

            {/* Desktop Contact Us CTA Button */}
            <Link
              href="/contact-us"
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>

        {/* Mobile Horizontal Icon Navigation Sub-Bar */}
        <div className="md:hidden border-t border-[#E4ECE7] bg-white px-2 py-2 shadow-xs">

          <nav
            aria-label="Mobile Navigation"
            className="flex items-center justify-around gap-1 text-[11px] font-semibold text-[#344054]"
          >
            {mobileNavItems.map((item) => {
              const active = !item.isExternal && isActive(item.href);

              if (item.isExternal) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-[#344054] hover:text-[#24A1DE] active:scale-95"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                    active
                      ? 'text-[#087F5B] font-black bg-[#EEF8F2] shadow-2xs'
                      : 'text-[#344054] hover:text-[#087F5B] active:scale-95'
                  }`}
                >
                  <span className={active ? 'text-[#087F5B]' : 'text-[#5D6B78]'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <DownloadModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />
    </>
  );
}

