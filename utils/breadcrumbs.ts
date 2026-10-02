import { BreadcrumbItem } from './structuredData';

export function getHomeBreadcrumb(): BreadcrumbItem[] {
  return [{ name: 'Home', url: '/' }];
}

export function getGamesBreadcrumb(): BreadcrumbItem[] {
  return [
    { name: 'Home', url: '/' },
    { name: 'Games Catalog', url: '/games' },
  ];
}

export function getGameDetailBreadcrumb(game: {
  name: string;
  slug: string;
}): BreadcrumbItem[] {
  return [
    { name: 'Home', url: '/' },
    { name: 'Games Catalog', url: '/games' },
    { name: game.name, url: `/games/${game.slug}` },
  ];
}

export function getStaticPageBreadcrumb(
  name: string,
  path: string
): BreadcrumbItem[] {
  return [
    { name: 'Home', url: '/' },
    { name, url: path.startsWith('/') ? path : `/${path}` },
  ];
}
