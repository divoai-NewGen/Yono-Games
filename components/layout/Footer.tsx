'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Lock, HeartHandshake, AlertCircle } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#FFFFFF] via-[#F7FBF8] to-[#EEF8F2] border-t border-[#E4ECE7] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top brand and links grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E4ECE7]">
          
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/home/" className="inline-flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-[#E4ECE7]/60">
                <Image
                  src="/images/logo.png"
                  alt="Real Yono Games Logo"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex items-baseline text-2xl font-black tracking-tight leading-none">
                <span className="text-[#172331]">Real Yono</span>
                <span className="text-[#087F5B] ml-1.5">Games</span>
              </div>
            </Link>

            <p className="text-sm text-[#5D6B78] max-w-md leading-relaxed">
              India&apos;s premier gaming discovery platform. Explore verified releases, classic card games, fast-paced arcade action, and exciting tournaments all in one secure destination.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4ECE7] text-xs font-medium text-[#172331] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#087F5B]" />
                <span>RNG Certified Fair Play</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4ECE7] text-xs font-medium text-[#172331] shadow-2xs">
                <Lock className="w-4 h-4 text-[#087F5B]" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4ECE7] text-xs font-medium text-[#172331] shadow-2xs">
                <HeartHandshake className="w-4 h-4 text-[#D6A83E]" />
                <span>18+ Responsible Gaming</span>
              </div>
            </div>
          </div>

          {/* Navigation Links - Exact requested items */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#07553F]">
              Site Navigation
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/home/" className="text-[#5D6B78] hover:text-[#087F5B] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/games/" className="text-[#5D6B78] hover:text-[#087F5B] transition-colors">
                  Explore Games
                </Link>
              </li>
              <li>
                <Link href="/contact-us/" className="text-[#5D6B78] hover:text-[#087F5B] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy/" className="text-[#5D6B78] hover:text-[#087F5B] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer/" className="text-[#5D6B78] hover:text-[#087F5B] transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Support & Legal Notice */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#07553F]">
              Player Assistance
            </h4>
            <p className="text-xs text-[#5D6B78] leading-relaxed">
              Have questions regarding game installation, account verification, or queries? Reach our team anytime via our help desk.
            </p>
            <div className="pt-2">
              <Link 
                href="/contact-us/" 
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white border border-[#087F5B]/30 hover:bg-[#EEF8F2] text-xs font-semibold text-[#087F5B] transition-all"
              >
                Reach Support 24/7 →
              </Link>
            </div>
          </div>
        </div>

        {/* Responsible Gaming Notice Card */}
        <div className="my-8 p-4 sm:p-5 rounded-2xl bg-white border border-[#E4ECE7] shadow-xs flex items-start gap-3.5">
          <AlertCircle className="w-5 h-5 text-[#D6A83E] flex-shrink-0 mt-0.5" />
          <div className="space-y-3 flex-1">
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-[#172331]">Responsible Gaming & Disclaimer Notice</h5>
              <p className="text-[11px] sm:text-xs text-[#5D6B78] leading-relaxed">
                Games hosted or referenced on this portal may involve an element of financial risk and may be addictive. Please play responsibly and at your own risk. This platform is strictly intended for users aged 18 and above. Participation is void where prohibited by applicable state laws (including Assam, Odisha, Nagaland, Telangana, and Andhra Pradesh where skill/chance gaming rules apply).
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#EEF3F0] space-y-1">
              <h5 className="text-xs font-bold text-[#172331]">Independent Promotional Platform & Developer Disclaimer</h5>
              <p className="text-[11px] sm:text-xs text-[#5D6B78] leading-relaxed">
                This website is an independent information and promotional platform. We do not own, operate, or manage any third-party games, APKs, or payment services. Users access external websites and applications at their own discretion. The platform developers and operators hold no liability or responsibility for any third-party content, financial transactions, legal/illegal operations, or copyright matters of external services.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5D6B78] pt-4">
          <p>© {currentYear} Real Yono Games. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy/" className="hover:text-[#087F5B] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/disclaimer/" className="hover:text-[#087F5B] transition-colors">
              Disclaimer
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact-us/" className="hover:text-[#087F5B] transition-colors">
              Support
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
