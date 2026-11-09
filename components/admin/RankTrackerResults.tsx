import React, { useState } from 'react';
import {
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  Search,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { KeywordRankItem, RankTrackerSummary, SerpOrganicResult } from '@/types/rankTracker';

interface RankTrackerResultsProps {
  items: KeywordRankItem[];
  summary: RankTrackerSummary;
  onRetryKeyword: (id: string) => void;
  onExportCsv: () => void;
  isRunning: boolean;
}

export default function RankTrackerResults({
  items,
  summary,
  onRetryKeyword,
  onExportCsv,
  isRunning,
}: RankTrackerResultsProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(items[0]?.id || null);

  const activeItem = items.find((i) => i.id === selectedItemId) || items[0] || null;

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Keywords */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5D6B78]">Total Checked</span>
            <Search className="w-4 h-4 text-[#087F5B]" />
          </div>
          <p className="text-2xl font-bold text-[#172331] mt-2">{summary.totalKeywords}</p>
          <p className="text-[11px] text-[#5D6B78] mt-1 font-medium">Session keyword queries</p>
        </div>

        {/* Ranking in Top 10 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5D6B78]">In Top 10</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#087F5B] mt-2">{summary.inTop10}</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            {summary.totalKeywords > 0
              ? `${Math.round((summary.inTop10 / summary.totalKeywords) * 100)}% ranking rate`
              : 'Organic positions found'}
          </p>
        </div>

        {/* Not Found in Top 10 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5D6B78]">Not Found (Top 10)</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{summary.notFound}</p>
          <p className="text-[11px] text-amber-600 mt-1 font-medium">Beyond page 1</p>
        </div>

        {/* Average Position */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5D6B78]">Average Position</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-[#172331] mt-2">
            {summary.avgPosition !== null ? `#${summary.avgPosition}` : 'N/A'}
          </p>
          <p className="text-[11px] text-[#5D6B78] mt-1 font-medium">For ranking keywords only</p>
        </div>
      </div>

      {/* 2. Main Work Area: Left Keyword List / Cards & Right SERP Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): Keyword list cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#5D6B78] uppercase tracking-wider">
              Keyword Breakdown ({items.length})
            </span>
            <button
              type="button"
              onClick={onExportCsv}
              disabled={items.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#087F5B] bg-[#EEF8F2] hover:bg-[#E4ECE7] border border-[#087F5B]/20 transition-all shadow-2xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isSelected = activeItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#087F5B] bg-[#F7FBF8] shadow-md ring-1 ring-[#087F5B]/30'
                      : 'border-[#E4ECE7] bg-white hover:border-[#D5E2D9] shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#172331] truncate">{item.keyword}</span>
                        {item.status === 'completed' && item.isFound && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-[#087F5B] text-white">
                            #{item.position}
                          </span>
                        )}
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                        {item.status === 'completed' && (
                          <>
                            {item.isFound ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Ranking Top 10</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                <span>Not in Top 10</span>
                              </span>
                            )}
                          </>
                        )}

                        {item.status === 'running' && (
                          <span className="inline-flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md animate-pulse">
                            <RotateCw className="w-3 h-3 text-blue-600 animate-spin" />
                            <span>Checking Google SERP...</span>
                          </span>
                        )}

                        {item.status === 'queued' && (
                          <span className="inline-flex items-center gap-1 text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span>In Queue</span>
                          </span>
                        )}

                        {item.status === 'error' && (
                          <span className="inline-flex items-center gap-1 text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded-md">
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            <span>Error</span>
                          </span>
                        )}

                        {item.checkedAt && (
                          <span className="text-[#8A9BA8] font-normal">
                            {new Date(item.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Retry */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {(item.status === 'error' || item.status === 'completed') && (
                        <button
                          type="button"
                          onClick={() => onRetryKeyword(item.id)}
                          disabled={isRunning}
                          title="Re-check keyword rank"
                          className="p-1.5 rounded-lg text-[#5D6B78] hover:text-[#087F5B] hover:bg-[#EEF8F2] transition-colors disabled:opacity-40"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <ChevronRight className={`w-4 h-4 text-[#8A9BA8] ${isSelected ? 'text-[#087F5B]' : ''}`} />
                    </div>
                  </div>

                  {/* Matching URL snippet preview */}
                  {item.matchingUrl && (
                    <div className="mt-2.5 pt-2 border-t border-[#EEF3F0] text-xs">
                      <p className="text-[10px] uppercase font-bold text-[#8A9BA8]">Matching Page</p>
                      <a
                        href={item.matchingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#087F5B] hover:underline font-mono text-[11px] truncate block mt-0.5"
                      >
                        {item.matchingUrl}
                      </a>
                    </div>
                  )}

                  {/* Error preview */}
                  {item.error && (
                    <div className="mt-2 pt-2 border-t border-red-100 text-[11px] text-red-600">
                      {item.error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (7 cols): Full Top 10 SERP Result Viewer */}
        <div className="lg:col-span-7">
          {activeItem ? (
            <div className="bg-white rounded-2xl border border-[#E4ECE7] shadow-sm p-6 space-y-6">
              {/* Header Info */}
              <div className="border-b border-[#EEF3F0] pb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#172331]">{activeItem.keyword}</h3>
                    {activeItem.status === 'completed' && (
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                          activeItem.isFound
                            ? 'bg-[#087F5B] text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {activeItem.isFound ? `Rank #${activeItem.position}` : 'Not in Top 10'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5D6B78] flex items-center gap-2">
                    <span>Target: <strong>{activeItem.targetDomain}</strong></span>
                    <span>•</span>
                    <span>Engine: Google.co.in</span>
                  </p>
                </div>

                {activeItem.matchingUrl && (
                  <a
                    href={activeItem.matchingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Visit Ranking Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Status Notice if checking or error */}
              {activeItem.status === 'running' && (
                <div className="p-8 text-center space-y-2 bg-[#F8FBFA] rounded-2xl border border-[#E4ECE7]">
                  <RotateCw className="w-7 h-7 text-[#087F5B] animate-spin mx-auto" />
                  <p className="text-sm font-bold text-[#172331]">Retrieving Google organic results...</p>
                  <p className="text-xs text-[#5D6B78]">Fetching top 10 organic positions via SerpApi</p>
                </div>
              )}

              {activeItem.status === 'error' && (
                <div className="p-5 bg-red-50 rounded-2xl border border-red-200 text-red-700 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Failed to retrieve rankings</span>
                  </div>
                  <p>{activeItem.error || 'Unknown error occurred while contacting search provider.'}</p>
                  <button
                    type="button"
                    onClick={() => onRetryKeyword(activeItem.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-xs"
                  >
                    Retry Check
                  </button>
                </div>
              )}

              {/* Top 10 SERP Table */}
              {activeItem.status === 'completed' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#5D6B78] uppercase tracking-wider">
                      Google Organic Top 10 Results
                    </h4>
                    <span className="text-[11px] text-[#8A9BA8]">
                      Exact order as retrieved from Google India
                    </span>
                  </div>

                  {activeItem.serpResults.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#5D6B78] bg-[#F8FBFA] rounded-xl border border-[#E4ECE7]">
                      No organic results returned for this query.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {activeItem.serpResults.map((result: SerpOrganicResult) => {
                        const isMatch = result.isTargetDomain;

                        return (
                          <div
                            key={result.position}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isMatch
                                ? 'bg-[#EEF8F2] border-[#087F5B] shadow-sm ring-1 ring-[#087F5B]'
                                : 'bg-[#FAFCFA] border-[#E4ECE7] hover:border-[#D5E2D9]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Position Badge */}
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                  isMatch
                                    ? 'bg-[#087F5B] text-white shadow-xs'
                                    : 'bg-white border border-[#D5E2D9] text-[#5D6B78]'
                                }`}
                              >
                                #{result.position}
                              </div>

                              {/* Title, Snippet, URL */}
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <a
                                    href={result.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`font-bold text-sm hover:underline line-clamp-1 ${
                                      isMatch ? 'text-[#07553F]' : 'text-[#172331]'
                                    }`}
                                  >
                                    {result.title}
                                  </a>
                                  {isMatch && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#087F5B] text-white">
                                      YOUR MATCHING SITE
                                    </span>
                                  )}
                                </div>

                                <p className="text-[11px] text-[#5D6B78] font-mono truncate">
                                  {result.displayedLink || result.link}
                                </p>

                                {result.snippet && (
                                  <p className="text-xs text-[#5D6B78] leading-relaxed line-clamp-2">
                                    {result.snippet}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E4ECE7] shadow-sm p-12 text-center text-[#5D6B78]">
              Select a keyword from the list on the left to inspect detailed top 10 Google results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
