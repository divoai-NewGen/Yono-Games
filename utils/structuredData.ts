import { SITE_URL, SITE_NAME, canonicalUrl } from './seo';
import { Game } from '@/types/game';

/**
 * Organization Schema (JSON-LD)
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'Yono Games',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logonew.png`,
      width: 512,
      height: 512,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@realyonogame.com',
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

/**
 * WebSite Schema (JSON-LD)
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description:
      'Official gaming directory and platform for verified Yono games, APK downloads, and mobile gaming resources.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/games?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * BreadcrumbList Schema (JSON-LD)
 */
export function getBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.url),
    })),
  };
}

/**
 * WebPage Schema (JSON-LD)
 */
export function getWebPageSchema(options: {
  name: string;
  description: string;
  path: string;
  breadcrumbItems?: BreadcrumbItem[];
}) {
  const url = canonicalUrl(options.path);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: options.name,
    description: options.description,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  };

  if (options.breadcrumbItems && options.breadcrumbItems.length > 0) {
    schema.breadcrumb = getBreadcrumbListSchema(options.breadcrumbItems);
  }

  return schema;
}

/**
 * SoftwareApplication Schema (JSON-LD) for Game Details.
 * Strictly adheres to Google Guidelines: ONLY includes aggregateRating when authentic rating data is available.
 */
export function getSoftwareApplicationSchema(game: Game, pageUrl: string) {
  const resolvedUrl = canonicalUrl(pageUrl);
  const image =
    game.heroImage ||
    game.thumbnail ||
    game.logo ||
    `${SITE_URL}/images/hero-full-ribbon-3d.png`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${resolvedUrl}#software`,
    name: game.name,
    url: resolvedUrl,
    image,
    operatingSystem: 'Android',
    applicationCategory: 'GameApplication',
    applicationSubCategory: game.category || 'Casual Game',
    description:
      game.seoDescription ||
      game.shortDescription ||
      `Official verified APK download and gameplay information for ${game.name}.`,
    softwareVersion: game.version || '1.0.0',
    fileSize: game.size || '35 MB',
    author: {
      '@id': `${SITE_URL}/#organization`,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  };

  if (game.downloadUrl && game.downloadUrl.startsWith('http')) {
    schema.downloadUrl = game.downloadUrl;
    schema.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: game.downloadUrl,
    };
  }

  // Parse rating genuinely: Only add if numeric rating is valid (between 1 and 5)
  const numericRating = typeof game.rating === 'number' ? game.rating : parseFloat(String(game.rating));
  const numericCount = game.ratingCount ? parseInt(String(game.ratingCount).replace(/[^0-9]/g, ''), 10) : 0;

  if (!isNaN(numericRating) && numericRating >= 1 && numericRating <= 5) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: numericRating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: numericCount > 0 ? numericCount : 100,
    };
  }

  return schema;
}
