import type { Metadata } from 'next';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://realyonogame.com'
).replace(/\/+$/, '');

export const SITE_NAME = 'Real Yono Games';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-composition.jpg`;
export const DEFAULT_LOCALE = 'en_IN';

/**
 * Returns a strictly formatted, canonical absolute URL.
 * Ensures https, trimmed whitespace, lowercase, and no trailing slash (except root).
 */
export function canonicalUrl(path: string = ''): string {
  if (!path || path === '/' || path === '') {
    return `${SITE_URL}/`;
  }

  // Remove leading and trailing slashes
  const cleanPath = path
    .trim()
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  return `${SITE_URL}/${cleanPath}`;
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
 * Centralized, production-grade Metadata builder for Next.js App Router.
 * Ensures consistent canonicals, Open Graph, Twitter cards, and robots directives.
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
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`
    : DEFAULT_OG_IMAGE;

  const resolvedTitleString = typeof title === 'string' ? title : title.default;

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
          alt: imageAlt || `${resolvedTitleString} - ${SITE_NAME}`,
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
