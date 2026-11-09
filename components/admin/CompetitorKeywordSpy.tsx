import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Search,
  Flame,
  TrendingUp,
  Globe,
  Loader2,
} from 'lucide-react';
import { Game } from '@/types/game';

export interface CompetitorKeywordItem {
  keyword: string;
  category: 'High Intent' | 'High Volume' | 'Brand / Money' | 'Long Tail';
  intent: 'Download' | 'Bonus / Money' | 'Game App' | 'Informational';
  source: string;
  suggestedTitle: string;
  suggestedMetaDesc: string;
}

interface CompetitorKeywordSpyProps {
  games: Game[];
  onApplyKeywordToGame: (gameId: string, keywordData: CompetitorKeywordItem) => Promise<void>;
  onSendToRankTracker: (keywords: string[]) => void;
  showToast: (type: 'success' | 'error', text: string) => void;
}

export default function CompetitorKeywordSpy({
  games,
  onApplyKeywordToGame,
  onSendToRankTracker,
  showToast,
}: CompetitorKeywordSpyProps) {
  const [competitorUrl, setCompetitorUrl] = useState('https://allyonobonus.net/');
  const [isScanning, setIsScanning] = useState(false);
  const [keywords, setKeywords] = useState<CompetitorKeywordItem[]>([]);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [selectedGamePerKw, setSelectedGamePerKw] = useState<Record<string, string>>({});
  const [applyingKw, setApplyingKw] = useState<string | null>(null);

  // Scan competitor website
  const handleScanCompetitor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!competitorUrl.trim()) {
      showToast('error', 'Please enter a competitor website link');
      return;
    }

    try {
      setIsScanning(true);
      const res = await fetch('/api/admin/rank-tracker/spy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: competitorUrl.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data && Array.isArray(data.keywords)) {
        setKeywords(data.keywords);
        showToast('success', `Found ${data.keywords.length} Top Ranking Keywords from competitor!`);
      } else {
        throw new Error(data?.error || 'Failed to extract competitor keywords');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error scanning competitor';
      showToast('error', msg);
    } finally {
      setIsScanning(false);
    }
  };

  // Copy keyword
  const handleCopy = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    showToast('success', `Copied "${kw}" to clipboard!`);
    setTimeout(() => setCopiedKeyword(null), 2500);
  };

  // Apply keyword to selected game
  const handleApply = async (kwItem: CompetitorKeywordItem) => {
    const selectedGameId = selectedGamePerKw[kwItem.keyword] || games[0]?.id;
    if (!selectedGameId) {
      showToast('error', 'Please select a game from the dropdown first');
      return;
    }

    try {
      setApplyingKw(kwItem.keyword);
      await onApplyKeywordToGame(selectedGameId, kwItem);
      showToast('success', `⚡ Applied "${kwItem.keyword}" to game SEO! Website updated live.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update game SEO';
      showToast('error', msg);
    } finally {
      setApplyingKw(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar / Input Card */}
      <div className="bg-white rounded-2xl border border-[#E4ECE7] shadow-sm p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF3F0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-base font-bold text-[#172331]">Competitor Keyword Spy & Rank Stealer</h2>
            </div>
            <p className="text-xs text-[#5D6B78] mt-1">
              Enter any competitor website link. We analyze their top 10 ranking keywords and allow you to 1-click apply them to your games to rank above them on Google.
            </p>
          </div>
          <span className="text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Top 10 High-Ranking Extractor
          </span>
        </div>

        <form onSubmit={handleScanCompetitor} className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Globe className="w-4 h-4 text-[#8A9BA8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. https://allyonobonus.net/ or any competitor gaming URL"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              disabled={isScanning}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5E2D9] text-sm font-mono text-[#172331] focus:outline-none focus:ring-2 focus:ring-[#087F5B] disabled:bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={isScanning || !competitorUrl.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex-shrink-0"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Ranked Keywords...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Get Top 10 Keywords</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Keywords Results Table */}
      {keywords.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E4ECE7] shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF3F0] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#172331] flex items-center gap-2">
                <span>Top 10 Ranked Keywords From Competitor</span>
                <span className="text-xs font-bold text-[#087F5B] bg-[#EEF8F2] px-2 py-0.5 rounded-md">
                  {keywords.length} Found
                </span>
              </h3>
              <p className="text-xs text-[#5D6B78] mt-0.5">
                Apply these exact keywords to your website games so Google ranks your pages for these search queries.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSendToRankTracker(keywords.map((k) => k.keyword))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#EEF8F2] hover:bg-[#E4ECE7] text-[#087F5B] border border-[#087F5B]/20 transition-all shadow-2xs"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Track All on Google SERP</span>
            </button>
          </div>

          <div className="space-y-3">
            {keywords.map((item, idx) => {
              const selectedGameId = selectedGamePerKw[item.keyword] || games[0]?.id;
              const isApplying = applyingKw === item.keyword;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#E4ECE7] hover:border-[#D5E2D9] bg-[#FAFCFA] transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    {/* Rank Number + Keyword */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#087F5B] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#172331]">{item.keyword}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            Intent: {item.intent}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8A9BA8] mt-0.5">
                          Found in competitor: <strong>{item.source}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Quick Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item.keyword)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5D6B78] hover:text-[#087F5B] bg-white border border-[#D5E2D9] hover:bg-[#EEF8F2] transition-colors"
                    >
                      {copiedKeyword === item.keyword ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Keyword</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1-Click Replace / Apply to Your Game */}
                  <div className="p-3 bg-white rounded-xl border border-[#EEF3F0] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-[#8A9BA8]">
                        Suggested Auto-Generated SEO Title for Google:
                      </p>
                      <p className="font-semibold text-[#07553F] truncate">
                        {item.suggestedTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
                      <span className="text-[#5D6B78] font-semibold text-xs whitespace-nowrap">Apply to Game:</span>
                      <select
                        value={selectedGameId}
                        onChange={(e) =>
                          setSelectedGamePerKw((prev) => ({ ...prev, [item.keyword]: e.target.value }))
                        }
                        className="px-3 py-2 rounded-lg border border-[#D5E2D9] text-xs font-semibold text-[#172331] focus:ring-2 focus:ring-[#087F5B] bg-[#F7FBF8]"
                      >
                        {games.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name} ({g.category})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleApply(item)}
                        disabled={isApplying}
                        className="px-4 py-2 rounded-lg bg-[#087F5B] hover:bg-[#07553F] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                      >
                        {isApplying ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                        )}
                        <span>{isApplying ? 'Applying...' : '1-Click Apply SEO'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
