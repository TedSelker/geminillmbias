import React, { useState } from 'react';
import { BiasRatingSummary } from '../types';
import { ChevronDown, ChevronUp, Quote, Info, CheckCircle2 } from 'lucide-react';

interface TopBiasesSectionProps {
  top5Biases: BiasRatingSummary[];
  onSelectBias?: (biasName: string) => void;
  selectedBiasName?: string | null;
}

export const TopBiasesSection: React.FC<TopBiasesSectionProps> = ({
  top5Biases,
  onSelectBias,
  selectedBiasName,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!top5Biases || top5Biases.length === 0) {
    return (
      <aside className="w-full lg:w-80 border border-[#2d2f36] bg-[#16181d] p-6 flex flex-col rounded-lg">
        <h2 className="text-xs uppercase tracking-widest text-[#888] font-bold mb-4">
          Top 5 Detected Biases
        </h2>
        <div className="text-xs text-[#666] italic py-8 text-center">
          No input text analyzed yet. Type or paste text on the left and click "Rerun Detection" to rank top 5 biases.
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-80 shrink-0 border border-[#2d2f36] bg-[#16181d] p-5 sm:p-6 flex flex-col rounded-lg text-[#e0e0e0]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-widest text-[#888] font-bold">
          Top 5 Detected Biases
        </h2>
        <span className="text-[10px] font-mono text-[#888]">Rank #1 - #5</span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {top5Biases.slice(0, 5).map((bias, idx) => {
          const isExpanded = expandedIndex === idx;
          const isSelected = selectedBiasName?.toLowerCase() === bias.biasName.toLowerCase();
          const isOver80 = bias.rating >= 80;

          return (
            <div
              key={idx}
              className={`p-3.5 bg-[#21232b] border rounded-lg transition-all ${
                isSelected
                  ? 'border-red-500 bg-[#282a35] shadow-md'
                  : isOver80
                  ? 'border-[#3d3f46] hover:border-red-500/50'
                  : 'border-[#3d3f46] opacity-60 hover:opacity-100'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => {
                  setExpandedIndex(isExpanded ? null : idx);
                  if (onSelectBias) {
                    onSelectBias(isSelected ? '' : bias.biasName);
                  }
                }}
                className="cursor-pointer select-none"
              >
                <div className="flex justify-between items-center mb-1.5 gap-2">
                  <span className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                    <span className="text-[10px] text-[#888] font-mono">#{idx + 1}</span>
                    <span className="truncate">{bias.biasName}</span>
                  </span>
                  <span className={`text-xs font-mono font-bold shrink-0 ${isOver80 ? 'text-red-500' : 'text-[#888]'}`}>
                    {bias.rating}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-[#12141a] rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-500 ${isOver80 ? 'bg-red-500' : 'bg-[#4d4f56]'}`}
                    style={{ width: `${Math.min(100, Math.max(5, bias.rating))}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#888]">
                  <span className="line-clamp-1 text-[11px] text-[#aaa]">
                    {bias.definition}
                  </span>
                  <span className="shrink-0 ml-1 text-[#666]">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#3d3f46] space-y-2 text-xs">
                  {bias.highestSnippet && (
                    <div className="bg-[#16181d] p-2 rounded border border-[#2d2f36]">
                      <span className="text-[10px] uppercase font-bold text-red-400 block mb-0.5">
                        Strongest Text Match:
                      </span>
                      <p className="italic text-[#ddd] text-[11px]">"{bias.highestSnippet}"</p>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#888] block mb-0.5">
                      Column B Definition:
                    </span>
                    <p className="text-[#bbb] text-[11px] leading-relaxed">
                      {bias.definition}
                    </p>
                  </div>

                  {bias.exampleStatement && (
                    <div className="text-[10px] text-[#888] pt-1">
                      <span className="text-red-400 font-semibold uppercase">Dataset Example:</span>
                      <p className="italic text-[#aaa] mt-0.5">"{bias.exampleStatement}"</p>
                    </div>
                  )}

                  {bias.counterexampleStatement && (
                    <div className="text-[10px] text-[#888] pt-1">
                      <span className="text-emerald-400 font-semibold uppercase">Counterexample:</span>
                      <p className="italic text-[#aaa] mt-0.5">"{bias.counterexampleStatement}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-[#2d2f36]">
        <div className="text-[10px] text-[#666] leading-tight">
          Based on current model weights trained on Col-C/B/E datasets (185 Biases). Highlighted segments represent confidence thresholds &gt; 80%.
        </div>
      </div>
    </aside>
  );
};
