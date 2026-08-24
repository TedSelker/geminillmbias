import React from 'react';
import { AnalysisResponse } from '../types';

interface OverallStatsCardProps {
  analysis: AnalysisResponse;
}

export const OverallStatsCard: React.FC<OverallStatsCardProps> = ({ analysis }) => {
  const wordCount = analysis.wordCount || analysis.originalText.trim().split(/\s+/).filter(Boolean).length;
  const flagsCount = analysis.flagsCount !== undefined 
    ? analysis.flagsCount 
    : analysis.detections.filter(d => d.confidenceScore > 80 || d.isGreater80).length;
  
  const neutralityScore = analysis.neutralityScore !== undefined
    ? analysis.neutralityScore
    : Math.max(5, 100 - analysis.overallBiasScore);

  const biasIntensity = analysis.biasIntensity || (
    analysis.overallBiasScore > 85 ? 'Extreme' : analysis.overallBiasScore > 70 ? 'High' : 'Moderate'
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-3 bg-[#16181d] border border-[#2d2f36] rounded">
        <div className="text-[10px] uppercase text-[#666] mb-1 font-bold tracking-wider">Word Count</div>
        <div className="text-lg font-bold text-white font-mono">{wordCount}</div>
      </div>

      <div className="p-3 bg-[#16181d] border border-[#2d2f36] rounded">
        <div className="text-[10px] uppercase text-[#666] mb-1 font-bold tracking-wider">Bias Intensity</div>
        <div className={`text-lg font-bold font-mono ${
          biasIntensity === 'Extreme' ? 'text-red-500' :
          biasIntensity === 'High' ? 'text-red-400' :
          biasIntensity === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
        }`}>
          {biasIntensity}
        </div>
      </div>

      <div className="p-3 bg-[#16181d] border border-[#2d2f36] rounded">
        <div className="text-[10px] uppercase text-[#666] mb-1 font-bold tracking-wider">Total Flags (&gt;80%)</div>
        <div className="text-lg font-bold text-red-400 font-mono">{flagsCount}</div>
      </div>

      <div className="p-3 bg-[#16181d] border border-[#2d2f36] rounded">
        <div className="text-[10px] uppercase text-[#666] mb-1 font-bold tracking-wider">Neutrality Score</div>
        <div className={`text-lg font-bold font-mono ${
          neutralityScore < 30 ? 'text-yellow-500' : neutralityScore < 60 ? 'text-amber-400' : 'text-emerald-400'
        }`}>
          {neutralityScore}%
        </div>
      </div>
    </div>
  );
};
