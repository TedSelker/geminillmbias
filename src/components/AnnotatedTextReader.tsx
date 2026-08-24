import React, { useState } from 'react';
import { BiasDetection } from '../types';
import { HoverBiasCard } from './HoverBiasCard';
import { AlertCircle, MousePointer } from 'lucide-react';

interface AnnotatedTextReaderProps {
  originalText: string;
  detections: BiasDetection[];
  highlightedBiasName?: string | null;
}

export const AnnotatedTextReader: React.FC<AnnotatedTextReaderProps> = ({
  originalText,
  detections,
  highlightedBiasName,
}) => {
  const [activeDetection, setActiveDetection] = useState<BiasDetection | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  if (!originalText || !originalText.trim()) {
    return null;
  }

  // Segment text into spans based on detections
  const renderTextSpans = () => {
    if (!detections || detections.length === 0) {
      return <p className="text-[#e0e0e0] leading-relaxed font-mono whitespace-pre-wrap">{originalText}</p>;
    }

    // Filter detections with valid spans
    const validDetections = detections
      .filter(d => d.spanText && d.spanText.trim().length > 0)
      .sort((a, b) => b.confidenceScore - a.confidenceScore);

    // Split original text into sentences or paragraphs and attach detections
    const sentences = originalText.split(/(\n+|(?<=[.!?])\s+)/);

    return (
      <div className="leading-relaxed font-mono text-sm text-[#e0e0e0] space-y-2 whitespace-pre-wrap">
        {sentences.map((part, pIdx) => {
          if (!part.trim()) {
            return <span key={pIdx}>{part}</span>;
          }

          // Check if this sentence/part matches any detection
          const matchingDetection = validDetections.find(
            d => d.spanText && (part.toLowerCase().includes(d.spanText.toLowerCase()) || d.spanText.toLowerCase().includes(part.toLowerCase().trim()))
          );

          if (matchingDetection) {
            const isGreaterThan80 = matchingDetection.confidenceScore > 80 || matchingDetection.isGreater80;
            const isSelectedFilter = highlightedBiasName && matchingDetection.biasName.toLowerCase() === highlightedBiasName.toLowerCase();

            return (
              <span
                key={pIdx}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setActiveDetection(matchingDetection);
                  setHoverPos({ x: rect.left, y: rect.bottom + 6 });
                }}
                onMouseMove={(e) => {
                  setHoverPos({ x: e.clientX, y: e.clientY - 100 });
                }}
                onMouseLeave={() => {
                  setActiveDetection(null);
                  setHoverPos(null);
                }}
                className={`inline relative rounded-xs px-1 py-0.5 transition-all duration-150 cursor-help ${
                  isGreaterThan80
                    ? 'bg-red-900/50 text-red-400 border-b-2 border-red-500 font-medium hover:bg-red-800/70'
                    : 'bg-amber-950/40 text-amber-300 border-b border-amber-600/70 hover:bg-amber-900/50'
                } ${isSelectedFilter ? 'ring-2 ring-red-400 ring-offset-1 ring-offset-[#16181d]' : ''}`}
              >
                {part}
                {isGreaterThan80 && (
                  <sup className="ml-1 px-1 py-0.2 bg-red-600 text-white font-mono font-bold text-[9px] rounded-xs inline-flex items-center">
                    {matchingDetection.confidenceScore}% {matchingDetection.biasName}
                  </sup>
                )}
              </span>
            );
          }

          return <span key={pIdx}>{part}</span>;
        })}
      </div>
    );
  };

  const countOver80 = detections.filter(d => d.confidenceScore > 80 || d.isGreater80).length;

  return (
    <div className="bg-[#16181d] border border-[#2d2f36] p-5 sm:p-6 rounded-lg relative shadow-inner text-[#e0e0e0]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2d2f36]">
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-widest text-[#888] font-bold">
            Evaluated Text with Cognitive Bias Annotations
          </label>
          {countOver80 > 0 && (
            <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-mono font-bold">
              {countOver80} Flags &gt;80% (Red)
            </span>
          )}
        </div>

        <div className="text-[11px] text-[#888] flex items-center gap-1">
          <MousePointer className="w-3 h-3 text-red-400" />
          <span>Dwell/hover over red text to inspect bias &amp; definition</span>
        </div>
      </div>

      <div className="min-h-[120px] max-h-[360px] overflow-y-auto pr-1">
        {renderTextSpans()}
      </div>

      {activeDetection && (
        <HoverBiasCard
          detection={activeDetection}
          position={hoverPos}
        />
      )}
    </div>
  );
};
