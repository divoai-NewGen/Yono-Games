import React from 'react';
import { Metadata } from 'next';
import { Scale, Mail, Globe, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer | Real Yono Games',
  description:
    'Read the official Disclaimer for Real Yono Games. Essential information regarding third-party content, external links, intellectual property, and financial risks.',
};

export default function DisclaimerPage() {
  const lastUpdated = 'September 22, 2026';

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-[#E4ECE7] pb-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            Terms & Notice
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#172331] tracking-tight">
            Disclaimer
          </h1>
          <p className="text-xs text-[#5D6B78]">
            <strong>Last Updated:</strong> {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="p-6 rounded-3xl bg-[#F7FBF8] border border-[#E4ECE7] space-y-3 text-sm sm:text-base text-[#5D6B78] leading-relaxed">
          <p>
            The information provided on Real Yono Games (&quot;Website&quot;) is provided for general informational and entertainment-related purposes.
          </p>
          <p>
            By accessing or using this Website, you acknowledge and agree to the following:
          </p>
        </div>

        {/* Main Disclaimer Body */}
        <div className="space-y-10 text-sm sm:text-base text-[#5D6B78] leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">1.</span> Informational and Discovery Platform
            </h2>
            <p>
              Real Yono Games provides information about games, gaming-related content, features, and links to third-party websites and applications.
            </p>
            <p>
              The Website may provide descriptions, guides, screenshots, game information, and external links for informational purposes.
            </p>
            <p>
              Unless expressly stated otherwise, Real Yono Games does not own or operate the third-party games, applications, websites, or services linked through this Website.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">2.</span> Third-Party Websites and Applications
            </h2>
            <p>
              Some links on this Website may redirect you to websites, application pages, download pages, or other services operated by third parties.
            </p>
            <p>
              Once you leave realyonogame.com, your interaction is subject to the terms, privacy policies, security practices, and other policies of the relevant third-party service.
            </p>
            <p>Real Yono Games does not control or guarantee the:</p>
            <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
              <li>• Availability of third-party websites</li>
              <li>• Accuracy of third-party information</li>
              <li>• Security of third-party websites or applications</li>
              <li>• Content provided by third parties</li>
              <li>• Privacy practices of third parties</li>
              <li>• Terms or policies of third-party services</li>
            </ul>
            <p className="pt-1">
              Users should review the relevant third-party terms and policies before using an external service or downloading an application.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">3.</span> Third-Party Games and Downloads
            </h2>
            <p>
              Game names, logos, trademarks, application names, screenshots, artwork, and other identifying materials displayed on this Website may belong to their respective owners.
            </p>
            <p>
              Their appearance on this Website does not, by itself, imply ownership, partnership, sponsorship, or endorsement by Real Yono Games.
            </p>
            <p>
              Where a download or installation link points to an external service, the relevant third party is responsible for the application or software made available through that service.
            </p>
            <p>
              Users should exercise appropriate caution before downloading or installing software from an external website.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">4.</span> Financial Risk
            </h2>
            <p>
              Certain third-party gaming services may involve entry fees, monetary transactions, prizes, rewards, or other financial elements.
            </p>
            <p>
              Real Yono Games does not provide financial advice and does not guarantee any monetary return, winnings, rewards, or financial outcome from any third-party service.
            </p>
            <p>
              Users are responsible for understanding the terms, risks, fees, and applicable laws associated with any third-party service before using it.
            </p>
            <p className="pt-1 font-semibold text-[#172331]">
              Never use money that you cannot afford to lose.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">5.</span> Legal Compliance
            </h2>
            <p>
              Laws and regulations relating to online games, competitions, gaming services, and monetary participation may vary depending on the user&apos;s location and the nature of the relevant service.
            </p>
            <p>
              Users are responsible for determining whether their use of any third-party game or service is permitted under the laws applicable to them.
            </p>
            <p>
              Nothing on this Website should be interpreted as legal advice or as a representation that a particular game, application, or third-party service is lawful or available in every jurisdiction.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">6.</span> Age Restriction
            </h2>
            <p>
              This Website is intended for individuals 18 years of age or older.
            </p>
            <p>
              Users are responsible for complying with applicable age restrictions and other eligibility requirements associated with any third-party service they choose to access.
            </p>
            <p>
              We do not knowingly encourage minors to access age-restricted gaming services.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">7.</span> Intellectual Property
            </h2>
            <p>
              The trademarks, logos, names, graphics, game artwork, and other intellectual property displayed on this Website may belong to their respective owners.
            </p>
            <p>
              Unless expressly stated otherwise, Real Yono Games does not claim ownership of third-party intellectual property.
            </p>
            <p>
              If you believe that any material displayed on this Website infringes your intellectual-property rights, please contact us using the details below so that the matter can be reviewed.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">8.</span> No Guarantee
            </h2>
            <p>
              While we make reasonable efforts to keep information on the Website useful and up to date, we do not guarantee that all information, descriptions, links, availability, or third-party content will always be complete, accurate, current, or error-free.
            </p>
            <p>
              Third-party websites and applications may change, become unavailable, or modify their services without notice.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">9.</span> Limitation Regarding Third-Party Services
            </h2>
            <p>
              Real Yono Games is not responsible for transactions, accounts, deposits, withdrawals, winnings, losses, disputes, customer-support matters, software behaviour, or other activities that occur directly between a user and a third-party service.
            </p>
            <p>
              Any such matter should be addressed with the relevant third-party operator.
            </p>
            <p>
              Nothing in this Disclaimer is intended to exclude or limit liability to the extent that such exclusion or limitation is not permitted under applicable law.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">10.</span> Responsible Use
            </h2>
            <p>
              Users should make informed and responsible decisions when accessing online games or third-party gaming services.
            </p>
            <p>
              Where a third-party service involves financial participation, users should understand the associated risks and avoid spending money beyond their personal financial limits.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">11.</span> Changes to This Disclaimer
            </h2>
            <p>
              We may update this Disclaimer from time to time to reflect changes to the Website, third-party links, services, or applicable legal requirements.
            </p>
            <p>
              The &quot;Last Updated&quot; date will be revised whenever material changes are made.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-4 pt-4 border-t border-[#E4ECE7]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">12.</span> Contact Us
            </h2>
            <p>
              For questions, legal notices, intellectual-property concerns, or other matters relating to this Disclaimer, please contact:
            </p>

            <div className="p-6 rounded-3xl bg-[#F7FBF8] border border-[#E4ECE7] space-y-4 text-xs sm:text-sm text-[#172331]">
              <div className="font-bold text-base text-[#087F5B]">
                Real Yono Games
              </div>

              <div className="flex items-center gap-2 text-[#5D6B78]">
                <Globe className="w-4 h-4 text-[#087F5B] flex-shrink-0" />
                <span>Website: <strong className="text-[#172331]">realyonogame.com</strong></span>
              </div>

              <div className="flex items-center gap-2 text-[#5D6B78]">
                <Mail className="w-4 h-4 text-[#087F5B] flex-shrink-0" />
                <span>
                  Legal Email:{' '}
                  <a
                    href="mailto:legal@realyonogame.com"
                    className="text-[#087F5B] font-semibold underline hover:text-[#07553F] transition-colors"
                  >
                    legal@realyonogame.com
                  </a>
                </span>
              </div>

              <div className="flex items-start gap-2 text-[#5D6B78] pt-2 border-t border-[#E4ECE7]">
                <MapPin className="w-4 h-4 text-[#087F5B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-[#172331]">Business/Legal Address:</span>
                  <span className="font-mono text-xs text-[#5D6B78]">[CLIENT&apos;S ACTUAL BUSINESS ADDRESS]</span>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
