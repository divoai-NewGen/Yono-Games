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
  rating?: number;
  ratingCount?: string;
  players?: string;
  downloads?: string;
}

/**
 * Validates external download URLs strictly:
 * - Only HTTPS protocols permitted
 * - Prevents javascript:, data:, file:, relative or malformed URLs
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

  // Explicit safety checks
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
        error: 'Only secure HTTPS download URLs are permitted (e.g., https://example.com/app.apk).',
      };
    }
    return { isValid: true, normalizedUrl: parsed.toString() };
  } catch {
    return {
      isValid: false,
      normalizedUrl: null,
      error: 'Invalid URL format. Please provide a valid absolute HTTPS destination.',
    };
  }
}

/**
 * Generates clean, search-friendly slugs.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * High-Quality Auto-SEO Generation Engine
 * - Avoids repetitive "official developer" claims for third-party games.
 * - Produces unique, intent-matched meta titles and descriptions.
 * - Tailors game features and instructions to the actual category.
 * - Does not invent fabricated certificates or fake player statistics.
 */
export function generateAutoSeo(params: {
  name: string;
  category: string;
  bonus?: string;
  version?: string;
  size?: string;
  downloadUrl?: string | null;
  existingDescription?: string;
}): GeneratedSeoData {
  const {
    name,
    category,
    bonus,
    version = 'v5.1.0',
    size = '38.5 MB',
    downloadUrl = null,
    existingDescription,
  } = params;

  const currentYear = new Date().getFullYear();
  const slug = generateSlug(name);
  const cleanCategory = category || 'Yono Games';
  const hasDownload = Boolean(downloadUrl && typeof downloadUrl === 'string' && downloadUrl.startsWith('https://'));

  // 1. High-CTR, Intent-Matched SEO Meta Title (Under 60 chars optimal)
  // Varies naturally based on whether direct download or game guide is primary
  const seoTitle = hasDownload
    ? `${name} APK Download & Review (${currentYear}) | Yono Games`
    : `${name} Game Guide & APK Info (${currentYear}) | Yono Games`;

  // 2. High-Intent Meta Description (150-160 chars optimal, truthful without spam)
  const bonusSnippet = bonus && bonus.trim() ? ` ${bonus.trim()} details.` : '';
  const seoDescription = hasDownload
    ? `Download ${name} APK (${version}, ${size}). Read rules, gameplay features,${bonusSnippet} and mobile instructions on Real Yono Games.`
    : `Explore ${name} gameplay features, mobile overview (${version}, ${size}),${bonusSnippet} and guides on Real Yono Games.`;

  // 3. Relevant Search Keywords
  const keywords = [
    `${name.toLowerCase()} apk download`,
    `${name.toLowerCase()} game`,
    `${name.toLowerCase()} latest version`,
    `${name.toLowerCase()} android app`,
    `${name.toLowerCase()} review`,
    `yono games ${cleanCategory.toLowerCase()}`,
  ];

  // 4. Category-Tailored Tagline & Descriptions
  let tagline = `${name} Mobile Gaming Experience`;
  let shortDescription = `Explore ${name} — popular ${cleanCategory} title for Android mobile users with real-time gameplay and interactive rooms.`;
  let features = [
    'Smooth mobile-optimized interface with responsive touch controls',
    'Real-time multiplayer lobbies and casual practice rooms',
    'Round-the-clock technical platform support and active player community',
    'Compatible with Android smartphones and tablets',
  ];
  let howToPlay = [
    `Download and launch ${name} on your compatible mobile device`,
    'Complete the quick registration process to access the game lobby',
    'Choose your preferred table or room to begin participating',
    'Follow responsible play guidelines and enjoy tournament matches',
  ];

  if (cleanCategory.includes('Slot') || cleanCategory.includes('777')) {
    tagline = 'Dynamic Reel Action & Interactive Paylines';
    shortDescription = `Experience reel spinning in ${name} with vibrant audio-visual effects, varied paylines, and interactive bonus rounds.`;
    features = [
      'Multiple payline combinations and interactive bonus mini-games',
      'High-definition thematic artwork and immersive sound effects',
      'Quick-spin and auto-play options for customizable pacing',
      'Lightweight installation footprint with minimal battery consumption',
    ];
    howToPlay = [
      `Launch ${name} and navigate to the slot game room`,
      'Set your preferred stake and select active paylines',
      'Spin the reels to match symbol combinations across paylines',
      'Trigger scatter and bonus symbols for free spin rounds',
    ];
  } else if (cleanCategory.includes('Rummy') || cleanCategory.includes('Card')) {
    tagline = 'Classic 13-Card Indian Skill Rummy on Mobile';
    shortDescription = `Engage in 13-card Indian Rummy in ${name} with structured Points, Pool, and Deals format tables.`;
    features = [
      'Supports Points, Pool (101/201), and Deals game formats',
      'Automated card grouping and smart sequence sorting assistance',
      'Clear discard and draw deck tracking for strategic gameplay',
      'Smooth multiplayer tables designed for casual and competitive players',
    ];
    howToPlay = [
      `Enter ${name} and join your selected table room`,
      'Sort your dealt 13 cards into valid sets and sequences',
      'Draw one card per turn from the open or closed deck and discard one',
      'Make a valid declaration with minimal deadwood points',
    ];
  } else if (cleanCategory.includes('Crash') || cleanCategory.includes('Aviator')) {
    tagline = 'Multiplier Flight Action & Tactical Cashouts';
    shortDescription = `Watch the multiplier curve climb in ${name} and make strategic cashout decisions before the round ends.`;
    features = [
      'Rapid round cycles with live multiplier tracking',
      'Flexible betting interfaces supporting dual-action management',
      'Real-time in-game statistics and historical round review',
      'Clean mobile layout optimized for quick response times',
    ];
    howToPlay = [
      `Place your round entry before the countdown finishes in ${name}`,
      'Observe the rising multiplier value in real-time',
      'Trigger cashout at your chosen target multiplier level',
      'Review previous flight history to refine your play pacing',
    ];
  }

  // 5. Rich Long Description (Preserve admin's custom text if provided, otherwise create informative text)
  const description =
    existingDescription && existingDescription.trim().length > 60
      ? existingDescription.trim()
      : `${name} is an interactive mobile game designed for players who appreciate fast-paced ${cleanCategory} entertainment. Optimized for Android devices, the application provides a smooth interface, clear visual feedback, and reliable multiplayer connectivity.

Whether playing a quick round or participating in extended table sessions, ${name} emphasizes player clarity and straightforward controls. Detailed gameplay rules and operational specifications are listed above to help you get started safely and responsibly.`;

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
