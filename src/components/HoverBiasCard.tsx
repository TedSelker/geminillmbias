import React from 'react';
import { BiasDetection } from '../types';
import { AlertTriangle, BookOpen, Quote, CheckCircle2 } from 'lucide-react';

interface HoverBiasCardProps {
  detection: BiasDetection;
  position: { x: number; y: number } | null;
}

export const HoverBiasCard: React.FC<HoverBiasCardProps> = ({ detection, position }) => {
  if (!position) return null;

  // Keep popover inside viewport boundaries
  const left = Math.min(Math.max(16, position.x - 140), window.innerWidth - 380);
  const top = Math.max(16, position.y - 8);

  return (
    <div
      style={{ left: `${left}px`, top: `${top}px` }}
      className="fixed z-50 w-84 max-w-[calc(100vw-32px)] bg-[#1a1c23] border border-red-500 p-4 shadow-2xl rounded-md text-[#e0e0e0] animate-in fade-in zoom-in-95 duration-150 pointer-events-none font-sans"
    >
      {/* Bias Name & Confidence */}
      <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-[#2d2f36]">
        <div>
          <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
            Detected: {detection.biasName} ({detection.confidenceScore}%)
          </div>
          {detection.category && (
            <div className="text-[10px] text-[#888] font-mono">
              {detection.category} {detection.quadrant ? `• ${detection.quadrant}` : ''}
            </div>
          )}
        </div>
        <div className="shrink-0 bg-red-950/80 px-2 py-0.5 rounded border border-red-800 text-red-400 font-mono text-xs font-bold">
          &gt;80% Threshold
        </div>
      </div>

      {/* Flagged Snippet Quote */}
      <div className="text-xs text-white mb-2 italic bg-[#12141a] p-2 rounded border border-[#2d2f36] leading-relaxed">
        "{detection.spanText}"
      </div>

      {/* Column B Definition */}
      <div className="text-[11px] text-[#aaa] leading-snug space-y-1 mb-2">
        <span className="text-[#888] font-bold uppercase text-[10px] block">
          Definition (Column B):
        </span>
        <p className="text-[#ccc]">{detection.definition}</p>
      </div>

      {/* Explanation reasoning */}
      {detection.explanation && (
        <div className="text-[11px] text-red-300/90 leading-snug pt-1.5 border-t border-[#2d2f36]">
          <span className="text-[#888] font-bold uppercase text-[10px] block mb-0.5">
            Model Reasoning:
          </span>
          <p>{detection.explanation}</p>
        </div>
      )}

      {/* Dataset Statement Citation */}
      {(detection.exampleStatement || detection.counterexampleStatement) && (
        <div className="pt-2 mt-2 border-t border-[#2d2f36] space-y-1">
          {detection.exampleStatement && (
            <div className="text-[10px] text-[#888]">
              <span className="text-red-400 font-semibold uppercase">Dataset Example (Col F):</span>
              <p className="italic text-[#aaa] mt-0.5 line-clamp-2">"{detection.exampleStatement}"</p>
            </div>
          )}
          {detection.counterexampleStatement && (
            <div className="text-[10px] text-[#888] pt-1">
              <span className="text-emerald-400 font-semibold uppercase">Counterexample:</span>
              <p className="italic text-[#aaa] mt-0.5 line-clamp-2">"{detection.counterexampleStatement}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
