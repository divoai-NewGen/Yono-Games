import type { Metadata } from 'next';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://realyonogame.com'
).replace(/\/+$/, '');

export const SITE_NAME = 'Real Yono Games';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-composition.jpg`;
export const DEFAULT_LOCALE = 'en_IN';

/**
 * Returns a strictly formatted, canonical absolute URL.
 * - Root returns https://realyonogame.com/ (trailing slash, per convention).
 * - All other paths: lowercase, no trailing slash, url-encoded slugs preserved.
 */
export function canonicalUrl(path: string = ''): string {
  const trimmed = path.trim().replace(/^\/+/, '').replace(/\/+$/, '');

  if (!trimmed) {
    return `${SITE_URL}/`;
  }

  // Lowercase only the path segments that are plain ASCII slugs.
  // Do not transform Cloudinary image URLs or other absolute URLs passed in by accident.
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `${SITE_URL}/${trimmed.toLowerCase()}`;
}

export interface MetadataOptions {
  title: string | { default: string; template: string };
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  keywords?: string[];
}

/**
 * Centralised, production-grade Metadata builder for Next.js App Router.
 *
 * Guarantees:
 * - Unique canonical per page (via `path`).
 * - Open Graph image with required width/height for validators.
 * - Correct robots directives.
 * - No conflicting layout ↔ page metadata (layout sets only fallback / site-level fields).
 */
export function createMetadata({
  title,
  description,
  path = '',
  image,
  imageAlt,
  noindex = false,
  type = 'website',
  keywords,
}: MetadataOptions): Metadata {
  const canonical = canonicalUrl(path);

  // Safely resolve OG image to an absolute URL
  let imageUrl: string;
  if (!image) {
    imageUrl = DEFAULT_OG_IMAGE;
  } else if (image.startsWith('http://') || image.startsWith('https://')) {
    imageUrl = image;
  } else {
    imageUrl = `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
  }

  const resolvedTitleString =
    typeof title === 'string' ? title : title.default;

  const altText = imageAlt || `${resolvedTitleString} – ${SITE_NAME}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: keywords && keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical,
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type,
      locale: DEFAULT_LOCALE,
      url: canonical,
      siteName: SITE_NAME,
      title: resolvedTitleString,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: altText,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitleString,
      description,
      images: [imageUrl],
    },
  };
}
