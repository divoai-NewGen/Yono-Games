'use client';

import React, { useState, useRef, useMemo, useCallback } from 'react';
import RankTrackerConfig from './RankTrackerConfig';
import RankTrackerResults from './RankTrackerResults';
import CompetitorKeywordSpy, { CompetitorKeywordItem } from './CompetitorKeywordSpy';
import { KeywordRankItem, RankTrackerSummary, SerpOrganicResult } from '@/types/rankTracker';
import { Game } from '@/types/game';

interface RankTrackerProps {
  games?: Game[];
  onApplyKeywordToGame?: (gameId: string, keywordData: CompetitorKeywordItem) => Promise<void>;
  showToast: (type: 'success' | 'error', text: string) => void;
}

interface RankApiResponse {
  success: boolean;
  position: number | null;
  isFound: boolean;
  matchingUrl?: string;
  matchingUrls: string[];
  pageTitle?: string;
  snippet?: string;
  serpResults: SerpOrganicResult[];
  checkedAt: string;
}

export default function RankTracker({ games = [], onApplyKeywordToGame, showToast }: RankTrackerProps) {
  // Subtab switcher: 'spy' (Competitor Spy) or 'serp' (Google SERP Tracker)
  const [activeSubTab, setActiveSubTab] = useState<'spy' | 'serp'>('spy');

  // Configuration State (In-memory, session-free)
  const [targetDomain, setTargetDomain] = useState<string>('realyonogame.com');
  const [keywordsInput, setKeywordsInput] = useState<string>(
    'yono games apk download\nyono rummy\nhoney rummy\nyono aviator\nteen patti yono'
  );

  // Results State (strictly in temporary React state)
  const [items, setItems] = useState<KeywordRankItem[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);

  // Abort control for cancellation
  const isCancelledRef = useRef<boolean>(false);

  // Derived Summary Metrics
  const summary: RankTrackerSummary = useMemo(() => {
    const totalKeywords = items.length;
    const completed = items.filter((i) => i.status === 'completed');
    const inTop10 = completed.filter((i) => i.isFound && i.position !== null).length;
    const notFound = completed.filter((i) => !i.isFound).length;

    const rankingPositions = completed
      .map((i) => i.position)
      .filter((p): p is number => typeof p === 'number');

    const avgPosition =
      rankingPositions.length > 0
        ? Number((rankingPositions.reduce((a, b) => a + b, 0) / rankingPositions.length).toFixed(1))
        : null;

    return {
      totalKeywords,
      inTop10,
      notFound,
      avgPosition,
    };
  }, [items]);

  // Check single keyword with automatic retry
  const checkKeywordRequest = async (
    keyword: string,
    domain: string,
    maxRetries = 2
  ): Promise<RankApiResponse> => {
    let attempts = 0;
    let lastErr = 'Request failed';

    while (attempts <= maxRetries) {
      if (isCancelledRef.current) {
        throw new Error('Cancelled by user');
      }

      try {
        const res = await fetch('/api/admin/rank-tracker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keyword,
            targetDomain: domain,
            gl: 'in',
            hl: 'en',
          }),
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data && data.success) {
          return data;
        }

        lastErr = data?.error || `Server responded with ${res.status}`;

        // Don't retry if client error like missing API key or bad domain
        if (data?.code === 'MISSING_API_KEY' || data?.code === 'AUTH_ERROR') {
          throw new Error(lastErr);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Network error';
        lastErr = msg;
        if (msg === 'Cancelled by user') throw err;
      }

      attempts++;
      if (attempts <= maxRetries) {
        // Exponential backoff delay
        await new Promise((r) => setTimeout(r, attempts * 1000));
      }
    }

    throw new Error(lastErr);
  };

  // Run queue with MAX 3 concurrent workers
  const runQueue = useCallback(async (initialItems: KeywordRankItem[], domain: string) => {
    setIsRunning(true);
    isCancelledRef.current = false;

    const CONCURRENCY_LIMIT = 3;
    let currentIndex = 0;

    const worker = async () => {
      while (currentIndex < initialItems.length) {
        if (isCancelledRef.current) break;

        const itemIndex = currentIndex++;
        const currentItem = initialItems[itemIndex];

        // Mark as running
        setItems((prev) =>
          prev.map((i) => (i.id === currentItem.id ? { ...i, status: 'running', error: undefined } : i))
        );

        try {
          const result = await checkKeywordRequest(currentItem.keyword, domain);

          if (isCancelledRef.current) break;

          setItems((prev) =>
            prev.map((i) =>
              i.id === currentItem.id
                ? {
                    ...i,
                    status: 'completed',
                    position: result.position,
                    isFound: result.isFound,
                    matchingUrl: result.matchingUrl,
                    matchingUrls: result.matchingUrls || [],
                    pageTitle: result.pageTitle,
                    snippet: result.snippet,
                    serpResults: result.serpResults || [],
                    checkedAt: result.checkedAt,
                    error: undefined,
                  }
                : i
            )
          );
        } catch (err: unknown) {
          if (isCancelledRef.current) break;

          const errMsg = err instanceof Error ? err.message : 'Failed to check ranking';
          setItems((prev) =>
            prev.map((i) =>
              i.id === currentItem.id
                ? {
                    ...i,
                    status: 'error',
                    error: errMsg,
                  }
                : i
            )
          );
        }
      }
    };

    const workers = Array.from(
      { length: Math.min(CONCURRENCY_LIMIT, initialItems.length) },
      () => worker()
    );

    await Promise.all(workers);

    setIsRunning(false);
    if (!isCancelledRef.current) {
      showToast('success', 'Keyword rankings checked successfully.');
    }
  }, [showToast]);

  // Auto-discover keywords from website link
  const handleAutoDiscover = useCallback(async () => {
    if (!targetDomain.trim()) {
      showToast('error', 'Please enter a website link or domain first.');
      return;
    }

    try {
      setIsDiscovering(true);
      showToast('success', `Scanning "${targetDomain.trim()}" for top keywords...`);

      const res = await fetch('/api/admin/rank-tracker/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetDomain.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data && Array.isArray(data.keywords) && data.keywords.length > 0) {
        const discovered = data.keywords as string[];
        setKeywordsInput(discovered.join('\n'));
        showToast('success', `⚡ Found ${discovered.length} top keywords! Checking Google ranks...`);

        // Automatically start checking rankings for discovered keywords
        const newItems: KeywordRankItem[] = discovered.map((keyword, idx) => ({
          id: `${Date.now()}-${idx}-${keyword.replace(/[^a-zA-Z0-9]/g, '_')}`,
          keyword,
          targetDomain: (data.targetDomain || targetDomain).trim(),
          status: 'queued',
          position: null,
          isFound: false,
          matchingUrls: [],
          serpResults: [],
        }));

        setItems(newItems);
        runQueue(newItems, (data.targetDomain || targetDomain).trim());
      } else {
        throw new Error(data?.error || 'Failed to extract keywords from this website');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Discovery error';
      showToast('error', msg);
    } finally {
      setIsDiscovering(false);
    }
  }, [targetDomain, runQueue, showToast]);

  // Check all keywords handler
  const handleCheckAll = useCallback(() => {
    if (!targetDomain.trim()) {
      showToast('error', 'Please enter a target domain first.');
      return;
    }

    const uniqueKeywords = Array.from(
      new Set(
        keywordsInput
          .split('\n')
          .map((k) => k.trim())
          .filter(Boolean)
      )
    );

    if (uniqueKeywords.length === 0) {
      showToast('error', 'Please enter at least one valid keyword.');
      return;
    }

    const newItems: KeywordRankItem[] = uniqueKeywords.map((keyword, idx) => ({
      id: `${Date.now()}-${idx}-${keyword.replace(/[^a-zA-Z0-9]/g, '_')}`,
      keyword,
      targetDomain: targetDomain.trim(),
      status: 'queued',
      position: null,
      isFound: false,
      matchingUrls: [],
      serpResults: [],
    }));

    setItems(newItems);
    runQueue(newItems, targetDomain.trim());
  }, [targetDomain, keywordsInput, runQueue, showToast]);

  // Cancel running checks
  const handleCancelAll = useCallback(() => {
    isCancelledRef.current = true;
    setIsRunning(false);
    setItems((prev) =>
      prev.map((i) => (i.status === 'queued' || i.status === 'running' ? { ...i, status: 'idle' } : i))
    );
    showToast('error', 'Queue processing cancelled.');
  }, [showToast]);

  // Retry individual keyword
  const handleRetryKeyword = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: 'running', error: undefined } : i))
      );

      try {
        const result = await checkKeywordRequest(item.keyword, item.targetDomain);
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: 'completed',
                  position: result.position,
                  isFound: result.isFound,
                  matchingUrl: result.matchingUrl,
                  matchingUrls: result.matchingUrls || [],
                  pageTitle: result.pageTitle,
                  snippet: result.snippet,
                  serpResults: result.serpResults || [],
                  checkedAt: result.checkedAt,
                  error: undefined,
                }
              : i
          )
        );
        showToast('success', `Updated rank for "${item.keyword}"`);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Retry failed';
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, status: 'error', error: errMsg } : i
          )
        );
        showToast('error', `Failed to check "${item.keyword}": ${errMsg}`);
      }
    },
    [items, showToast]
  );

  // Export session results to CSV
  const handleExportCsv = useCallback(() => {
    if (items.length === 0) return;

    const headers = [
      'Keyword',
      'Target Domain',
      'Position',
      'Status',
      'Ranking URL',
      'Page Title',
      'Country',
      'Checked At',
    ];

    const rows = items.map((item) => {
      const posStr = item.status === 'completed' ? (item.isFound ? String(item.position) : 'Not in Top 10') : item.status;
      const escape = (val?: string) => `"${(val || '').replace(/"/g, '""')}"`;

      return [
        escape(item.keyword),
        escape(item.targetDomain),
        posStr,
        escape(item.status),
        escape(item.matchingUrl),
        escape(item.pageTitle),
        'India (IN)',
        escape(item.checkedAt || new Date().toISOString()),
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `seo_rankings_${targetDomain.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', 'CSV export downloaded successfully.');
  }, [items, targetDomain, showToast]);

  return (
    <div className="space-y-6">
      {/* Subtab Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#E4ECE7] shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('spy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'spy'
                ? 'bg-[#087F5B] text-white shadow-sm'
                : 'bg-[#F1F6F3] text-[#5D6B78] hover:text-[#172331] hover:bg-[#E4ECE7]'
            }`}
          >
            <span>🕵️ Competitor Keyword Spy (Auto-Extract Top 10)</span>
            <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-md">
              Instant
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('serp')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'serp'
                ? 'bg-[#087F5B] text-white shadow-sm'
                : 'bg-[#F1F6F3] text-[#5D6B78] hover:text-[#172331] hover:bg-[#E4ECE7]'
            }`}
          >
            <span>📊 Live Google SERP Rank Tracker</span>
          </button>
        </div>

        <p className="text-[11px] text-[#5D6B78] italic hidden xl:block">
          Paste competitor link &rarr; Extract Top 10 keywords &rarr; 1-Click apply to your game SEO
        </p>
      </div>

      {activeSubTab === 'spy' ? (
        <CompetitorKeywordSpy
          games={games}
          onApplyKeywordToGame={onApplyKeywordToGame || (async () => {})}
          onSendToRankTracker={(kws) => {
            setKeywordsInput(kws.join('\n'));
            setActiveSubTab('serp');
            showToast('success', `Sent ${kws.length} keywords to Live SERP Tracker!`);
          }}
          showToast={showToast}
        />
      ) : (
        <>
          {/* 1. Configuration Panel */}
          <RankTrackerConfig
            targetDomain={targetDomain}
            setTargetDomain={setTargetDomain}
            keywordsInput={keywordsInput}
            setKeywordsInput={setKeywordsInput}
            onCheckAll={handleCheckAll}
            onCancelAll={handleCancelAll}
            onAutoDiscover={handleAutoDiscover}
            isDiscovering={isDiscovering}
            isRunning={isRunning}
          />

          {/* 2. Results & Metrics Section */}
          {items.length > 0 && (
            <RankTrackerResults
              items={items}
              summary={summary}
              onRetryKeyword={handleRetryKeyword}
              onExportCsv={handleExportCsv}
              isRunning={isRunning}
            />
          )}
        </>
      )}
    </div>
  );
}
