import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TextInputBox } from './components/TextInputBox';
import { AnnotatedTextReader } from './components/AnnotatedTextReader';
import { TopBiasesSection } from './components/TopBiasesSection';
import { OverallStatsCard } from './components/OverallStatsCard';
import { DatasetViewerModal } from './components/DatasetViewerModal';
import { INITIAL_BIAS_DATASET } from './data/biasDataset';
import { BiasEntry, AnalysisResponse } from './types';
import { AlertCircle, Terminal, HelpCircle } from 'lucide-react';

export default function App() {
  // Empty initial text as explicitly requested ("don't put in an intial example any more")
  const [inputText, setInputText] = useState<string>('');
  const [dataset, setDataset] = useState<BiasEntry[]>(INITIAL_BIAS_DATASET);
  const [isDatasetOpen, setIsDatasetOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [selectedBiasName, setSelectedBiasName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial dataset from server if available
  useEffect(() => {
    async function loadDataset() {
      try {
        const res = await fetch('/api/bias-dataset');
        if (res.ok) {
          const data = await res.json();
          if (data.dataset && Array.isArray(data.dataset)) {
            setDataset(data.dataset);
          }
        }
      } catch (err) {
        console.warn('Using local bias dataset:', err);
      }
    }
    loadDataset();
  }, []);

  const runAnalysis = async (textToAnalyze: string) => {
    if (!textToAnalyze || !textToAnalyze.trim()) {
      setErrorMessage('Please enter or paste text to perform cognitive bias detection.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-bias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          dataset: dataset,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const result: AnalysisResponse = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      console.error('Error executing bias analysis:', err);
      setErrorMessage('Failed to complete machine learning analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBiasRule = (newRule: BiasEntry) => {
    setDataset((prev) => [newRule, ...prev]);
  };

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
    runAnalysis(sampleText);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#e0e0e0] flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* High Density Header */}
      <Header
        onOpenDataset={() => setIsDatasetOpen(true)}
        datasetCount={dataset.length}
      />

      {/* Main High Density Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left / Center Section: Input Text Analysis & Annotations */}
        <section className="flex-1 flex flex-col p-4 sm:p-6 bg-[#0f1115] space-y-4 overflow-y-auto">
          {/* Input Text Box */}
          <TextInputBox
            value={inputText}
            onChange={setInputText}
            onAnalyze={() => runAnalysis(inputText)}
            isLoading={isLoading}
            onSelectSample={handleSelectSample}
          />

          {errorMessage && (
            <div className="bg-red-950/80 border border-red-800 text-red-200 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Analysis Results View */}
          {analysis ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Evaluated Text with Red Spans and Dwell Hover Card */}
              <AnnotatedTextReader
                originalText={analysis.originalText}
                detections={analysis.detections}
                highlightedBiasName={selectedBiasName}
              />

              {/* High Density Metric Cards */}
              <OverallStatsCard analysis={analysis} />
            </div>
          ) : (
            <div className="bg-[#16181d] border border-[#2d2f36] p-8 rounded-lg text-center space-y-3 shadow-inner">
              <div className="w-10 h-10 mx-auto rounded bg-[#21232b] border border-[#3d3f46] flex items-center justify-center text-red-500 font-mono text-lg font-bold">
                Σ
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Awaiting Input for Cognitive Bias Detection
              </h3>
              <p className="text-xs text-[#888] max-w-lg mx-auto leading-relaxed">
                Paste any text in the input box above or choose a test preset to run the 185-bias ML classifier. Text spans rated at <span className="text-red-400 font-semibold">&gt;80% will be highlighted in red</span> with dwell definitions and top 5 ranking.
              </p>
            </div>
          )}
        </section>

        {/* Right Section: Top 5 Detected Biases Sidebar */}
        <TopBiasesSection
          top5Biases={analysis?.top5Biases || []}
          onSelectBias={(biasName) => setSelectedBiasName(biasName)}
          selectedBiasName={selectedBiasName}
        />
      </main>

      {/* Dataset & Schema Modal */}
      <DatasetViewerModal
        isOpen={isDatasetOpen}
        onClose={() => setIsDatasetOpen(false)}
        dataset={dataset}
        onAddBias={handleAddBiasRule}
      />

      {/* High Density Footer Bar */}
      <footer className="border-t border-[#2d2f36] bg-[#16181d] px-6 py-2 flex items-center justify-between text-[11px] text-[#666]">
        <div className="flex items-center gap-4">
          <span>Model: 185 Biases &bull; 7,656 Training Pairs</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">Columns: B (Definition) &bull; C (Bias) &bull; E (Label) &bull; F (Statement)</span>
        </div>
        <div className="font-mono text-[#888]">
          Threshold: &gt;80% (Red Highlight)
        </div>
      </footer>
    </div>
  );
}
