import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Mail, Globe, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Real Yono Games',
  description:
    'Review the official Privacy Policy for Real Yono Games. Learn how information is handled responsibly on realyonogame.com.',
};

export default function PrivacyPolicyPage() {
  const effectiveDate = 'September 22, 2026';
  const lastUpdated = 'September 22, 2026';

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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5D6B78]">
            <span><strong>Effective Date:</strong> {effectiveDate}</span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span><strong>Last Updated:</strong> {lastUpdated}</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="p-6 rounded-3xl bg-[#F7FBF8] border border-[#E4ECE7] space-y-3 text-sm sm:text-base text-[#5D6B78] leading-relaxed">
          <p>
            At Real Yono Games (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), accessible through realyonogame.com (the &quot;Website&quot;), we respect your privacy and are committed to handling information responsibly.
          </p>
          <p>
            This Privacy Policy explains what information may be collected when you visit or interact with our Website, how that information may be used, and how you can contact us regarding privacy-related questions.
          </p>
        </div>

        {/* Main Privacy Policy Body */}
        <div className="space-y-10 text-sm sm:text-base text-[#5D6B78] leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">1.</span> Information We May Collect
            </h2>
            <p>
              Depending on how you use the Website, we may collect the following categories of information.
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-[#172331]">Technical Information</h3>
              <p>
                When you visit our Website, certain technical information may be automatically generated or collected, such as:
              </p>
              <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
                <li>• IP address</li>
                <li>• Browser type and version</li>
                <li>• Operating system and device information</li>
                <li>• Screen or display information</li>
                <li>• Pages visited and interactions with the Website</li>
                <li>• Date and time of access</li>
                <li>• Referring website or URL</li>
                <li>• Other technical information necessary for website security and operation</li>
              </ul>
            </div>

            <div className="space-y-3 pt-3">
              <h3 className="text-base font-bold text-[#172331]">Information You Voluntarily Provide</h3>
              <p>
                If you contact us through email, contact forms, or other communication methods provided on the Website, you may voluntarily provide information such as:
              </p>
              <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
                <li>• Name</li>
                <li>• Email address</li>
                <li>• Message or enquiry details</li>
                <li>• Any other information included in your communication</li>
              </ul>
              <p className="text-xs sm:text-sm pt-1">
                We do not require users to create an account on the Website unless explicitly stated otherwise.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">2.</span> How We Use Information
            </h2>
            <p>
              Information collected through the Website may be used for purposes such as:
            </p>
            <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
              <li>• Operating and maintaining the Website</li>
              <li>• Responding to enquiries and support requests</li>
              <li>• Improving Website performance, usability, and navigation</li>
              <li>• Monitoring and preventing fraud, abuse, spam, or automated attacks</li>
              <li>• Maintaining the security and integrity of the Website</li>
              <li>• Understanding general Website usage and traffic patterns</li>
              <li>• Complying with applicable legal and regulatory requirements</li>
            </ul>
            <p className="pt-1">
              We aim to use personal information only for legitimate and relevant purposes associated with operating and improving the Website or as otherwise permitted by applicable law.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">3.</span> Cookies and Similar Technologies
            </h2>
            <p>
              Real Yono Games may use cookies, browser storage, or similar technologies to support basic Website functionality and remember certain user preferences.
            </p>
            <p>These technologies may be used to:</p>
            <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
              <li>• Remember selected preferences</li>
              <li>• Improve Website functionality</li>
              <li>• Understand Website usage and performance</li>
              <li>• Improve the overall user experience</li>
            </ul>
            <p className="pt-1">
              You can manage or disable cookies through your browser settings. Disabling certain cookies or browser storage may affect some Website features.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">4.</span> Third-Party Websites, Games and Download Links
            </h2>
            <p>
              The Website may contain links to third-party websites, applications, game pages, or download locations.
            </p>
            <p>
              When you select an external link, you may be redirected away from realyonogame.com to a website or service operated by another party.
            </p>
            <p>These third-party websites and applications may have their own:</p>
            <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
              <li>• Privacy Policies</li>
              <li>• Terms and Conditions</li>
              <li>• Data collection practices</li>
              <li>• Security practices</li>
              <li>• Download and installation procedures</li>
            </ul>
            <p className="pt-1">
              Real Yono Games does not control the privacy practices, security practices, content, or data handling practices of third-party websites and applications.
            </p>
            <p>
              We recommend that users review the applicable terms and privacy policies of any third-party website or application before providing personal information or downloading and installing software.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">5.</span> Information Sharing
            </h2>
            <p>
              We may use third-party service providers where necessary to operate, maintain, secure, or improve the Website. These may include providers for hosting, security, communications, or other technical services.
            </p>
            <p>Information may also be disclosed where reasonably necessary:</p>
            <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
              <li>• To comply with applicable laws or lawful legal processes</li>
              <li>• To respond to valid governmental or regulatory requests</li>
              <li>• To protect the security and integrity of the Website</li>
              <li>• To investigate suspected fraud, abuse, or security incidents</li>
              <li>• To protect our legal rights or the rights and safety of users and others</li>
              <li>• In connection with a business transfer, merger, acquisition, or restructuring, where permitted by applicable law</li>
            </ul>
            <p className="pt-1 font-medium text-[#172331]">
              We do not sell personal information for monetary consideration.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">6.</span> Data Security
            </h2>
            <p>
              We take reasonable technical and organisational measures designed to protect information against unauthorised access, alteration, disclosure, loss, or destruction.
            </p>
            <p>
              However, no website, online service, or method of electronic transmission can be guaranteed to be completely secure. Users should therefore understand that transmission of information over the internet involves inherent security risks.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">7.</span> Data Retention
            </h2>
            <p>
              We retain information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including website operation, security, dispute resolution, legal compliance, and enforcement of applicable agreements.
            </p>
            <p>
              The actual retention period may vary depending on the type of information and the purpose for which it was collected.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">8.</span> Age Restriction
            </h2>
            <p>
              The Website is intended for users who are 18 years of age or older.
            </p>
            <p>
              We do not knowingly request or intentionally collect personal information from individuals below the applicable legal age.
            </p>
            <p>
              If you believe that a minor has provided personal information through the Website, please contact us so that the matter can be reviewed and appropriate action can be taken.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">9.</span> Your Privacy Rights
            </h2>
            <p>
              Depending on applicable law, you may have certain rights concerning your personal information, including rights relating to:
            </p>
            <ul className="space-y-2 pl-4 border-l-2 border-[#087F5B]/30 text-xs sm:text-sm">
              <li>• Accessing information held about you</li>
              <li>• Requesting correction of inaccurate information</li>
              <li>• Requesting deletion where legally applicable</li>
              <li>• Withdrawing consent where applicable</li>
              <li>• Raising a privacy-related concern or complaint</li>
            </ul>
            <p className="pt-1">
              To submit a privacy-related request, please contact us using the details provided below.
            </p>
            <p>
              We may need to verify the identity of the person making a request before processing certain requests.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">10.</span> Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes to our Website, information practices, services, or applicable legal requirements.
            </p>
            <p>
              When changes are made, the &quot;Last Updated&quot; date at the top of this page will be updated.
            </p>
            <p>
              We encourage users to review this page periodically for the latest information about our privacy practices.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4 pt-4 border-t border-[#E4ECE7]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#172331] flex items-center gap-2">
              <span className="text-[#087F5B]">11.</span> Contact Us
            </h2>
            <p>
              If you have questions, concerns, or requests relating to this Privacy Policy or the handling of personal information, you can contact us at:
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
                  Privacy Email:{' '}
                  <a
                    href="mailto:privacy@realyonogame.com"
                    className="text-[#087F5B] font-semibold underline hover:text-[#07553F] transition-colors"
                  >
                    privacy@realyonogame.com
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
