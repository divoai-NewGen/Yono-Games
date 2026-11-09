import { NextRequest, NextResponse } from 'next/server';
import { SerpOrganicResult } from '@/types/rankTracker';

/**
 * Normalizes a domain/hostname string for strict hostname-based matching.
 * Handles protocol stripping, www prefix, path trimming, port and trailing slashes.
 */
function normalizeHostname(input: string): string {
  if (!input) return '';
  let str = input.trim().toLowerCase();

  // Add dummy protocol if missing so URL parser works reliably
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    str = 'https://' + str;
  }

  try {
    const url = new URL(str);
    let host = url.hostname.toLowerCase();
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }
    return host;
  } catch {
    // Fallback regex cleanup if URL constructor fails
    return str
      .replace(/^https?:\/\//i, '')
      .split('/')[0]
      .split(':')[0]
      .replace(/^www\./i, '')
      .toLowerCase();
  }
}

/**
 * Checks whether the candidate URL belongs strictly to the target domain or its subdomains.
 * Target: 'realyonogame.com'
 * Match: 'realyonogame.com', 'www.realyonogame.com', 'm.realyonogame.com'
 * Reject: 'realyonogame.com.example.org', 'example.org/realyonogame.com'
 */
function isDomainMatch(candidateUrl: string, targetDomain: string): boolean {
  const normTarget = normalizeHostname(targetDomain);
  const normCandidate = normalizeHostname(candidateUrl);

  if (!normTarget || !normCandidate) return false;

  return normCandidate === normTarget || normCandidate.endsWith('.' + normTarget);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
    }

    const { keyword, targetDomain, gl = 'in', hl = 'en' } = body;

    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    if (!targetDomain || typeof targetDomain !== 'string' || !targetDomain.trim()) {
      return NextResponse.json({ error: 'Target website/domain is required' }, { status: 400 });
    }

    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        {
          error:
            'SerpApi API key is not configured. Please set SERPAPI_API_KEY in your server environment variables.',
          code: 'MISSING_API_KEY',
        },
        { status: 503 }
      );
    }

    const trimmedKeyword = keyword.trim();
    const cleanTargetDomain = targetDomain.trim();

    // Construct SerpApi URL with search parameters
    const params = new URLSearchParams({
      engine: 'google',
      q: trimmedKeyword,
      gl: gl || 'in',
      hl: hl || 'en',
      google_domain: 'google.co.in',
      num: '10',
      api_key: apiKey.trim(),
    });

    const serpApiUrl = `https://serpapi.com/search.json?${params.toString()}`;

    // Execute HTTP call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    let res: Response;
    try {
      res = await fetch(serpApiUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
        cache: 'no-store',
      });
    } catch (networkErr: unknown) {
      clearTimeout(timeoutId);
      const isAbort = networkErr instanceof Error && networkErr.name === 'AbortError';
      if (isAbort) {
        return NextResponse.json(
          { error: 'SerpApi request timed out after 20 seconds. Please try again.', code: 'TIMEOUT' },
          { status: 504 }
        );
      }
      const errMessage = networkErr instanceof Error ? networkErr.message : 'Connection failure';
      return NextResponse.json(
        { error: `Network error connecting to SerpApi: ${errMessage}`, code: 'NETWORK_ERROR' },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      if (res.status === 401 || res.status === 403) {
        return NextResponse.json(
          { error: 'Invalid or unauthorized SerpApi key.', code: 'AUTH_ERROR' },
          { status: 401 }
        );
      }
      if (res.status === 429) {
        return NextResponse.json(
          { error: 'SerpApi monthly search quota exhausted or rate limit reached.', code: 'QUOTA_EXHAUSTED' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `SerpApi error (${res.status}): ${errText.substring(0, 150) || 'Unknown error'}`, code: 'SERPAPI_ERROR' },
        { status: res.status }
      );
    }

    const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    if (!data) {
      return NextResponse.json({ error: 'Received empty or invalid JSON from SerpApi', code: 'INVALID_RESPONSE' }, { status: 502 });
    }

    if (data.error) {
      return NextResponse.json({ error: String(data.error), code: 'SERPAPI_ERROR' }, { status: 400 });
    }

    // Extract ONLY organic results, exclude ads/sponsored/knowledge graphs from organic ranks
    const rawOrganic = Array.isArray(data.organic_results) ? (data.organic_results as Record<string, unknown>[]) : [];

    const serpResults: SerpOrganicResult[] = [];
    let rankCounter = 1;

    for (const item of rawOrganic) {
      if (!item || typeof item.link !== 'string') continue;
      const isTarget = isDomainMatch(item.link, cleanTargetDomain);
      let hostname = '';
      try {
        hostname = new URL(item.link).hostname;
      } catch {
        hostname = typeof item.displayed_link === 'string' ? item.displayed_link : '';
      }

      serpResults.push({
        position: rankCounter,
        title: typeof item.title === 'string' ? item.title : 'Untitled Result',
        link: item.link,
        displayedLink: typeof item.displayed_link === 'string' ? item.displayed_link : hostname,
        snippet: typeof item.snippet === 'string' ? item.snippet : '',
        domain: hostname,
        isTargetDomain: isTarget,
      });

      rankCounter++;
      if (serpResults.length >= 10) break; // Strict top 10
    }

    // Identify target matches
    const matchingResults = serpResults.filter((r) => r.isTargetDomain);
    const topMatch = matchingResults[0] || null;

    return NextResponse.json({
      success: true,
      keyword: trimmedKeyword,
      targetDomain: cleanTargetDomain,
      position: topMatch ? topMatch.position : null,
      isFound: Boolean(topMatch),
      matchingUrl: topMatch ? topMatch.link : undefined,
      matchingUrls: matchingResults.map((r) => r.link),
      pageTitle: topMatch ? topMatch.title : undefined,
      snippet: topMatch ? topMatch.snippet : undefined,
      serpResults,
      checkedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Rank Tracker API error:', error);
    const errMessage = error instanceof Error ? error.message : 'Internal server error while tracking rank';
    return NextResponse.json(
      { error: errMessage, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
