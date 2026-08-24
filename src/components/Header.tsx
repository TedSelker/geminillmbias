import React from 'react';
import { Database, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenDataset: () => void;
  datasetCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDataset, datasetCount }) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-[#2d2f36] bg-[#16181d] text-[#e0e0e0] sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white text-lg shadow-sm">
          Σ
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">
              BiasLens <span className="text-[#888] font-normal text-xs">v4.2.0</span>
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-[#21232b] rounded text-[10px] border border-[#2d2f36] text-[#aaa] font-mono">
              Model: Biases_C_B_F_Weights.bin
            </span>
          </div>
          <p className="text-[11px] text-[#888] hidden md:block">
            High Density Cognitive Bias Classifier &bull; Red Highlight &gt;80% &bull; Top 5 Biases Ranking
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs text-[#888] bg-[#0f1115] px-2.5 py-1 rounded border border-[#2d2f36]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-[11px] text-[#aaa]">ML Model: Active</span>
        </div>

        <button
          onClick={onOpenDataset}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#21232b] hover:bg-[#2d2f36] rounded text-xs border border-[#3d3f46] text-[#e0e0e0] font-medium transition-colors shadow-sm"
        >
          <Database className="w-3.5 h-3.5 text-red-400" />
          <span>Dataset ({datasetCount})</span>
        </button>
      </div>
    </header>
  );
};
