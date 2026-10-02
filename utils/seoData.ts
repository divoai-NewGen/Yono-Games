import { MetadataOptions } from './seo';
import { Game } from '@/types/game';

export const STATIC_PAGE_SEO: Record<string, MetadataOptions> = {
  home: {
    title: {
      default: 'Real Yono Games | Verified Yono Games & APK Directory',
      template: '%s | Real Yono Games',
    },
    description:
      'Explore official and verified Yono games, arcade releases, card games, and mobile titles. Download authentic APKs, discover game guides, and access player resources.',
    path: '',
    keywords: [
      'Real Yono Games',
      'Yono Games Directory',
      'Yono APK Download',
      'Yono Rummy',
      'Yono 777',
      'Yono Slots',
      'Teen Patti Yono',
      'Verified Gaming Platform',
    ],
  },
  games: {
    title: 'Games Catalog - Browse & Download Verified Games',
    description:
      'Browse the complete library of verified mobile games on Real Yono Games. Find official APKs for Yono 777, Yono Rummy, Teen Patti, Aviator, and top card games.',
    path: 'games',
    keywords: [
      'Yono Games List',
      'Download Yono Games',
      'All Yono Games APK',
      'Yono Games Catalog',
      'Yono Android Games',
    ],
  },
  contactUs: {
    title: 'Contact Us - Player & Technical Support',
    description:
      'Get in touch with the Real Yono Games support team for inquiries, game assistance, technical support, or partnership queries.',
    path: 'contact-us',
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    description:
      'Read the official Privacy Policy of Real Yono Games. Understand how user information, privacy standards, and data security are maintained.',
    path: 'privacy-policy',
  },
  disclaimer: {
    title: 'Disclaimer & Responsible Gaming Notice',
    description:
      'Review the legal disclaimer, platform notices, and responsible gaming guidelines for visitors of Real Yono Games.',
    path: 'disclaimer',
  },
  notFound: {
    title: 'Page Not Found',
    description:
      'The requested page or game could not be found. Browse our verified games catalog to discover your next favorite title.',
    noindex: true,
  },
};

/**
 * Extracts clean, high-intent SEO metadata options from a Game model.
 */
export function getGameSeoData(game: Game): MetadataOptions {
  const currentYear = new Date().getFullYear();

  // Strip duplicate suffix if already present in database
  let rawTitle = game.seoTitle?.trim() || `${game.name} APK Download (Official ${currentYear})`;
  rawTitle = rawTitle.replace(/\s*\|\s*Real Yono Games$/i, '').replace(/\s*\|\s*Yono Games$/i, '');

  const title = rawTitle;

  const description =
    game.seoDescription?.trim() ||
    game.shortDescription?.trim() ||
    `Download official ${game.name} APK (${game.version || 'Latest Version'}, ${game.size || 'Android'}). Verified fair play, instant rewards, and gameplay guides on Real Yono Games.`;

  const image =
    game.heroImage ||
    game.thumbnail ||
    game.logo ||
    '/images/hero-full-ribbon-3d.png';

  const keywords = [
    `${game.name.toLowerCase()} apk download`,
    `${game.name.toLowerCase()} official`,
    `${game.name.toLowerCase()} latest version`,
    `yono games ${game.category?.toLowerCase() || ''}`.trim(),
    'verified yono game',
  ];

  return {
    title,
    description,
    path: `games/${game.slug}`,
    image,
    imageAlt: `${game.name} - Official Game Artwork`,
    keywords,
  };
}
