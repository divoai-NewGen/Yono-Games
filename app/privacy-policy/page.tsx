import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | More Yono Games',
  description:
    'Review the official Privacy Policy for More Yono Games. Learn how we protect player data, enforce security, and maintain strict privacy standards.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 2026';

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-[#E4ECE7] pb-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Legal & Compliance
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#172331] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#5D6B78]">
            Effective Date: {lastUpdated} • More Yono Games Platform
          </p>
        </div>

        {/* Quick Highlights Card */}
        <div className="p-6 rounded-3xl bg-[#F7FBF8] border border-[#E4ECE7] space-y-3">
          <h3 className="text-sm font-bold text-[#07553F] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#087F5B]" />
            Privacy At A Glance
          </h3>
          <p className="text-xs sm:text-sm text-[#5D6B78] leading-relaxed">
            At More Yono Games, your digital privacy and data protection are fundamental. We do not sell player personal information to third parties. All network traffic is encrypted via 256-bit SSL protocols.
          </p>
        </div>

        {/* Editorial Body */}
        <div className="space-y-10 text-sm sm:text-base text-[#5D6B78] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">1.</span> Information We Collect
            </h2>
            <p>
              When you interact with the More Yono Games portal or download applications through our verified links, we may collect minimal technical and communication data, including:
            </p>
            <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
              <li>• <strong>Device & Telemetry Data:</strong> Operating system version, screen resolution, browser user-agent, and download referral identifiers to optimize APK performance.</li>
              <li>• <strong>Communication Details:</strong> Name, email address, and ticket content provided voluntarily when contacting player assistance.</li>
              <li>• <strong>Analytical Metrics:</strong> Non-personally identifiable page interaction patterns, time spent on game listings, and category preferences.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">2.</span> How We Use Your Data
            </h2>
            <p>
              The data collected serves exclusively to ensure smooth platform operation, enhance security protocols, and deliver tailored gaming discovery features:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-[#172331]">
              <div className="p-3.5 rounded-xl bg-white border border-[#E4ECE7] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#087F5B] flex-shrink-0 mt-0.5" />
                <span>Delivering clean, uncorrupted APK package downloads</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E4ECE7] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#087F5B] flex-shrink-0 mt-0.5" />
                <span>Troubleshooting technical bugs and game installation queries</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E4ECE7] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#087F5B] flex-shrink-0 mt-0.5" />
                <span>Preventing fraudulent access and automated bot abuse</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E4ECE7] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#087F5B] flex-shrink-0 mt-0.5" />
                <span>Improving website responsiveness and navigation clarity</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">3.</span> Cookies & Local Storage
            </h2>
            <p>
              We use necessary operational cookies to remember your device preferences (such as dark/light contrast preference and catalog sorting state). You can configure your browser to reject cookies, though some interactive elements may experience slight delays.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">4.</span> Strict Age Limitation (18+)
            </h2>
            <p>
              Our discovery portal and listed gaming titles are strictly reserved for individuals aged 18 years or older. We do not knowingly collect or solicit any data from minors under the legal age of majority. If you believe a minor has accessed this service, please contact us immediately for prompt removal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">5.</span> Security Architecture
            </h2>
            <p>
              We deploy industry-standard technical safeguards, firewalls, and cryptographic transport controls to shield your information from unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">6.</span> Contacting Our Data Officer
            </h2>
            <p>
              If you have any questions, inquiries, or data requests regarding this Privacy Policy, please contact our compliance desk at{' '}
              <a href="mailto:privacy@realyonogame.com" className="text-[#087F5B] font-semibold underline">
                privacy@realyonogame.com
              </a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
