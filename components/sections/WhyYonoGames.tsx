import React from 'react';
import { Layers, Zap, Sparkles, Headset } from 'lucide-react';

export default function WhyYonoGames() {
  const benefits = [
    {
      step: '01',
      title: 'Wide Game Collection',
      description:
        'Explore a growing collection of Yono games, arcade titles, card games, board games, and other popular mobile gaming experiences.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Easy Game Discovery',
      description:
        'Browse game information in one place with clear details, useful resources, and direct access to individual game pages.',
      icon: Zap,
    },
    {
      step: '03',
      title: 'Fresh Weekly Updates',
      description:
        'Our catalogue is regularly updated with new titles, game information, features, and the latest updates across the collection.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'Helpful Support',
      description:
        'Find useful information and guidance for exploring games, understanding features, and getting started with the titles in our catalogue.',
      icon: Headset,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-[#F7FBF8] border-t border-[#E4ECE7]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] bg-[#EEF8F2] px-3.5 py-1 rounded-full border border-[#087F5B]/20">
            Why Choose Us
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172331] tracking-tight mt-3">
            Explore Yono Games in One Place
          </h2>

          <p className="text-sm sm:text-base text-[#5D6B78] mt-2">
            Discover popular mobile games with useful information, regular
            updates, and an easy-to-browse gaming catalogue.
          </p>
        </div>

        {/* Benefits Grid */}
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
                  <span>Game Directory</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}