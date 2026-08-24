export interface BiasEntry {
  id: string;
  columnB_definition: string;
  columnC_biasName: string;
  columnE_type: 'Example' | 'Counterexample';
  columnF_statement: string;
  category?: string;
  quadrant?: string;
  reliability?: number;
  url?: string;
}

export interface CompiledBias {
  biasName: string;
  definition: string;
  quadrant: string;
  category: string;
  avgReliability: number;
  exampleCount: number;
  counterexampleCount: number;
  totalCount: number;
  primaryExample: string;
  primaryCounterexample: string;
  topExamples?: Array<{
    id: string;
    type: string;
    statement: string;
    reliability: number;
    verdict?: string;
    url?: string;
  }>;
  topCounterexamples?: Array<{
    id: string;
    type: string;
    statement: string;
    reliability: number;
    verdict?: string;
    url?: string;
  }>;
}

export interface BiasDetection {
  id: string;
  spanText: string;
  startIndex: number;
  endIndex: number;
  biasName: string;
  confidenceScore: number; // 0 to 100
  definition: string;
  explanation: string;
  isGreater80: boolean;
  type?: 'Example' | 'Counterexample';
  exampleStatement?: string;
  counterexampleStatement?: string;
  category?: string;
  quadrant?: string;
}

export interface BiasRatingSummary {
  biasName: string;
  definition: string;
  rating: number; // 0 to 100
  frequency: number;
  highestSnippet: string;
  typeLabel?: string;
  exampleStatement?: string;
  counterexampleStatement?: string;
  category?: string;
  quadrant?: string;
}

export interface AnalysisResponse {
  originalText: string;
  detections: BiasDetection[];
  top5Biases: BiasRatingSummary[];
  overallBiasScore: number;
  wordCount: number;
  flagsCount: number;
  neutralityScore: number;
  biasIntensity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  analyzedAt: string;
}

