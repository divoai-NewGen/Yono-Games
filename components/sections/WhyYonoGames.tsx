import React from 'react';
import { Layers, Zap, Sparkles, Headset } from 'lucide-react';

export default function WhyYonoGames() {
  const benefits = [
    {
      step: '01',
      title: 'Wide Game Collection',
      description: 'Over 90+ verified titles spanning classic 13-card rummy, thrilling 777 reels, multiplayer crash curves, and royal board games.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Instant & Direct Access',
      description: 'Zero third-party redirects or obstructive ads. Enjoy direct high-speed APK installation packages optimized for every Android device.',
      icon: Zap,
    },
    {
      step: '03',
      title: 'Fresh Weekly Updates',
      description: 'Continuously curated catalog with seasonal updates, tournament prize pools, and innovative new gameplay mechanics.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: '24/7 Dedicated Support',
      description: 'Round-the-clock player assistance ready to assist with game queries, installation guides, and transaction inquiries.',
      icon: Headset,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-[#F7FBF8] border-t border-[#E4ECE7]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] bg-[#EEF8F2] px-3.5 py-1 rounded-full border border-[#087F5B]/20">
            Platform Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172331] tracking-tight mt-3">
            Why Players Choose Yono Games
          </h2>
          <p className="text-sm sm:text-base text-[#5D6B78] mt-2">
            Engineered for reliability, fair play, and an enjoyable casual gaming experience.
          </p>
        </div>

        {/* Editorial Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white p-7 rounded-3xl border border-[#E4ECE7] shadow-luxury hover:shadow-luxury-hover hover:border-[#087F5B]/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-[#087F5B]/25 group-hover:text-[#087F5B] transition-colors font-mono">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF8F2] group-hover:bg-[#087F5B] transition-colors flex items-center justify-center text-[#087F5B] group-hover:text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#172331] group-hover:text-[#087F5B] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5D6B78] mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4ECE7]/60 flex items-center text-[11px] font-bold text-[#087F5B]">
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
