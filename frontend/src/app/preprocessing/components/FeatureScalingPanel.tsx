'use client';

import React, { useState } from 'react';
import { Dataset } from '../../dataset-management/components/datasetData';
import { Scale, Info } from 'lucide-react';

interface Props {
  dataset: Dataset;
  onConfigure: (detail: string) => void;
}

const SCALING_METHODS = [
  {
    id: 'standard',
    label: 'StandardScaler',
    desc: 'Zero mean, unit variance. Best for normally distributed data.',
    formula: 'z = (x − μ) / σ',
  },
  {
    id: 'minmax',
    label: 'MinMaxScaler',
    desc: 'Scales features to [0, 1] range. Preserves zero values.',
    formula: 'x\' = (x − min) / (max − min)',
  },
  {
    id: 'robust',
    label: 'RobustScaler',
    desc: 'Uses median and IQR. Robust to outliers.',
    formula: 'x\' = (x − Q2) / (Q3 − Q1)',
  },
  {
    id: 'normalizer',
    label: 'Normalizer',
    desc: 'Scales each sample to unit norm. Good for sparse data.',
    formula: '||x|| = 1',
  },
  {
    id: 'log',
    label: 'Log Transform',
    desc: 'Reduces right skewness. Requires positive values.',
    formula: 'x\' = log(x + 1)',
  },
];

const NUMERICAL_COLS = ['age', 'income', 'credit_score', 'loan_amount', 'employment_years'];

export default function FeatureScalingPanel({ dataset, onConfigure }: Props) {
  const [selectedMethod, setSelectedMethod] = useState('standard');
  const [colOverrides, setColOverrides] = useState<Record<string, string>>({});
  const [excludedCols, setExcludedCols] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState(false);

  const method = SCALING_METHODS.find((m) => m.id === selectedMethod)!;

  const toggleExclude = (col: string) => {
    setExcludedCols((prev) => {
      const next = new Set(prev);
      next.has(col) ? next.delete(col) : next.add(col);
      return next;
    });
  };

  const setColOverride = (col: string, val: string) => {
    setColOverrides((prev) => ({ ...prev, [col]: val }));
  };

  const handleApply = () => {
    setApplied(true);
    const overrides = Object.keys(colOverrides).length;
    const excluded = excludedCols.size;
    onConfigure(`${method.label} · ${overrides} overrides · ${excluded} excluded`);
  };

  return (
    <div className="space-y-4">
      {/* Method selector */}
      <div className="bg-surface-1 border border-border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale size={14} className="text-cyan-accent" />
            <span className="text-sm font-600 text-foreground">Feature Scaling Method</span>
          </div>
          {applied && (
            <span className="text-2xs px-2 py-0.5 rounded border border-green-signal text-green-signal font-mono-data">
              Configured
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {SCALING_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`p-3 rounded border text-left transition-all duration-150 ${
                selectedMethod === m.id
                  ? 'border-copper bg-copper/10 text-foreground'
                  : 'border-border bg-surface-2 text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              <div className="text-xs font-600 mb-1">{m.label}</div>
              <div className="text-2xs font-mono-data opacity-70">{m.formula}</div>
            </button>
          ))}
        </div>

        {/* Selected method detail */}
        <div className="flex items-start gap-2 bg-surface-2 rounded p-3 border border-border">
          <Info size={13} className="text-cyan-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-foreground font-500">{method.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{method.desc}</p>
          </div>
        </div>

        <button onClick={handleApply} className="btn-primary text-xs gap-1.5">
          Confirm Configuration
        </button>
      </div>

      {/* Per-column overrides */}
      <div className="bg-surface-1 border border-border rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs font-600 text-foreground">
            Column-Level Overrides
            <span className="ml-2 text-muted-foreground font-normal">
              ({NUMERICAL_COLS.length} numerical columns)
            </span>
          </span>
          <span className="text-2xs text-muted-foreground font-mono-data">
            Toggle to exclude or override scaling method per column
          </span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {['Column', 'Global Method', 'Override Method', 'Exclude'].map((h) => (
                <th key={h} className="text-left px-4 py-2 text-muted-foreground font-mono-data font-400 uppercase tracking-wider text-2xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NUMERICAL_COLS.map((col) => {
              const isExcluded = excludedCols.has(col);
              const override = colOverrides[col];
              return (
                <tr key={col} className={`border-b border-border last:border-0 ${isExcluded ? 'opacity-40' : ''}`}>
                  <td className="px-4 py-2.5 font-mono-data text-foreground">{col}</td>
                  <td className="px-4 py-2.5 font-mono-data text-muted-foreground">{method.label}</td>
                  <td className="px-4 py-2.5">
                    {!isExcluded ? (
                      <select
                        value={override ?? ''}
                        onChange={(e) => setColOverride(col, e.target.value)}
                        className="bg-surface-2 border border-border text-foreground text-xs rounded px-2 py-1 font-mono-data focus:outline-none focus:border-copper"
                      >
                        <option value="">— Use Global —</option>
                        {SCALING_METHODS.map((m) => (
                          <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-muted-foreground font-mono-data">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => toggleExclude(col)}
                      className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${isExcluded ? 'bg-red-signal' : 'bg-surface-3'}`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-foreground transition-all duration-200 ${isExcluded ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
