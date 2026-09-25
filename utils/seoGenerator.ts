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
  rating: number;
  ratingCount: string;
  players: string;
  downloads: string;
  schemaJsonLd: object;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateAutoSeo(params: {
  name: string;
  category: string;
  bonus?: string;
  version?: string;
  size?: string;
  downloadUrl?: string | null;
  existingDescription?: string;
}): GeneratedSeoData {
  const { name, category, bonus = '₹1,000 Welcome Bonus', version = 'v5.1.0', size = '38.5 MB', downloadUrl = null } = params;
  const currentYear = new Date().getFullYear();
  const slug = generateSlug(name);

  // 1. High-CTR SEO Meta Title (Under 60 chars optimal)
  const seoTitle = `${name} APK Download (Official ${currentYear}) - Free Bonus | Yono Games`;

  // 2. High-Intent Meta Description (150-160 chars optimal)
  const seoDescription = `Download ${name} official APK (${version}, ${size}). Enjoy ${bonus}, instant UPI withdrawals, and certified fair play on Yono Games.`;

  // 3. High-Traffic Search Keywords
  const keywords = [
    `${name.toLowerCase()} apk download`,
    `${name.toLowerCase()} latest version`,
    `${name.toLowerCase()} app login`,
    `${name.toLowerCase()} real cash game`,
    `download ${slug} official`,
    `yono games ${category.toLowerCase()}`,
    `${name.toLowerCase()} bonus code`,
    `best ${category.toLowerCase()} apps in india`
  ];

  // 4. Dynamic Tagline & Short Description based on category
  let tagline = 'Experience Premium Online Gaming with Instant Rewards';
  let shortDescription = `Play ${name} on India's favourite platform with real-time multiplayer action, certified fair play, and instant withdrawals.`;
  let features = [
    'Certified Random Number Generator (RNG) fair play standard',
    'Instant withdrawal processing with round-the-clock support',
    'Daily login rewards and exclusive VIP loyalty perks',
    'High-speed server matchmaking with zero latency'
  ];
  let howToPlay = [
    `Download and install the official ${name} APK on your Android device`,
    'Complete the one-click registration and claim your welcome bonus',
    'Choose your preferred table or room and place your bets',
    'Withdraw your tournament winnings instantly to your UPI or Bank account'
  ];

  if (category.includes('Slot') || category.includes('777')) {
    tagline = 'Spin Dynamic Golden Reels & Win Progressive Jackpots';
    shortDescription = `Spin the golden reels on ${name} with multi-line bonuses, high RTP payout rates, and thrilling jackpot rounds.`;
    features = [
      'Multi-tier progressive jackpot prize pools with massive multipliers',
      'Certified 98.2% Return to Player (RTP) verified RNG engine',
      'Free spin triggers and scatter bonus mini-games',
      'Lightning-fast deposits and instant withdrawals via UPI/IMPS'
    ];
    howToPlay = [
      `Download and launch the ${name} app on your smartphone`,
      'Select your bet multiplier and choose active paylines',
      'Press Spin to activate winning reel combinations',
      'Hit scatter symbols to enter free bonus rounds and jackpot tiers'
    ];
  } else if (category.includes('Rummy') || category.includes('Card')) {
    tagline = 'The Gold Standard of 13-Card Indian Skill Rummy';
    shortDescription = `Master 13-card Indian Rummy in ${name} across Points, Pool, and Deals tournaments with real cash prizes.`;
    features = [
      'Points, Pool (101/201), and Deals Rummy table variations',
      'Strict anti-collusion fraud detection and RNG-certified shuffles',
      'Weekly mega leaderboards with guaranteed cash prize pools',
      'Direct 60-second withdrawal approval to verified UPI IDs'
    ];
    howToPlay = [
      `Install ${name} and join a 2-player or 6-player table`,
      'Sort your 13 cards into valid sequences and sets',
      'Pick from open/closed deck and discard unwanted cards each turn',
      'Declare your hand with 0 points to win the cash pool'
    ];
  } else if (category.includes('Crash') || category.includes('Aviator') || category.includes('Arcade')) {
    tagline = 'High-Altitude Multiplier Action with Instant Cashouts';
    shortDescription = `Watch the multiplier soar in ${name} and cash out before the crash to win up to 100x your stake.`;
    features = [
      'Provably Fair cryptographic algorithm for every flight round',
      'Dual-bet simultaneous placement for flexible risk management',
      'Auto-cashout triggers from 1.1x to 100x multipliers',
      'Live social multiplayer bets and community leaderboard'
    ];
    howToPlay = [
      `Place your single or dual bets before each ${name} flight starts`,
      'Watch the multiplier rocket increase from 1.00x upwards',
      'Click Cash Out before the flight flies away to lock in profits',
      'Utilize Auto-Cashout settings for disciplined bankroll management'
    ];
  } else if (category.includes('Board') || category.includes('Ludo')) {
    tagline = 'Classic Multiplayer Board Battles with Real Competition';
    shortDescription = `Roll the dice and race your tokens to the home triangle in ${name} with 2-4 player competitive battles.`;
    features = [
      'Fast-paced 8-minute speed timer and classic 4-token modes',
      'Certified cryptographic dice rolls with 100% fair randomness',
      'Play against real verified players across India, no bots',
      'Instant rupee payouts to UPI, Paytm, and bank accounts'
    ];
    howToPlay = [
      `Download the official ${name} APK and enter a contest room`,
      'Roll a 6 to release your token from the starting base',
      'Navigate the track while capturing opponents for bonus moves',
      'Reach the home triangle first with all tokens to claim the prize'
    ];
  } else if (category.includes('Other') || category.includes('Best')) {
    tagline = 'Top-Rated Trending Games with Exclusive Rewards';
    shortDescription = `Experience ${name} — one of India's top trending gaming releases with instant withdrawals, high win rates, and daily bonuses.`;
    features = [
      'Trending gameplay mechanics with certified high win rates',
      'Certified Random Number Generator (RNG) fair play standard',
      'Instant 60-second UPI and IMPS direct cashouts',
      'Daily login rewards and VIP loyalty cashback perks'
    ];
    howToPlay = [
      `Download and launch the official ${name} APK on your smartphone`,
      'Register with your mobile number to claim your welcome bonus',
      'Choose your preferred table or game mode to start playing',
      'Withdraw your game winnings directly to your UPI ID or Bank account'
    ];
  }

  // 5. Rich Long Description
  const description = `${name} is one of India's premier digital gaming titles, engineered specifically for high-performance mobile devices. Featuring state-of-the-art graphics, certified Random Number Generator (RNG) algorithms, and bank-grade security protocols, the application delivers an authentic tournament experience right at your fingertips.

Whether you are a casual enthusiast or a competitive player, ${name} offers seamless matchmaking, real-time multiplayer rooms, and round-the-clock customer assistance. Download the latest official APK today to enjoy ${bonus}, ultra-fast UPI withdrawals, and guaranteed fair play.`;

  // 6. Google JSON-LD Rich Snippet Schema for SoftwareApplication / MobileApplication
  const schemaJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    operatingSystem: 'Android 6.0+',
    applicationCategory: 'GameApplication',
    applicationSubCategory: category,
    ...(downloadUrl ? { downloadUrl } : {}),
    softwareVersion: version,
    fileSize: size,
    ...(downloadUrl
      ? {
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: downloadUrl,
          },
        }
      : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '24850',
    },
    author: {
      '@type': 'Organization',
      name: 'Yono Games',
      url: 'https://realyonogame.com',
    },
    description: seoDescription,
  };

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
    rating: 4.8,
    ratingCount: '24.8K reviews',
    players: '28,000+ Online',
    downloads: '1.2M+ Downloads',
    schemaJsonLd,
  };
}
