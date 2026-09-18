import React from 'react';
import { Metadata } from 'next';
import { AlertTriangle, ShieldAlert, Scale, Globe2, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer & Responsible Gaming Notice | More Yono Games',
  description:
    'Read the official Disclaimer and Terms Notice for More Yono Games. Essential details on skill gaming, financial risks, age restrictions, and state jurisdiction eligibility.',
};

export default function DisclaimerPage() {
  const lastUpdated = 'September 2026';

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-[#E4ECE7] pb-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            Terms & Player Notice
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#172331] tracking-tight">
            Disclaimer Notice
          </h1>
          <p className="text-xs text-[#5D6B78]">
            Last Updated: {lastUpdated} • More Yono Games
          </p>
        </div>

        {/* Warning Banner */}
        <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Financial Risk & Habit-Forming Advisory</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            Games of skill and chance involve an element of financial risk and may become addictive. Players must participate responsibly and within personal financial limits. You are solely accountable for any monetary gains or losses incurred.
          </p>
        </div>

        {/* Editorial Body */}
        <div className="space-y-10 text-sm sm:text-base text-[#5D6B78] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">1.</span> Discovery & Informational Purpose
            </h2>
            <p>
              More Yono Games operates as an independent discovery directory, informational hub, and direct application distributor. We provide game guides, feature breakdowns, and verified installation packages. We do not operate unlawful betting operations or manipulate RNG game engines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">2.</span> Age of Majority (Strictly 18+)
            </h2>
            <p>
              Access to and downloading of all games presented on this portal is strictly prohibited for persons under 18 years of age. By using this website, you explicitly warrant that you are at least eighteen (18) years of age and possess full legal capacity to participate in online skill-based entertainment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">3.</span> Restricted Indian State Jurisdictions
            </h2>
            <p>
              Online real-money games and pay-to-play contests are subject to regional and state enactments within the Republic of India. Residents and visitors located in the following states are prohibited from participating in real-money contests on partner apps:
            </p>
            <div className="p-4 rounded-2xl bg-[#F7FBF8] border border-[#E4ECE7] grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-[#172331]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Assam</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Odisha</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Nagaland</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Telangana</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Andhra Pradesh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Sikkim (Selected Contests)</span>
              </div>
            </div>
            <p className="text-xs text-[#5D6B78] mt-1">
              It is the sole responsibility of the user to verify compliance with local laws prior to downloading or depositing funds into any game.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">4.</span> Intellectual Property & Trademarks
            </h2>
            <p>
              All trademarks, game logos, character artwork, and brand identifiers displayed on this platform belong to their respective proprietary creators and copyright holders. Their display does not imply sole ownership by More Yono Games unless expressly stated.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">5.</span> Responsible Play Guidelines
            </h2>
            <p>
              We strongly advocate for healthy, balanced entertainment habits:
            </p>
            <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
              <li>• Always treat gaming as a leisure pastime, not an income generation source.</li>
              <li>• Never stake money allocated for living essentials, bills, or medical expenses.</li>
              <li>• Avoid chasing losses or playing when emotionally fatigued.</li>
              <li>• Take regular breaks and utilize self-exclusion limits available in-game.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">6.</span> Questions & Legal Inquiries
            </h2>
            <p>
              For legal correspondence or clarification regarding these disclaimers, write to us at{' '}
              <a href="mailto:legal@realyonogame.com" className="text-[#087F5B] font-semibold underline">
                legal@realyonogame.com
              </a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
