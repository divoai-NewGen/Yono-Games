'use client';

import React from 'react';
import { X, ShieldCheck, Download, Smartphone, CheckCircle, Sparkles } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName?: string;
  apkUrl?: string;
}

export default function DownloadModal({ 
  isOpen, 
  onClose, 
  gameName = 'All Yono Games Official App',
  apkUrl = 'https://realyonogame.com/download/yono-games-official.apk'
}: DownloadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E4ECE7] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative ambient header */}
        <div className="bg-gradient-to-br from-[#EEF8F2] to-[#F7FBF8] p-6 pb-4 border-b border-[#E4ECE7] relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 border border-[#E4ECE7] flex items-center justify-center text-[#5D6B78] hover:text-[#172331] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#087F5B]/20 text-[#087F5B] text-xs font-semibold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6A83E]" />
            Official Verified Release
          </div>

          <h3 className="text-xl font-bold text-[#172331]">{gameName}</h3>
          <p className="text-xs text-[#5D6B78] mt-1">
            Get instant access to India’s most trusted gaming experience.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick specs pill */}
          <div className="grid grid-cols-3 gap-2 bg-[#F7FBF8] p-3 rounded-2xl border border-[#E4ECE7] text-center">
            <div>
              <p className="text-[10px] uppercase font-semibold text-[#5D6B78]">OS Version</p>
              <p className="text-xs font-bold text-[#172331] mt-0.5">Android 6.0+</p>
            </div>
            <div className="border-x border-[#E4ECE7]">
              <p className="text-[10px] uppercase font-semibold text-[#5D6B78]">Package Size</p>
              <p className="text-xs font-bold text-[#172331] mt-0.5">38.4 MB</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-[#5D6B78]">Security</p>
              <p className="text-xs font-bold text-[#087F5B] mt-0.5 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Link
              </p>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-2 text-xs text-[#172331]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#087F5B] flex-shrink-0" />
              <span>Direct application access with latest version compatibility</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#087F5B] flex-shrink-0" />
              <span>Instant access to application features and updates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#087F5B] flex-shrink-0" />
              <span>Dedicated player assistance and navigation guides</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={apkUrl}
              download
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download className="w-4 h-4" />
              Download APK Now (Free)
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-[#5D6B78] hover:text-[#172331] font-medium transition-colors"
            >
              Continue browsing on web
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#5D6B78] pt-1 border-t border-[#E4ECE7]">
            <Smartphone className="w-3.5 h-3.5 text-[#087F5B]" />
            <span>Compatible with all major smartphone brands in India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
