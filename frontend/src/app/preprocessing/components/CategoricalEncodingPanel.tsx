'use client';

import React, { useState } from 'react';
import { Dataset } from '../../dataset-management/components/datasetData';
import { Tag, Info } from 'lucide-react';

interface Props {
  dataset: Dataset;
  onConfigure: (detail: string) => void;
}

const ENCODING_METHODS = [
  { id: 'onehot', label: 'One-Hot Encoding', desc: 'Creates binary columns per category. Best for low cardinality.' },
  { id: 'label', label: 'Label Encoding', desc: 'Assigns integer to each category. Suitable for ordinal data.' },
  { id: 'ordinal', label: 'Ordinal Encoding', desc: 'User-defined order mapping. Requires manual ordering.' },
  { id: 'target', label: 'Target Encoding', desc: 'Replaces category with mean of target. Reduces dimensionality.' },
  { id: 'binary', label: 'Binary Encoding', desc: 'Converts to binary digits. Efficient for high cardinality.' },
  { id: 'frequency', label: 'Frequency Encoding', desc: 'Replaces category with its frequency. Simple and effective.' },
];

const CAT_COLUMNS = [
  { name: 'city', cardinality: 48, recommended: 'Binary Encoding', method: 'onehot', override: false },
  { name: 'education', cardinality: 5, recommended: 'Ordinal Encoding', method: 'ordinal', override: false },
  { name: 'marital_status', cardinality: 4, recommended: 'One-Hot Encoding', method: 'onehot', override: false },
  { name: 'product_category', cardinality: 12, recommended: 'Target Encoding', method: 'target', override: false },
  { name: 'region', cardinality: 7, recommended: 'One-Hot Encoding', method: 'onehot', override: false },
];

export default function CategoricalEncodingPanel({ dataset, onConfigure }: Props) {
  const [globalMethod, setGlobalMethod] = useState('onehot');
  const [columns, setColumns] = useState(CAT_COLUMNS);
  const [maxCardinality, setMaxCardinality] = useState(20);
  const [applied, setApplied] = useState(false);

  const globalLabel = ENCODING_METHODS.find((m) => m.id === globalMethod)?.label ?? '';

  const updateColumn = (idx: number, patch: Partial<typeof CAT_COLUMNS[0]>) => {
    setColumns((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const applyRecommended = () => {
    setColumns((prev) =>
      prev.map((c) => ({
        ...c,
        method: c.override ? c.method : ENCODING_METHODS.find((m) => m.label === c.recommended)?.id ?? c.method,
      }))
    );
  };

  const handleApply = () => {
    setApplied(true);
    const overrides = columns.filter((c) => c.override).length;
    onConfigure(`${globalLabel} · ${overrides} overrides · cardinality cap ${maxCardinality}`);
  };

  return (
    <div className="space-y-4">
      {/* Global config */}
      <div className="bg-surface-1 border border-border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-copper" />
            <span className="text-sm font-600 text-foreground">Categorical Encoding Configuration</span>
          </div>
          {applied && (
            <span className="text-2xs px-2 py-0.5 rounded border border-green-signal text-green-signal font-mono-data">
              Configured
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">
              Default Encoding Method
            </label>
            <select
              value={globalMethod}
              onChange={(e) => setGlobalMethod(e.target.value)}
              className="w-full bg-surface-2 border border-border text-foreground text-xs rounded px-2 py-1.5 font-mono-data focus:outline-none focus:border-copper"
            >
              {ENCODING_METHODS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">
              Max Cardinality for One-Hot
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range" min={5} max={100} step={5}
                value={maxCardinality}
                onChange={(e) => setMaxCardinality(Number(e.target.value))}
                className="flex-1 accent-copper"
              />
              <span className="text-xs font-mono-data text-copper w-8 text-right">{maxCardinality}</span>
            </div>
          </div>
        </div>

        {/* Method cards */}
        <div className="grid grid-cols-3 gap-2">
          {ENCODING_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setGlobalMethod(m.id)}
              className={`p-3 rounded border text-left transition-all duration-150 ${
                globalMethod === m.id
                  ? 'border-copper bg-copper/10' :'border-border bg-surface-2 hover:border-muted-foreground'
              }`}
            >
              <div className={`text-xs font-600 mb-1 ${globalMethod === m.id ? 'text-copper' : 'text-foreground'}`}>
                {m.label}
              </div>
              <div className="text-2xs text-muted-foreground leading-relaxed">{m.desc}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={applyRecommended} className="btn-ghost text-xs gap-1.5">
            Apply AI Recommendations
          </button>
          <button onClick={handleApply} className="btn-primary text-xs gap-1.5">
            Confirm Configuration
          </button>
        </div>
      </div>

      {/* Column table */}
      <div className="bg-surface-1 border border-border rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs font-600 text-foreground">
            Categorical Columns
            <span className="ml-2 text-muted-foreground font-normal">({columns.length} detected)</span>
          </span>
          <div className="flex items-center gap-1 text-2xs text-muted-foreground font-mono-data">
            <Info size={11} />
            AI recommendations shown per column
          </div>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {['Column', 'Cardinality', 'AI Recommendation', 'Applied Method', 'Override'].map((h) => (
                <th key={h} className="text-left px-4 py-2 text-muted-foreground font-mono-data font-400 uppercase tracking-wider text-2xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columns.map((col, idx) => (
              <tr key={col.name} className={`border-b border-border last:border-0 ${col.override ? 'bg-surface-2' : ''}`}>
                <td className="px-4 py-2.5 font-mono-data text-foreground">{col.name}</td>
                <td className="px-4 py-2.5">
                  <span className={`font-mono-data ${col.cardinality > 20 ? 'text-amber-signal' : 'text-muted-foreground'}`}>
                    {col.cardinality}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-2xs px-1.5 py-0.5 rounded bg-cyan-700/20 text-cyan-accent border border-cyan-700/40 font-mono-data">
                    {col.recommended}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  {col.override ? (
                    <select
                      value={col.method}
                      onChange={(e) => updateColumn(idx, { method: e.target.value })}
                      className="bg-surface-3 border border-copper/40 text-foreground text-xs rounded px-2 py-1 font-mono-data focus:outline-none focus:border-copper"
                    >
                      {ENCODING_METHODS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                  ) : (
                    <span className="font-mono-data text-muted-foreground">
                      {ENCODING_METHODS.find((m) => m.id === col.method)?.label ?? col.method}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => updateColumn(idx, { override: !col.override })}
                    className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${col.override ? 'bg-copper' : 'bg-surface-3'}`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-foreground transition-all duration-200 ${col.override ? 'left-4.5' : 'left-0.5'}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
