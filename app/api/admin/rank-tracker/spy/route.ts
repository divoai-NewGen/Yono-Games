import { NextRequest, NextResponse } from 'next/server';

export interface CompetitorKeyword {
  keyword: string;
  category: 'High Intent' | 'High Volume' | 'Brand / Money' | 'Long Tail';
  intent: 'Download' | 'Bonus / Money' | 'Game App' | 'Informational';
  source: string; // where it was found (Title, H1, Meta, Game List)
  suggestedTitle: string;
  suggestedMetaDesc: string;
}

// Gaming intent trigger words that rank high on Google India
const INTENT_TRIGGERS = [
  'apk download',
  'apk',
  'app download',
  'app',
  'rummy',
  'bonus 51',
  'bonus',
  '51 bonus',
  'all yono games',
  'yono games',
  'yono game',
  'all yono',
  'new yono',
  'teen patti',
  'dragon vs tiger',
  'aviator',
  'withdrawal',
  'login',
  'real cash',
  'mod apk',
  'free bonus',
  'list 2026',
  'list 2025',
  'vip',
  'official'
];

function cleanHtmlText(text: string): string {
  return text
    .replace(/<script\b[^>-]*>([\s\S]*?)<\/script>/gi, ' ')
    .replace(/<style\b[^>-]*>([\s\S]*?)<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function classifyKeyword(kw: string): { category: CompetitorKeyword['category']; intent: CompetitorKeyword['intent'] } {
  const lower = kw.toLowerCase();
  if (lower.includes('download') || lower.includes('apk') || lower.includes('app')) {
    return { category: 'High Intent', intent: 'Download' };
  }
  if (lower.includes('bonus') || lower.includes('cash') || lower.includes('withdrawal')) {
    return { category: 'Brand / Money', intent: 'Bonus / Money' };
  }
  if (lower.includes('rummy') || lower.includes('teen patti') || lower.includes('aviator') || lower.includes('dragon')) {
    return { category: 'High Volume', intent: 'Game App' };
  }
  return { category: 'Long Tail', intent: 'Informational' };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.url) {
      return NextResponse.json({ error: 'Competitor URL is required' }, { status: 400 });
    }

    let targetUrl = body.url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: 'Please enter a valid website URL' }, { status: 400 });
    }

    const domainName = parsed.hostname.replace(/^www\./, '').split('.')[0].replace(/[-_]/g, ' ');

    // Fetch competitor page with modern headers & timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let html = '';
    try {
      const res = await fetch(targetUrl, {
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
          { error: `Competitor site returned HTTP status ${res.status}` },
          { status: 502 }
        );
      }
      html = await res.text();
    } catch (fetchErr: unknown) {
      const isAbort = fetchErr instanceof Error && fetchErr.name === 'AbortError';
      return NextResponse.json(
        { error: isAbort ? 'Timed out fetching competitor website' : 'Could not connect to competitor website' },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeout);
    }

    // Extract on-page elements
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const metaDescMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

    const metaKeywordsMatch =
      html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']keywords["']/i);
    const metaKeywords = metaKeywordsMatch
      ? metaKeywordsMatch[1].split(',').map((k) => k.trim()).filter(Boolean)
      : [];

    const h1List = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => cleanHtmlText(m[1]));
    const h2List = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => cleanHtmlText(m[1]));
    const linksText = [...html.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)]
      .map((m) => cleanHtmlText(m[1]))
      .filter((t) => t.length >= 4 && t.length <= 40);

    // Candidates pool
    const rawCandidates: { phrase: string; source: string }[] = [];

    // 1. Meta keywords
    for (const kw of metaKeywords) {
      rawCandidates.push({ phrase: kw, source: 'Meta Keywords' });
    }

    // 2. Title and Description segments
    if (title) {
      const parts = title.split(/[-|–—:•,]/).map((p) => p.trim()).filter(Boolean);
      for (const part of parts) {
        if (part.length >= 4 && part.length <= 40) {
          rawCandidates.push({ phrase: part, source: 'Page Title' });
        }
      }
    }
    if (metaDesc) {
      const descParts = metaDesc.split(/[-|–—:•,.]/).map((p) => p.trim()).filter(Boolean);
      for (const part of descParts.slice(0, 5)) {
        if (part.length >= 4 && part.length <= 40) {
          rawCandidates.push({ phrase: part, source: 'Meta Description' });
        }
      }
    }

    // 3. Headings
    for (const h1 of h1List) {
      if (h1.length >= 4 && h1.length <= 45) {
        rawCandidates.push({ phrase: h1, source: 'Main Heading (H1)' });
      }
    }
    for (const h2 of h2List.slice(0, 10)) {
      if (h2.length >= 4 && h2.length <= 40) {
        rawCandidates.push({ phrase: h2, source: 'Section Heading (H2)' });
      }
    }

    // 4. Repeated high-intent anchor terms (e.g., game names in directory)
    for (const a of linksText.slice(0, 20)) {
      if (
        INTENT_TRIGGERS.some((trig) => a.toLowerCase().includes(trig)) ||
        a.toLowerCase().includes('yono') ||
        a.toLowerCase().includes('rummy')
      ) {
        rawCandidates.push({ phrase: a, source: 'Competitor Link' });
      }
    }

    // Add high-converting variations based on competitor brand/domain
    if (domainName.length >= 3) {
      rawCandidates.push({ phrase: `${domainName} apk download`, source: 'High-Intent Search' });
      rawCandidates.push({ phrase: `${domainName} all games`, source: 'High-Intent Search' });
      rawCandidates.push({ phrase: `${domainName} 51 bonus`, source: 'High-Intent Search' });
      rawCandidates.push({ phrase: `all ${domainName} app`, source: 'High-Intent Search' });
    }

    // Filter, clean & deduplicate
    const finalKeywords: CompetitorKeyword[] = [];
    const seen = new Set<string>();

    for (const item of rawCandidates) {
      const clean = item.phrase
        .toLowerCase()
        .replace(/[^\w\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Reject standalone numbers like '2026', '100', single characters, or junk words
      if (!clean || clean.length < 4 || /^\d+$/.test(clean)) continue;
      if (clean === 'home' || clean === 'menu' || clean === 'contact' || clean === 'privacy policy') continue;

      // Must have at least 2 words or contain high-intent gaming keyword
      const words = clean.split(' ');
      if (words.length === 1 && !INTENT_TRIGGERS.some((t) => clean.includes(t))) continue;

      if (seen.has(clean)) continue;
      seen.add(clean);

      const { category, intent } = classifyKeyword(clean);
      const capKeyword = clean.replace(/\b\w/g, (c) => c.toUpperCase());

      finalKeywords.push({
        keyword: clean,
        category,
        intent,
        source: item.source,
        suggestedTitle: `${capKeyword} - Official APK Download (2026) | Real Yono Games`,
        suggestedMetaDesc: `Download ${capKeyword} official APK. Get instant ₹1,500 bonus, fast UPI withdrawals, and 100% verified fair play on Real Yono Games.`,
      });

      if (finalKeywords.length >= 10) break; // Strict top 10 winning keywords
    }

    // If competitor page had very little text, ensure top 10 guaranteed high-traffic fallbacks
    if (finalKeywords.length < 10) {
      const defaultWinning = [
        'all yono games apk download',
        'yono rummy 51 bonus',
        'new yono games list 2026',
        'yono vip official app',
        'all yono rummy app download',
        'yono games withdrawal proof',
        'yono aviator real cash game',
        'teen patti yono official apk',
        'yono slots jackpot real money',
        'all yono app list 51 bonus',
      ];

      for (const dw of defaultWinning) {
        if (!seen.has(dw)) {
          seen.add(dw);
          const { category, intent } = classifyKeyword(dw);
          const capKeyword = dw.replace(/\b\w/g, (c) => c.toUpperCase());
          finalKeywords.push({
            keyword: dw,
            category,
            intent,
            source: 'High-Traffic SERP Benchmark',
            suggestedTitle: `${capKeyword} - Download App (2026) | Real Yono Games`,
            suggestedMetaDesc: `Download ${capKeyword} official version. Enjoy instant cash withdrawals, verified welcome bonus, and secure play on Real Yono Games.`,
          });
          if (finalKeywords.length >= 10) break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      competitorUrl: targetUrl,
      competitorTitle: title,
      competitorDomain: parsed.hostname,
      keywords: finalKeywords.slice(0, 10),
    });
  } catch (err: unknown) {
    console.error('Competitor spy error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to analyze competitor';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
