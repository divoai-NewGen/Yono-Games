import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Gamepad2, Home, ArrowLeft, Search } from 'lucide-react';
import { createMetadata } from '@/utils/seo';
import { STATIC_PAGE_SEO } from '@/utils/seoData';

export const metadata: Metadata = createMetadata(STATIC_PAGE_SEO.notFound);

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] mx-auto shadow-sm">
          <Gamepad2 className="w-10 h-10" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] bg-[#EEF8F2] px-3 py-1 rounded-full">
            404 Error
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#172331] tracking-tight">
            Game or Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-[#5D6B78] max-w-sm mx-auto">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/games"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#EEF8F2] text-[#087F5B] font-bold text-sm border-2 border-[#087F5B]/30 hover:border-[#087F5B] transition-all"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Browse All Games</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
