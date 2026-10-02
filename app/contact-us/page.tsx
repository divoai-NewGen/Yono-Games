import React from 'react';
import type { Metadata } from 'next';
import ContactUsContent from '@/components/contact/ContactUsContent';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { createMetadata } from '@/utils/seo';
import { STATIC_PAGE_SEO } from '@/utils/seoData';
import { getStaticPageBreadcrumb } from '@/utils/breadcrumbs';
import { getWebPageSchema } from '@/utils/structuredData';

export const metadata: Metadata = createMetadata(STATIC_PAGE_SEO.contactUs);

export default function ContactUsPage() {
  const breadcrumbItems = getStaticPageBreadcrumb('Contact Us', 'contact-us');
  const webPageSchema = getWebPageSchema({
    name: 'Contact Real Yono Games Support',
    description: 'Get in touch with Real Yono Games support team for game assistance, inquiries, or partnerships.',
    path: 'contact-us',
    breadcrumbItems,
  });

  return (
    <div className="bg-white min-h-screen">
      <JsonLd id="contact-page-schema" data={webPageSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <ContactUsContent />
    </div>
  );
}
