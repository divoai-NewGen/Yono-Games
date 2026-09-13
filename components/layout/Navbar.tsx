'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Mail, Menu, X, ShieldCheck } from 'lucide-react';
import SearchModal from '@/components/ui/SearchModal';
import DownloadModal from '@/components/ui/DownloadModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Nav links (Contact Us is prominently highlighted as the right CTA button)
  const navLinks = [
    { name: 'Home', href: '/home/' },
    { name: 'Games', href: '/games/' },
    { name: 'Privacy Policy', href: '/privacy-policy/' },
    { name: 'Disclaimer', href: '/disclaimer/' },
  ];

  const isActive = (href: string) => {
    if (href === '/home/') {
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
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(8,127,91,0.08)] border-b border-[#E4ECE7] py-3'
            : 'bg-white/80 backdrop-blur-sm border-b border-[#E4ECE7]/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link href="/home/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:shadow-[0_0_15px_rgba(8,127,91,0.35)] transition-all flex-shrink-0 border border-[#E4ECE7]/60">
              <Image
                src="/images/logo.png"
                alt="Yono Games Logo"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="40px"
              />
            </div>

            <div className="flex items-baseline text-2xl font-black tracking-tight leading-none">
              <span className="text-[#172331]">Yono</span>
              <span className="text-[#087F5B] ml-1.5">Games</span>
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
          <div className="hidden sm:flex items-center gap-3">
            {/* Search Pill */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#F7FBF8] hover:bg-[#EEF8F2] border border-[#E4ECE7] text-[#5D6B78] hover:text-[#172331] text-xs font-medium transition-all shadow-2xs group"
              aria-label="Search games"
            >
              <Search className="w-3.5 h-3.5 text-[#087F5B] group-hover:scale-110 transition-transform" />
              <span>Search games...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#E4ECE7] rounded text-gray-400">
                ⌘K
              </kbd>
            </button>

            {/* Contact Us CTA Button */}
            <Link
              href="/contact-us/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Mobile hamburger menu & mobile search trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl bg-[#F7FBF8] border border-[#E4ECE7] text-[#5D6B78]"
              aria-label="Search games"
            >
              <Search className="w-4 h-4 text-[#087F5B]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#F7FBF8] border border-[#E4ECE7] text-[#172331]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Animated Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#E4ECE7] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                      active
                        ? 'bg-[#EEF8F2] text-[#07553F] font-bold'
                        : 'text-[#5D6B78] hover:bg-[#F7FBF8]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#E4ECE7] space-y-2">
              <Link
                href="/contact-us/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#087F5B] text-white text-sm font-bold shadow-md"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5D6B78] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>Official Yono Games Application</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <DownloadModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />
    </>
  );
}
