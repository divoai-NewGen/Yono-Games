import { SITE_URL, SITE_NAME, canonicalUrl } from './seo';
import { Game } from '@/types/game';

// ---------------------------------------------------------------------------
// Safety helpers
// ---------------------------------------------------------------------------

/**
 * Escapes a string for safe embedding in JSON-LD.
 * JSON.stringify already handles most escaping; this additionally prevents
 * </script> injection within the ld+json block.
 */
function safeStr(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/<\/script>/gi, '<\\/script>');
}

// ---------------------------------------------------------------------------
// Organization Schema
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// WebSite Schema
// ---------------------------------------------------------------------------

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description:
      'Gaming directory and guide platform for mobile games, APK information, and player resources.',
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

// ---------------------------------------------------------------------------
// BreadcrumbList Schema
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: safeStr(item.name),
      item: canonicalUrl(item.url),
    })),
  };
}

// ---------------------------------------------------------------------------
// WebPage Schema
// ---------------------------------------------------------------------------

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
    name: safeStr(options.name),
    description: safeStr(options.description),
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  };

  if (options.breadcrumbItems && options.breadcrumbItems.length > 0) {
    schema.breadcrumb = getBreadcrumbListSchema(options.breadcrumbItems);
  }

  return schema;
}

// ---------------------------------------------------------------------------
// SoftwareApplication Schema
// ---------------------------------------------------------------------------

/**
 * SoftwareApplication JSON-LD for game detail pages.
 *
 * Compliance rules:
 * - Does NOT claim this directory is the author/developer of third-party apps.
 * - Only includes aggregateRating with authentic numeric values.
 * - Only adds Offer/downloadUrl for verified HTTPS links.
 * - Does not fabricate certifications, prices, or publisher identities.
 * - Matches schema properties to visible page content.
 */
export function getSoftwareApplicationSchema(game: Game, pageUrl: string) {
  const resolvedUrl = canonicalUrl(pageUrl);

  const imageUrl =
    game.heroImage ||
    game.thumbnail ||
    game.logo ||
    `${SITE_URL}/images/hero-full-ribbon-3d.png`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${resolvedUrl}#software`,
    name: safeStr(game.name),
    url: resolvedUrl,
    image: imageUrl,
    operatingSystem: 'Android',
    applicationCategory: 'GameApplication',
    applicationSubCategory: safeStr(game.category || 'Casual Game'),
    description: safeStr(
      game.seoDescription ||
        game.shortDescription ||
        `Gameplay information and guide for ${game.name}.`
    ),
  };

  // Only include version/size when a real value is present
  if (game.version) schema.softwareVersion = safeStr(game.version);
  if (game.size) schema.fileSize = safeStr(game.size);

  // Download offer — only when a verified HTTPS link exists
  if (
    game.downloadUrl &&
    typeof game.downloadUrl === 'string' &&
    game.downloadUrl.startsWith('https://')
  ) {
    schema.downloadUrl = game.downloadUrl;
    schema.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: game.downloadUrl,
    };
  }

  // AggregateRating — only when rating is a valid 1–5 number AND ratingCount parses to >0
  const numericRating =
    typeof game.rating === 'number'
      ? game.rating
      : parseFloat(String(game.rating));
  const countStr = typeof game.ratingCount === 'string' ? game.ratingCount : '';
  const numericCount = parseInt(countStr.replace(/[^0-9]/g, ''), 10);

  if (
    !isNaN(numericRating) &&
    numericRating >= 1 &&
    numericRating <= 5 &&
    numericCount > 0
  ) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: numericRating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: numericCount,
    };
  }

  return schema;
}

// ---------------------------------------------------------------------------
// FAQPage Schema
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQPage JSON-LD.
 * Only use when the FAQ questions and answers are genuinely visible on the page.
 * Do not promise Google that this will generate a rich result.
 */
export function getFaqPageSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: safeStr(faq.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: safeStr(faq.answer),
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// HowTo Schema
// ---------------------------------------------------------------------------

export interface HowToStep {
  name: string;
  text: string;
}

/**
 * HowTo JSON-LD for installation guides or structured gameplay instructions.
 * Only use when step-by-step instructions are genuinely visible on the page.
 */
export function getHowToSchema(options: {
  name: string;
  description: string;
  steps: HowToStep[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: safeStr(options.name),
    description: safeStr(options.description),
    step: options.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: safeStr(step.name),
      text: safeStr(step.text),
    })),
  };
}

// ---------------------------------------------------------------------------
// ItemList Schema (for category/directory pages)
// ---------------------------------------------------------------------------

export interface GameListItem {
  name: string;
  slug: string;
  description?: string;
}

/**
 * ItemList JSON-LD for game directory or category listing pages.
 */
export function getGameListSchema(
  games: GameListItem[],
  listName: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: safeStr(listName),
    itemListElement: games.slice(0, 50).map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: canonicalUrl(`games/${game.slug}`),
      name: safeStr(game.name),
    })),
  };
}
