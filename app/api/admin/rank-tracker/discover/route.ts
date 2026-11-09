import { NextRequest, NextResponse } from 'next/server';

/**
 * Common stop words to exclude from extracted keywords
 */
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'about', 'from', 'this', 'that', 'your', 'have',
  'are', 'was', 'not', 'you', 'all', 'any', 'can', 'our', 'more', 'what',
  'which', 'their', 'has', 'will', 'been', 'its', 'out', 'into', 'who', 'how',
  'when', 'where', 'why', 'also', 'some', 'than', 'them', 'then', 'they',
  'were', 'does', 'such', 'like', 'just', 'over', 'page', 'site', 'website',
  'home', 'privacy', 'policy', 'terms', 'contact', 'disclaimer', 'copyright',
  'rights', 'reserved', 'click', 'here', 'read', 'view', 'more', 'menu', 'navigation'
]);

/**
 * Normalizes input URL so it is valid for fetching
 */
function prepareUrl(raw: string): string {
  let url = raw.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

/**
 * Clean text from HTML string
 */
function cleanText(html: string): string {
  return html
    .replace(/<script\b[^>-]*>([\s\S]*?)<\/script>/gi, ' ')
    .replace(/<style\b[^>-]*>([\s\S]*?)<\/style>/gi, ' ')
    .replace(/<noscript\b[^>-]*>([\s\S]*?)<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts high-value SEO keywords, keyphrases, and competitor terms from target HTML
 */
function extractSeoKeywords(html: string, hostname: string): string[] {
  const candidates: { phrase: string; weight: number }[] = [];

  // 1. Extract <title>
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : '';

  // 2. Extract <meta name="keywords" ...>
  const metaKeywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']keywords["']/i);
  const metaKeywords = metaKeywordsMatch ? metaKeywordsMatch[1].split(',').map((k) => k.trim()) : [];

  // 3. Extract <meta name="description" ...>
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

  // 4. Extract H1, H2 tags
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => cleanText(m[1]));
  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => cleanText(m[1]));

  // Add explicit meta keywords with high weight
  for (const kw of metaKeywords) {
    if (kw.length >= 3 && kw.length <= 40) {
      candidates.push({ phrase: kw.toLowerCase(), weight: 10 });
    }
  }

  // Segment Title into phrases
  if (titleText) {
    const parts = titleText.split(/[-|–—:•]/).map((p) => p.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.length >= 4 && part.length <= 40) {
        candidates.push({ phrase: part.toLowerCase(), weight: 9 });
      }
    }
  }

  // Add H1 phrases
  for (const h1 of h1Matches) {
    if (h1.length >= 4 && h1.length <= 45) {
      candidates.push({ phrase: h1.toLowerCase(), weight: 8 });
    }
  }

  // Add H2 phrases
  for (const h2 of h2Matches.slice(0, 8)) {
    if (h2.length >= 4 && h2.length <= 45) {
      candidates.push({ phrase: h2.toLowerCase(), weight: 6 });
    }
  }

  // Derive high-intent gaming phrases if hostname indicates brand
  const brandName = hostname.replace(/^www\./, '').split('.')[0].replace(/[-_]/g, ' ');
  if (brandName.length >= 3) {
    candidates.push({ phrase: `${brandName} apk download`, weight: 9 });
    candidates.push({ phrase: `${brandName} app`, weight: 8 });
    candidates.push({ phrase: `${brandName} game`, weight: 8 });
  }

  // Extract recurring 2-word and 3-word n-grams from title + metaDesc + headers
  const seedText = `${titleText} ${metaDesc} ${h1Matches.join(' ')} ${h2Matches.join(' ')}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ');

  const words = seedText
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const phraseFrequency: Record<string, number> = {};

  // 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    const p = `${words[i]} ${words[i + 1]}`;
    phraseFrequency[p] = (phraseFrequency[p] || 0) + 1;
  }

  // 3-word phrases
  for (let i = 0; i < words.length - 2; i++) {
    const p = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    phraseFrequency[p] = (phraseFrequency[p] || 0) + 1;
  }

  for (const [p, count] of Object.entries(phraseFrequency)) {
    if (count >= 2) {
      candidates.push({ phrase: p, weight: 4 + count });
    }
  }

  // Deduplicate and aggregate scores
  const scoreMap = new Map<string, number>();
  for (const item of candidates) {
    const clean = item.phrase
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean || clean.length < 3 || clean.split(' ').length > 6) continue;
    if (STOP_WORDS.has(clean)) continue;

    scoreMap.set(clean, (scoreMap.get(clean) || 0) + item.weight);
  }

  // Sort by highest relevance score
  const sorted = Array.from(scoreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0]);

  // Return top 10 - 15 curated keywords
  return sorted.slice(0, 12);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.url) {
      return NextResponse.json({ error: 'Target website URL is required' }, { status: 400 });
    }

    const fullUrl = prepareUrl(body.url);
    const parsed = new URL(fullUrl);
    const hostname = parsed.hostname;

    // Fetch homepage content with timeout and modern user-agent
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let html = '';
    try {
      const res = await fetch(fullUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
        cache: 'no-store',
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: `Target website returned HTTP status ${res.status}` },
          { status: 502 }
        );
      }

      html = await res.text();
    } catch (err: unknown) {
      const isAbort = err instanceof Error && err.name === 'AbortError';
      return NextResponse.json(
        { error: isAbort ? 'Timed out fetching target website' : 'Could not connect to target website' },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeout);
    }

    const keywords = extractSeoKeywords(html, hostname);

    if (keywords.length === 0) {
      // Fallback sensible defaults based on domain
      const rootDomain = hostname.replace(/^www\./, '').split('.')[0];
      return NextResponse.json({
        success: true,
        targetDomain: hostname,
        keywords: [
          `${rootDomain} apk download`,
          `${rootDomain} app`,
          `${rootDomain} login`,
          `${rootDomain} games`,
          `${rootDomain} official`,
        ],
        source: 'fallback',
      });
    }

    return NextResponse.json({
      success: true,
      targetDomain: hostname,
      keywords,
      count: keywords.length,
      source: 'on-page-analysis',
    });
  } catch (error: unknown) {
    console.error('Discover keywords error:', error);
    const msg = error instanceof Error ? error.message : 'Keyword discovery failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

