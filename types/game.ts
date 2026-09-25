export interface Game {
  id: string;
  slug: string;
  name: string;
  tagline: string;

  logo: string;
  thumbnail: string;
  heroImage: string;
  screenshots: string[];

  category: string;
  categories: string[];

  rating: number;
  ratingCount: string;

  players: string;
  downloads: string;
  bonus: string;

  shortDescription: string;
  description: string;

  features: string[];
  howToPlay: string[];

  downloadUrl?: string | null;
  version: string;
  size: string;

  featured?: boolean;
  newRelease?: boolean;
  popular?: boolean;

  seoTitle: string;
  seoDescription: string;
}

export type GameCategory =
  | 'All'
  | 'All Games'
  | 'Yono Games'
  | 'Other Best Games';

export interface SiteStat {
  value: string;
  label: string;
  sublabel: string;
  iconName:
  | 'Gamepad2'
  | 'Users'
  | 'Trophy'
  | 'Headphones';
}