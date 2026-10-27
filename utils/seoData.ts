import { MetadataOptions } from './seo';
import { Game } from '@/types/game';

// ---------------------------------------------------------------------------
// Static page SEO definitions
// ---------------------------------------------------------------------------

export const STATIC_PAGE_SEO: Record<string, MetadataOptions> = {
  home: {
    title: {
      default: 'Yono Games – Games Directory & Guides | Real Yono Games',
      template: '%s | Real Yono Games',
    },
    description:
      'Discover Yono games, card games, slots, and mobile titles on Real Yono Games. Browse the directory, read game guides, and find APK information.',
    path: '',
    keywords: [
      'yono games',
      'all yono games',
      'new yono games',
      'yono game directory',
      'yono rummy',
      'yono slots',
      'yono 777',
      'teen patti yono',
    ],
  },

  games: {
    title: 'All Yono Games – Browse Games & Guides | Real Yono Games',
    description:
      'Browse the complete directory of Yono mobile games. Find game guides, APK information, features, and version details for Yono Rummy, Teen Patti, Aviator, and more.',
    path: 'games',
    keywords: [
      'all yono games',
      'yono games list',
      'yono apk',
      'yono games catalog',
      'yono android games',
      'new yono apps',
    ],
  },

  contactUs: {
    title: 'Contact Us – Support & Enquiries | Real Yono Games',
    description:
      'Get in touch with Real Yono Games for game inquiries, technical support, or partnership queries.',
    path: 'contact-us',
  },

  privacyPolicy: {
    title: 'Privacy Policy | Real Yono Games',
    description:
      'Read the Privacy Policy of Real Yono Games. Understand how user information is handled and what privacy protections apply.',
    path: 'privacy-policy',
  },

  disclaimer: {
    title: 'Disclaimer & Responsible Gaming Notice | Real Yono Games',
    description:
      'Review legal disclaimers, platform notices, and responsible gaming guidelines for visitors of Real Yono Games.',
    path: 'disclaimer',
  },

  notFound: {
    title: 'Page Not Found | Real Yono Games',
    description:
      'The requested page or game could not be found. Browse the games directory to discover available titles.',
    noindex: true,
  },
};

// ---------------------------------------------------------------------------
// Per-game SEO data builder
// ---------------------------------------------------------------------------

/**
 * Builds SEO metadata for an individual game page.
 *
 * Rules:
 * - Uses the game's own seoTitle/seoDescription when present and non-empty.
 * - Strips any trailing " | Real Yono Games" or " | Yono Games" to avoid double-suffixing
 *   (Next.js title template appends it automatically on child pages).
 * - Does NOT include the year unless it is embedded in the stored seoTitle.
 * - Does NOT claim "official" or "verified" for third-party APK links.
 * - Falls back to a useful, accurate description derived from visible game fields.
 */
export function getGameSeoData(game: Game): MetadataOptions {
  // ---- Title ----
  let rawTitle = game.seoTitle?.trim();

  if (!rawTitle) {
    // Construct a descriptive, intent-matched fallback title.
    // Pattern: "[Game Name] – Features, Version & Guide | Real Yono Games"
    rawTitle = `${game.name.trim()} – Features, Version & Guide`;
  }

  // Remove any trailing site-name suffix that would produce a duplicate
  // once Next.js appends the template " | Real Yono Games".
  rawTitle = rawTitle
    .replace(/\s*\|\s*Real Yono Games\s*$/i, '')
    .replace(/\s*\|\s*Yono Games\s*$/i, '')
    .trim();

  // ---- Description ----
  let description = game.seoDescription?.trim();

  if (!description) {
    // Build a factual, unique description from available game fields.
    const versionPart = game.version ? ` Version ${game.version}` : '';
    const sizePart = game.size ? `, ${game.size}` : '';
    const catPart = game.category ? ` ${game.category} title` : '';

    description =
      game.shortDescription?.trim() ||
      `${game.name} is a${catPart} for Android mobile.${versionPart}${sizePart}. Read the full guide, features, and gameplay details on Real Yono Games.`;
  }

  // ---- OG Image ----
  const image =
    game.heroImage || game.thumbnail || game.logo || undefined;

  // ---- Keywords ----
  // Keep tight and intent-relevant. Avoid keyword spam.
  const nameLower = game.name.toLowerCase().trim();
  const keywords = [
    nameLower,
    `${nameLower} game`,
    `${nameLower} apk`,
    `${nameLower} features`,
    `${nameLower} guide`,
  ];

  if (game.category) {
    keywords.push(`yono ${game.category.toLowerCase()}`);
  }

  return {
    title: rawTitle,
    description,
    path: `games/${game.slug}`,
    image,
    imageAlt: `${game.name} game artwork`,
    keywords,
  };
}
