import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge Middleware for Host Canonicalization & Clean Redirects
 * - Redirects www.realyonogame.com -> realyonogame.com (301 Permanent)
 * - Preserves pathname and query string parameters
 * - Normalizes trailing slashes (e.g. /games/ -> /games)
 * - Excludes API routes, static assets, and internal Next.js files
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // 1. Redirect www to non-www (301 Permanent)
  if (host.startsWith('www.')) {
    const newHost = host.replace(/^www\./i, '');
    const url = request.nextUrl.clone();
    url.host = newHost;
    url.protocol = 'https';
    url.port = '';

    return NextResponse.redirect(url, { status: 301 });
  }

  // 2. Trailing slash normalization for non-root paths (e.g. /games/ -> /games)
  const pathname = request.nextUrl.pathname;
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, apple-icon.png, sitemap.xml, robots.txt
     * - images, icons folders
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|images|icons).*)',
  ],
};
