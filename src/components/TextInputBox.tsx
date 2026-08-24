import React, { useState } from 'react';
import { Clipboard, Trash2, Sparkles, FileText, Check, Play } from 'lucide-react';

interface TextInputBoxProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onSelectSample: (sampleText: string) => void;
}

export const SAMPLE_TEXTS = [
  {
    title: 'Corporate & Sunk Cost Fallacy',
    text: `The local administration has always ignored the needs of the working class because they are fundamentally biased toward corporate interests. We see this in every single decision they make, such as the new park project. Nobody actually wants this park; it is just a way to funnel money to contractors. If we let this project go through, next thing you know, the entire city budget will be bankrupt by next year. It's the same pattern of failure we've seen since 1994, and it proves that they simply cannot be trusted with public funds. We must act now or lose our city forever.`,
  },
  {
    title: 'Investment & Overconfidence',
    text: `We have already spent $2.5 million and three years developing this legacy software platform, so we cannot stop now or all that money will be completely wasted. I watched a 10-minute video on financial forecasting last night and now I know far more than our senior risk managers with 20 years of experience. The competitor's asking price was $10,000,000, so buying them out for $8,000,000 is an unbelievable bargain even though their true asset value is $2,000,000.`,
  },
  {
    title: 'Political & Confirmation Bias',
    text: `I only read news outlets that agree with my political ideology because all other media networks are obviously biased, lying, and corrupt. When my preferred candidate wins an election, it is purely due to their brilliant leadership and honest principles, but when they lose, it is entirely because the voting process was rigged by secret enemies. Everyone I know on social media agrees with my opinions, so my views represent what 100% of normal citizens think.`,
  },
];

export const TextInputBox: React.FC<TextInputBoxProps> = ({
  value,
  onChange,
  onAnalyze,
  isLoading,
  onSelectSample,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChange(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  return (
    <div className="bg-[#0f1115] flex flex-col space-y-3">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-widest text-[#888] font-bold flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-red-500" />
          <span>Input Text Analysis</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePaste}
            className="text-xs px-2.5 py-1 bg-[#21232b] hover:bg-[#2d2f36] text-[#ccc] hover:text-white rounded border border-[#3d3f46] flex items-center gap-1 transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Clipboard className="w-3 h-3 text-[#888]" />}
            <span>{copied ? 'Pasted' : 'Paste'}</span>
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs px-2.5 py-1 bg-[#21232b] hover:bg-[#2d2f36] text-[#ccc] hover:text-red-400 rounded border border-[#3d3f46] flex items-center gap-1 transition-all"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAnalyze}
            disabled={isLoading || !value.trim()}
            className="text-xs px-3.5 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Classifying...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Rerun Detection</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Quick Load Chips */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <span className="text-[#888] text-[11px] font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-red-400" />
          Test Presets:
        </span>
        {SAMPLE_TEXTS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSample(sample.text)}
            className="text-[11px] px-2 py-0.5 rounded bg-[#16181d] hover:bg-[#21232b] text-[#aaa] hover:text-white border border-[#2d2f36] hover:border-red-500/50 transition-all font-mono truncate max-w-[200px]"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or type any paragraph or statements here to evaluate for cognitive biases (e.g., 'We've already spent $2 million, so we cannot stop now...', 'Nobody actually wants this project...', 'I knew it all along!'). Text rated >80% bias will be highlighted in red."
          className="w-full bg-[#16181d] border border-[#2d2f36] p-4 rounded-lg font-mono text-sm leading-relaxed text-[#e0e0e0] placeholder-[#555] focus:border-red-500 focus:outline-none transition-all shadow-inner"
        />
        <div className="absolute bottom-2.5 right-3 text-[11px] text-[#666] font-mono pointer-events-none">
          {value.length} chars &bull; {value.trim() ? value.trim().split(/\s+/).length : 0} words
        </div>
      </div>
    </div>
  );
};
