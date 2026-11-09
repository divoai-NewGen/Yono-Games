export interface SerpOrganicResult {
  position: number;
  title: string;
  link: string;
  displayedLink?: string;
  snippet?: string;
  domain: string;
  isTargetDomain?: boolean;
}

export type KeywordCheckStatus = 'idle' | 'queued' | 'running' | 'completed' | 'error';

export interface KeywordRankItem {
  id: string;
  keyword: string;
  targetDomain: string;
  status: KeywordCheckStatus;
  position: number | null; // 1-10 or null if not found
  isFound: boolean;
  matchingUrl?: string;
  matchingUrls: string[];
  pageTitle?: string;
  snippet?: string;
  serpResults: SerpOrganicResult[];
  checkedAt?: string;
  error?: string;
  retryCount?: number;
}

export interface RankTrackerSummary {
  totalKeywords: number;
  inTop10: number;
  notFound: number;
  avgPosition: number | null;
}

