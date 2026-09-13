import React from 'react';
import { Compass, CheckSquare, DownloadCloud, PlayCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      description: 'Explore our catalog of 90+ verified mobile games spanning Rummy, 777 Slots, Crash, and Board titles.',
      icon: Compass,
    },
    {
      number: '02',
      title: 'Choose',
      description: 'Review gameplay guides, verified player ratings, welcome bonuses, and storage requirements.',
      icon: CheckSquare,
    },
    {
      number: '03',
      title: 'Download',
      description: 'Get the official Android APK directly with zero redirects, high download speeds, and complete antivirus safety.',
      icon: DownloadCloud,
    },
    {
      number: '04',
      title: 'Play',
      description: 'Install in seconds, claim your welcome gift package, and compete against active players across India.',
      icon: PlayCircle,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] bg-[#EEF8F2] px-3.5 py-1 rounded-full border border-[#087F5B]/20">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172331] tracking-tight mt-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#5D6B78] mt-2">
            Get from discovery to playing your favorite games in under two minutes.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-[#E4ECE7] -translate-y-6 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.number}
                  className="bg-white rounded-3xl p-6 border border-[#E4ECE7] shadow-luxury hover:shadow-luxury-hover hover:border-[#087F5B]/30 transition-all duration-300 text-center flex flex-col items-center group"
                >
                  {/* Step bubble with icon */}
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF8F2] group-hover:bg-[#087F5B] transition-colors flex items-center justify-center text-[#087F5B] group-hover:text-white mb-4 shadow-xs relative">
                    <Icon className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#172331] text-white text-[10px] font-black flex items-center justify-center font-mono">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#172331] group-hover:text-[#087F5B] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#5D6B78] mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
