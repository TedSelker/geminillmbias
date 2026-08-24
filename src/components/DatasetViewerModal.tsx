import React, { useState } from 'react';
import { BiasEntry } from '../types';
import { ALL_BIASES, COMPILED_BIASES_SUMMARY } from '../data/biasDataset';
import { X, Search, Database, Plus, CheckCircle, AlertOctagon, ExternalLink, Filter } from 'lucide-react';

interface DatasetViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: BiasEntry[];
  onAddBias: (newBias: BiasEntry) => void;
}

export const DatasetViewerModal: React.FC<DatasetViewerModalProps> = ({
  isOpen,
  onClose,
  dataset,
  onAddBias,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuadrant, setFilterQuadrant] = useState<string>('All');
  const [filterType, setFilterType] = useState<'All' | 'Example' | 'Counterexample'>('All');
  const [activeTab, setActiveTab] = useState<'taxonomy' | 'statements'>('taxonomy');
  const [showAddForm, setShowAddForm] = useState(false);

  // New custom bias form state
  const [newBiasName, setNewBiasName] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newType, setNewType] = useState<'Example' | 'Counterexample'>('Example');
  const [newStatement, setNewStatement] = useState('');
  const [newCategory, setNewCategory] = useState('');

  if (!isOpen) return null;

  // Filter compiled 185 taxonomy
  const filteredTaxonomy = ALL_BIASES.filter((b) => {
    const matchesSearch =
      b.biasName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.quadrant.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesQuadrant = filterQuadrant === 'All' || b.quadrant === filterQuadrant;
    return matchesSearch && matchesQuadrant;
  });

  // Filter statement entries
  const filteredStatements = dataset.filter((entry) => {
    const matchesSearch =
      entry.columnC_biasName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.columnB_definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.columnF_statement.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || entry.columnE_type === filterType;
    return matchesSearch && matchesType;
  });

  const quadrants = ['All', ...Array.from(new Set(ALL_BIASES.map(b => b.quadrant).filter(Boolean)))];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBiasName.trim() || !newDefinition.trim() || !newStatement.trim()) {
      return;
    }

    const created: BiasEntry = {
      id: `custom-bias-${Date.now()}`,
      columnC_biasName: newBiasName.trim(),
      columnB_definition: newDefinition.trim(),
      columnE_type: newType,
      columnF_statement: newStatement.trim(),
      category: newCategory.trim() || 'Custom Rule',
      quadrant: 'Custom',
      reliability: 90,
    };

    onAddBias(created);
    setNewBiasName('');
    setNewDefinition('');
    setNewStatement('');
    setNewCategory('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#16181d] border border-[#2d2f36] rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl text-[#e0e0e0] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#2d2f36] flex items-center justify-between bg-[#0f1115]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center font-bold text-white text-sm">
              Σ
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                Cognitive Bias Dataset &amp; Taxonomy
                <span className="text-xs px-2 py-0.5 bg-[#21232b] rounded border border-[#3d3f46] text-[#888] font-mono">
                  {COMPILED_BIASES_SUMMARY.totalBiases} Biases &bull; {COMPILED_BIASES_SUMMARY.totalRows} Samples
                </span>
              </h3>
              <p className="text-[11px] text-[#888]">
                Columns: Quadrant &bull; Category &bull; Column C (Bias Name) &bull; Column B (Definition) &bull; Column E (Type) &bull; Column F (Statement)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bias Rule</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[#21232b] text-[#888] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-[#12141a] border-b border-[#2d2f36] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-red-400">
              Add New Custom Bias Training Definition
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase text-[#888] font-bold block mb-1">
                  Column C: Specific Bias Name
                </label>
                <input
                  type="text"
                  value={newBiasName}
                  onChange={(e) => setNewBiasName(e.target.value)}
                  placeholder="e.g., Status Quo Bias"
                  className="w-full bg-[#16181d] border border-[#2d2f36] p-2 text-xs rounded text-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#888] font-bold block mb-1">
                  Column E: Type / Label
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-[#16181d] border border-[#2d2f36] p-2 text-xs rounded text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="Example">Example</option>
                  <option value="Counterexample">Counterexample</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#888] font-bold block mb-1">
                  Category / Group
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g., Decision Making"
                  className="w-full bg-[#16181d] border border-[#2d2f36] p-2 text-xs rounded text-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#888] font-bold block mb-1">
                Column B: Bias Definition
              </label>
              <input
                type="text"
                value={newDefinition}
                onChange={(e) => setNewDefinition(e.target.value)}
                placeholder="The psychological or logical definition of this bias..."
                className="w-full bg-[#16181d] border border-[#2d2f36] p-2 text-xs rounded text-white focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#888] font-bold block mb-1">
                Column F: Example Statement (Statement demonstrating or refuting bias)
              </label>
              <textarea
                rows={2}
                value={newStatement}
                onChange={(e) => setNewStatement(e.target.value)}
                placeholder="A real-world example statement demonstrating this cognitive bias..."
                className="w-full bg-[#16181d] border border-[#2d2f36] p-2 text-xs rounded text-white focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 bg-[#21232b] hover:bg-[#2d2f36] rounded text-xs text-[#aaa]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
              >
                Save to Classifier Model
              </button>
            </div>
          </form>
        )}

        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-[#2d2f36] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#12141a]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#666]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search biases, definitions, statements..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#16181d] border border-[#2d2f36] rounded text-xs text-white placeholder-[#555] focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex rounded border border-[#2d2f36] bg-[#16181d] p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('taxonomy')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'taxonomy' ? 'bg-red-600 text-white font-bold' : 'text-[#888] hover:text-white'
                }`}
              >
                Biases ({ALL_BIASES.length})
              </button>
              <button
                onClick={() => setActiveTab('statements')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'statements' ? 'bg-red-600 text-white font-bold' : 'text-[#888] hover:text-white'
                }`}
              >
                Statements ({dataset.length})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeTab === 'taxonomy' && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[10px] text-[#666] uppercase font-bold">Quadrant:</span>
                <select
                  value={filterQuadrant}
                  onChange={(e) => setFilterQuadrant(e.target.value)}
                  className="bg-[#16181d] border border-[#2d2f36] rounded px-2 py-1 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  {quadrants.map((q, idx) => (
                    <option key={idx} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === 'statements' && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[10px] text-[#666] uppercase font-bold">Type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-[#16181d] border border-[#2d2f36] rounded px-2 py-1 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Example">Examples</option>
                  <option value="Counterexample">Counterexamples</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content Table / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'taxonomy' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTaxonomy.map((bias, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#21232b] border border-[#2d2f36] rounded-lg hover:border-red-500/40 transition-all text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {bias.biasName}
                      </h4>
                      <div className="text-[10px] text-[#888] font-mono mt-0.5">
                        {bias.category} &bull; <span className="text-red-400">{bias.quadrant}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#16181d] border border-[#3d3f46] text-[#aaa] font-mono shrink-0">
                      {bias.totalCount} entries &bull; {bias.avgReliability}% avg
                    </span>
                  </div>

                  <p className="text-[#ccc] text-[11px] leading-relaxed bg-[#16181d] p-2 rounded border border-[#2d2f36]">
                    <span className="text-[#666] font-bold block text-[9px] uppercase">Definition:</span>
                    {bias.definition}
                  </p>

                  {bias.primaryExample && (
                    <div className="text-[10px] text-[#aaa] bg-[#1a1c23] p-2 rounded border border-red-950">
                      <span className="text-red-400 font-bold uppercase text-[9px] block">Example Statement:</span>
                      <p className="italic line-clamp-2">"{bias.primaryExample}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredStatements.map((entry, idx) => (
                <div
                  key={entry.id || idx}
                  className="p-3 bg-[#21232b] border border-[#2d2f36] rounded-lg text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">
                      {entry.columnC_biasName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      entry.columnE_type === 'Example'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {entry.columnE_type}
                    </span>
                  </div>

                  <p className="italic text-[#ddd] text-[11px] bg-[#16181d] p-2 rounded border border-[#2d2f36]">
                    "{entry.columnF_statement}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#2d2f36] bg-[#0f1115] flex items-center justify-between text-xs text-[#666]">
          <span>Source: Google Drive Dataset &bull; 185 Biases</span>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-[#21232b] hover:bg-[#2d2f36] text-[#ddd] rounded text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
