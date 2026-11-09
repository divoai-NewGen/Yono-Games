import React, { useMemo } from 'react';
import { Globe, Layers, Play, XCircle, Sparkles, Loader2 } from 'lucide-react';

interface RankTrackerConfigProps {
  targetDomain: string;
  setTargetDomain: (val: string) => void;
  keywordsInput: string;
  setKeywordsInput: (val: string) => void;
  onCheckAll: () => void;
  onCancelAll: () => void;
  onAutoDiscover: () => void;
  isDiscovering: boolean;
  isRunning: boolean;
}

export default function RankTrackerConfig({
  targetDomain,
  setTargetDomain,
  keywordsInput,
  setKeywordsInput,
  onCheckAll,
  onCancelAll,
  onAutoDiscover,
  isDiscovering,
  isRunning,
}: RankTrackerConfigProps) {
  // Parse deduplicated keywords count
  const parsedKeywords = useMemo(() => {
    const raw = keywordsInput
      .split('\n')
      .map((k) => k.trim())
      .filter(Boolean);
    return Array.from(new Set(raw));
  }, [keywordsInput]);

  return (
    <div className="bg-white rounded-2xl border border-[#E4ECE7] shadow-sm p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF3F0] pb-4">
        <div>
          <h2 className="text-base font-bold text-[#172331]">Search & Auto-Discovery Configuration</h2>
          <p className="text-xs text-[#5D6B78] mt-0.5">
            Enter any website link to auto-extract ranking keywords or manually provide keywords to track real-time Google ranks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAutoDiscover}
            disabled={!targetDomain.trim() || isDiscovering || isRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#087F5B]/10 hover:bg-[#087F5B]/20 text-[#087F5B] border border-[#087F5B]/30 transition-all shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDiscovering ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            )}
            <span>{isDiscovering ? 'Analyzing Website...' : '⚡ Auto-Discover Keywords from Link'}</span>
          </button>
          <span className="text-[11px] font-semibold bg-[#087F5B]/10 text-[#087F5B] px-3 py-1 rounded-full">
            Google India (gl=in)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Target Domain + Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5D6B78] uppercase tracking-wider mb-1.5">
              Target Website / URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#8A9BA8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. realyonogame.com or https://competitor.com"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                disabled={isRunning || isDiscovering}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E2D9] text-sm text-[#172331] focus:outline-none focus:ring-2 focus:ring-[#087F5B] disabled:bg-gray-50 font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-[#8A9BA8] mt-1.5 flex items-center gap-1">
              <span>Tip: Click <strong>&ldquo;⚡ Auto-Discover Keywords&rdquo;</strong> above to extract top keywords without typing!</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-[#F8FBFA] p-3.5 rounded-xl border border-[#E4ECE7] text-xs">
            <div>
              <span className="text-[#8A9BA8] block text-[10px] uppercase font-bold">Search Engine</span>
              <span className="font-bold text-[#172331] mt-0.5 block">Google.co.in</span>
            </div>
            <div>
              <span className="text-[#8A9BA8] block text-[10px] uppercase font-bold">Location</span>
              <span className="font-bold text-[#172331] mt-0.5 block">India (IN)</span>
            </div>
            <div>
              <span className="text-[#8A9BA8] block text-[10px] uppercase font-bold">Search Depth</span>
              <span className="font-bold text-[#087F5B] mt-0.5 block">Top 10 Organic</span>
            </div>
          </div>
        </div>

        {/* Right Column: Multiline Keywords */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#5D6B78] uppercase tracking-wider">
              Keywords List (One per line) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-bold text-[#087F5B] bg-[#EEF8F2] px-2 py-0.5 rounded-md">
              {parsedKeywords.length} Unique {parsedKeywords.length === 1 ? 'Keyword' : 'Keywords'}
            </span>
          </div>

          <textarea
            rows={4}
            placeholder={`Click "Auto-Discover Keywords" above or type keywords manually:\nyono games apk download\nyono rummy\nhoney rummy\nyono aviator\nteen patti yono`}
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
            disabled={isRunning || isDiscovering}
            className="w-full p-3 rounded-xl border border-[#D5E2D9] text-sm font-mono text-[#172331] focus:outline-none focus:ring-2 focus:ring-[#087F5B] disabled:bg-gray-50 placeholder:font-sans placeholder:text-gray-400"
          />
          <p className="text-[11px] text-[#8A9BA8]">
            Duplicate lines are automatically deduped. Processed up to 3 at a time with automatic queueing.
          </p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#EEF3F0]">
        <div className="text-xs text-[#5D6B78] flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#087F5B]" />
          <span>Queue handles max 3 concurrent requests with timeout & auto-retry.</span>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              type="button"
              onClick={onCancelAll}
              className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-2 border border-red-200 transition-all shadow-xs"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Queue</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCheckAll}
              disabled={parsedKeywords.length === 0 || !targetDomain.trim() || isDiscovering}
              className="px-6 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Check All Keywords ({parsedKeywords.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
