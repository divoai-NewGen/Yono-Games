import React from 'react';
import { ShieldAlert, Compass } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#F7FBF8] border-t border-[#E4ECE7]/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* About Real Yono Games Card */}
        <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E4ECE7] shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Gaming Discovery</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172331] tracking-tight">
            About Real Yono Games
          </h2>

          <div className="space-y-3.5 text-sm sm:text-base text-[#5D6B78] leading-relaxed">
            <p className="font-bold text-[#172331]">
              Real Yono Games is a gaming discovery platform featuring a wide range of mobile games, entertainment titles, and gaming applications in one convenient place.
            </p>

            <p>
              Explore our growing collection of games, discover new titles, and find useful information about available applications before you choose to continue to a game or external service.
            </p>

            <p>
              We aim to provide a simple, organized, and user-friendly gaming discovery experience for adults.
            </p>
          </div>
        </div>

        {/* 🛡️ Safety Alert Card */}
        <div className="bg-white p-7 sm:p-10 rounded-3xl border border-amber-200/80 shadow-sm space-y-4 bg-gradient-to-br from-white via-amber-50/20 to-white">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172331] tracking-tight">
              🛡️ Safety Alert
            </h2>
          </div>

          <div className="space-y-2.5 text-sm sm:text-base text-[#5D6B78] leading-relaxed">
            <p className="font-bold text-[#172331]">
              Please Play Responsibly
            </p>

            <p>
              Before downloading or using any gaming application, review its terms, privacy policy, eligibility requirements, permissions, and applicable laws. Avoid sharing sensitive personal or financial information unless you understand who is requesting it and why.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
