import { Game } from '@/types/game';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GeneratedSeoData {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  tagline: string;
  shortDescription: string;
  description: string;
  features: string[];
  howToPlay: string[];
}

export interface ContentQualityDiagnostic {
  slug: string;
  name: string;
  issues: string[];
  /** true = page should be indexable; false = missing too much core content */
  isIndexable: boolean;
}

// ---------------------------------------------------------------------------
// URL Validation
// ---------------------------------------------------------------------------

/**
 * Validates external download URLs strictly.
 * Only HTTPS URLs are permitted.
 * Blocks javascript:, data:, file:, vbscript:, and relative paths.
 */
export function validateExternalDownloadUrl(url?: string | null): {
  isValid: boolean;
  normalizedUrl: string | null;
  error?: string;
} {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { isValid: true, normalizedUrl: null };
  }

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return {
      isValid: false,
      normalizedUrl: null,
      error: 'Unsafe URL scheme detected. Only secure HTTPS URLs are permitted.',
    };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return {
        isValid: false,
        normalizedUrl: null,
        error:
          'Only secure HTTPS download URLs are permitted (e.g., https://example.com/app.apk).',
      };
    }
    return { isValid: true, normalizedUrl: parsed.toString() };
  } catch {
    return {
      isValid: false,
      normalizedUrl: null,
      error:
        'Invalid URL format. Please provide a valid absolute HTTPS destination.',
    };
  }
}

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------

/**
 * Generates clean, search-friendly URL slugs.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------------------------------------------------------------------------
// Auto-SEO generation
// ---------------------------------------------------------------------------

/**
 * Generates SEO content for a new game record.
 *
 * Design principles enforced here:
 * - Does NOT invent statistics (ratings, download counts, player counts).
 * - Does NOT fabricate "official", "certified", or "verified" claims.
 * - Does NOT use a hardcoded year in every title; the year is only appended
 *   when the caller explicitly passes `includeYear: true` (e.g. for pages
 *   with genuinely current/maintained information).
 * - Uses version and size only when the caller supplies real values.
 * - Generates category-appropriate copy rather than one generic template.
 */
export function generateAutoSeo(params: {
  name: string;
  category: string;
  bonus?: string;
  version?: string;
  size?: string;
  downloadUrl?: string | null;
  existingDescription?: string;
  includeYear?: boolean;
}): GeneratedSeoData {
  const {
    name,
    category,
    bonus,
    version,
    size,
    downloadUrl = null,
    existingDescription,
    includeYear = false,
  } = params;

  const slug = generateSlug(name);
  const cleanCategory = (category || 'Mobile Game').trim();
  const hasDownload =
    typeof downloadUrl === 'string' && downloadUrl.startsWith('https://');

  const yearSuffix = includeYear ? ` (${new Date().getFullYear()})` : '';

  // ---- SEO Title ----
  // Pattern varies by whether a download link exists (action intent vs. info intent)
  const seoTitle = hasDownload
    ? `${name} – Download & Game Guide${yearSuffix}`
    : `${name} – Features & Game Guide${yearSuffix}`;

  // ---- SEO Description ----
  // Only include version/size when the caller provides real values.
  const versionPart = version ? ` Version: ${version}.` : '';
  const sizePart = size ? ` Size: ${size}.` : '';
  const bonusPart =
    bonus && bonus.trim() ? ` ${bonus.trim()}.` : '';

  const seoDescription = hasDownload
    ? `Download ${name} and read the full game guide.${versionPart}${sizePart}${bonusPart} Gameplay details and instructions on Real Yono Games.`
    : `Explore ${name} – ${cleanCategory} game for Android.${versionPart}${sizePart}${bonusPart} Game features and guides on Real Yono Games.`;

  // ---- Keywords ----
  const nameLower = name.toLowerCase();
  const keywords = [
    nameLower,
    `${nameLower} game`,
    `${nameLower} apk`,
    `${nameLower} guide`,
    `${nameLower} features`,
    `yono ${cleanCategory.toLowerCase()}`,
  ];

  // ---- Category-tailored content ----
  let tagline: string;
  let shortDescription: string;
  let features: string[];
  let howToPlay: string[];

  const catLower = cleanCategory.toLowerCase();

  if (catLower.includes('slot') || catLower.includes('777') || catLower.includes('spin')) {
    tagline = `${name} – Slot Game on Mobile`;
    shortDescription = `${name} is a slot-style mobile game with reel mechanics and various payline configurations, designed for Android.`;
    features = [
      'Multiple payline configurations',
      'Bonus round mechanics',
      'Mobile-optimised interface',
      'Compatible with Android smartphones',
    ];
    howToPlay = [
      `Open ${name} and navigate to the game lobby`,
      'Set your preferred stake per round',
      'Spin the reels and match symbol combinations',
      'Bonus symbols may trigger additional rounds — see in-game rules for details',
    ];
  } else if (catLower.includes('rummy') || catLower.includes('card')) {
    tagline = `${name} – Card Game on Mobile`;
    shortDescription = `${name} is a card game for Android offering structured table formats. Read gameplay rules and instructions before playing.`;
    features = [
      'Multiple game format options',
      'Organised table rooms',
      'Multiplayer support',
      'Android compatible',
    ];
    howToPlay = [
      `Open ${name} and select your preferred table`,
      'Arrange your cards into valid sets and sequences',
      'Draw and discard one card per turn',
      'Declare when you have a valid hand — consult in-game rules for scoring details',
    ];
  } else if (catLower.includes('crash') || catLower.includes('aviator')) {
    tagline = `${name} – Multiplier Game on Mobile`;
    shortDescription = `${name} is a multiplier-style mobile game. Follow the in-game instructions and guidelines before participating.`;
    features = [
      'Live multiplier tracking',
      'Multiple round cycles',
      'Mobile-friendly layout',
      'Android compatible',
    ];
    howToPlay = [
      `Open ${name} and review the in-game instructions`,
      'Place your entry before the countdown ends',
      'Watch the multiplier rise in real time',
      'Act before the round concludes — see in-game rules for exact mechanics',
    ];
  } else if (catLower.includes('teen patti') || catLower.includes('patti')) {
    tagline = `${name} – Teen Patti on Mobile`;
    shortDescription = `${name} is a three-card mobile game based on Teen Patti. Read the in-game rules before participating.`;
    features = [
      'Classic three-card gameplay',
      'Multiple table variations',
      'Multiplayer rooms',
      'Android compatible',
    ];
    howToPlay = [
      `Launch ${name} and choose your table`,
      'Place your initial entry per the table minimums',
      'Choose to see or blind-play your round',
      'Best three-card hand wins — full rules available in-app',
    ];
  } else if (catLower.includes('ludo') || catLower.includes('board')) {
    tagline = `${name} – Board Game on Mobile`;
    shortDescription = `${name} is a mobile board game. Review the in-game rules and guidelines before playing.`;
    features = [
      'Classic board game mechanics',
      'Multiplayer support',
      'Simple controls',
      'Android compatible',
    ];
    howToPlay = [
      `Open ${name} and join a game room`,
      'Roll dice to advance your pieces',
      'Strategically block opponents and protect your own pieces',
      'First player to complete the course wins — see in-game rules for full details',
    ];
  } else {
    // Generic fallback for "Other Best Games" and uncategorised
    tagline = `${name} – Mobile Game`;
    shortDescription = `${name} is a mobile game for Android. See the features and in-game instructions for details before playing.`;
    features = [
      'Mobile-optimised interface',
      'Multiplayer or single-player support',
      'Android compatible',
      'In-game instructions available',
    ];
    howToPlay = [
      `Install ${name} on your Android device`,
      'Open the app and review the tutorial or instructions',
      'Choose your game mode or room',
      'Follow the in-game guidance to participate',
    ];
  }

  // ---- Full description ----
  // Re-use admin's custom text if it is substantive (>80 chars).
  const description =
    existingDescription && existingDescription.trim().length > 80
      ? existingDescription.trim()
      : `${name} is a ${cleanCategory} mobile game designed for Android devices. The application offers ${features[0].toLowerCase()} and ${features[1].toLowerCase()}.\n\nReview the full feature list and instructions above before downloading or playing. Always follow responsible gaming guidelines.`;

  return {
    slug,
    seoTitle,
    seoDescription,
    keywords,
    tagline,
    shortDescription,
    description,
    features,
    howToPlay,
  };
}

// ---------------------------------------------------------------------------
// Content Quality Diagnostic
// ---------------------------------------------------------------------------

/**
 * Analyses a Game record and returns a list of content quality issues.
 *
 * A game is considered indexable when it has:
 * - A name and slug
 * - A meaningful description (>60 chars)
 * - At least one image (logo, thumbnail, or heroImage)
 * - A valid category
 *
 * Pages that fail the indexability check should be served with
 * `robots: { index: false }` until the missing fields are filled.
 */
export function diagnoseGameContent(game: Game): ContentQualityDiagnostic {
  const issues: string[] = [];

  if (!game.name?.trim()) issues.push('Missing: game name');
  if (!game.slug?.trim()) issues.push('Missing: URL slug');
  if (!game.category?.trim()) issues.push('Missing: category');

  const descLength = (game.description || game.shortDescription || '').trim().length;
  if (descLength < 60) {
    issues.push(
      `Thin content: description is only ${descLength} characters (minimum 60 recommended)`
    );
  }

  if (!game.logo && !game.thumbnail && !game.heroImage) {
    issues.push('Missing: at least one game image (logo, thumbnail, or heroImage)');
  }

  if (!game.seoTitle?.trim()) {
    issues.push('Missing: seoTitle (auto-generated fallback will be used)');
  } else if (game.seoTitle.length > 70) {
    issues.push(
      `seoTitle is ${game.seoTitle.length} characters — consider keeping it under 60`
    );
  }

  if (!game.seoDescription?.trim()) {
    issues.push('Missing: seoDescription (auto-generated fallback will be used)');
  } else if (game.seoDescription.length > 165) {
    issues.push(
      `seoDescription is ${game.seoDescription.length} characters — consider keeping it under 160`
    );
  }

  if (game.downloadUrl) {
    const validation = validateExternalDownloadUrl(game.downloadUrl);
    if (!validation.isValid) {
      issues.push(`Invalid downloadUrl: ${validation.error}`);
    }
  }

  // A page is indexable if it has the four core fields with meaningful content
  const isIndexable =
    !!game.name?.trim() &&
    !!game.slug?.trim() &&
    !!game.category?.trim() &&
    descLength >= 60 &&
    !!(game.logo || game.thumbnail || game.heroImage);

  return {
    slug: game.slug || '',
    name: game.name || '',
    issues,
    isIndexable,
  };
}
