import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles } from 'lucide-react';

export const FacultyTopBar: React.FC<{
  onSelectStep: (step: number) => void;
}> = ({ onSelectStep }) => {
  const { institution, batches, useAICredit, aiMessage, clearAIMessage } = useApp();
  const [askInput, setAskInput] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = askInput.toLowerCase().trim();
    if (!query) return;

    if (query.includes("session") || query.includes("live") || query.includes("lab")) {
      onSelectStep(6);
    } else if (query.includes("course") || query.includes("setup")) {
      onSelectStep(1);
    } else if (query.includes("batch") || query.includes("student")) {
      onSelectStep(2);
    } else if (query.includes("report") || query.includes("download") || query.includes("file")) {
      onSelectStep(9);
    } else if (query.includes("question") || query.includes("bank")) {
      onSelectStep(4);
    } else if (query.includes("assessment") || query.includes("exam")) {
      onSelectStep(8);
    } else {
      useAICredit(`Query: "${askInput}"`);
    }
    setAskInput('');
  };

  return (
    <header className="h-14 bg-surface border-b border-border px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Natural-language Ask Box */}
      <form onSubmit={handleAskSubmit} className="flex-1 max-w-2xl flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder="Ask Assist: open today's session, show 2301044's submissions, download course file..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-paper text-ink rounded-[6px] border border-border focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal font-sans"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 bg-rail text-white text-xs font-mono rounded-[6px] hover:bg-[#262624] transition-colors"
        >
          Ask
        </button>
      </form>

      {/* Status Badges & AI Meter */}
      <div className="flex items-center gap-4 text-xs font-mono">
        {/* Live Lab Indicator */}
        {batches.length > 0 ? (
          <div className="flex items-center gap-2 px-2.5 py-1 bg-surface-alt border border-border rounded-[6px]">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
            <span className="text-ink font-medium">{batches[0].name} ({batches[0].slot || 'Active'})</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2.5 py-1 bg-surface-alt border border-border rounded-[6px] text-muted">
            <span className="w-2 h-2 rounded-full bg-[#73726B]"></span>
            <span>No active session</span>
          </div>
        )}

        {/* AI Credit Meter */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-surface-alt border border-border rounded-[6px]">
          <Sparkles className="w-3.5 h-3.5 text-assist" />
          <span className="text-muted">AI runs ·</span>
          <span className="text-ink font-semibold">
            {institution.plan} {institution.ai_total_cap - institution.ai_used_total} of {institution.ai_total_cap} left
          </span>
          <span className="text-muted">· today {institution.ai_used_today}/{institution.ai_daily_cap} used</span>
        </div>
      </div>

      {/* AI message toast if triggered */}
      {aiMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-rail text-white p-3 rounded-[6px] shadow-lg flex items-center justify-between gap-4 text-xs border border-[#3A3935]">
          <span>{aiMessage}</span>
          <button onClick={clearAIMessage} className="text-muted hover:text-white text-sm">✕</button>
        </div>
      )}
    </header>
  );
};
