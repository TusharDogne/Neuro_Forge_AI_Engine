'use client';

import React, { useState } from 'react';
import { Dataset } from '../../dataset-management/components/datasetData';
import { Settings2, Info } from 'lucide-react';

interface Props {
  dataset: Dataset;
  onConfigure: (detail: string) => void;
}

interface ColumnConfig {
  name: string;
  type: 'numerical' | 'categorical';
  missingPct: number;
  strategy: string;
  customValue: string;
  override: boolean;
}

const NUMERICAL_STRATEGIES = ['Mean', 'Median', 'Mode', 'Constant', 'Forward Fill', 'Drop Row'];
const CATEGORICAL_STRATEGIES = ['Mode', 'Constant', 'New Category', 'Drop Row'];

function generateColumns(dataset: Dataset): ColumnConfig[] {
  const names = [
    'age', 'income', 'credit_score', 'loan_amount', 'employment_years',
    'city', 'education', 'marital_status', 'product_category', 'region',
  ].slice(0, Math.min(dataset.cols, 10));

  return names.map((name, i) => ({
    name,
    type: i < 5 ? 'numerical' : 'categorical',
    missingPct: parseFloat((Math.random() * dataset.missingPct * 1.5).toFixed(1)),
    strategy: i < 5 ? 'Median' : 'Mode',
    customValue: '',
    override: false,
  }));
}

export default function NullValuePanel({ dataset, onConfigure }: Props) {
  const [columns, setColumns] = useState<ColumnConfig[]>(() => generateColumns(dataset));
  const [globalNumerical, setGlobalNumerical] = useState('Median');
  const [globalCategorical, setGlobalCategorical] = useState('Mode');
  const [dropThreshold, setDropThreshold] = useState(50);
  const [applied, setApplied] = useState(false);

  const applyGlobal = () => {
    setColumns((prev) =>
      prev.map((c) => ({
        ...c,
        strategy: c.override ? c.strategy : c.type === 'numerical' ? globalNumerical : globalCategorical,
      }))
    );
  };

  const updateColumn = (idx: number, patch: Partial<ColumnConfig>) => {
    setColumns((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const handleApply = () => {
    setApplied(true);
    const overrides = columns.filter((c) => c.override).length;
    onConfigure(`${globalNumerical}/${globalCategorical} · ${overrides} overrides · drop >${dropThreshold}%`);
  };

  const missingCols = columns.filter((c) => c.missingPct > 0);

  return (
    <div className="space-y-4">
      {/* Auto config panel */}
      <div className="bg-surface-1 border border-border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 size={14} className="text-copper" />
            <span className="text-sm font-600 text-foreground">Automated Null Handling</span>
          </div>
          {applied && (
            <span className="text-2xs px-2 py-0.5 rounded border border-green-signal text-green-signal font-mono-data">
              Configured
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">
              Numerical Strategy
            </label>
            <select
              value={globalNumerical}
              onChange={(e) => setGlobalNumerical(e.target.value)}
              className="w-full bg-surface-2 border border-border text-foreground text-xs rounded px-2 py-1.5 font-mono-data focus:outline-none focus:border-copper"
            >
              {NUMERICAL_STRATEGIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">
              Categorical Strategy
            </label>
            <select
              value={globalCategorical}
              onChange={(e) => setGlobalCategorical(e.target.value)}
              className="w-full bg-surface-2 border border-border text-foreground text-xs rounded px-2 py-1.5 font-mono-data focus:outline-none focus:border-copper"
            >
              {CATEGORICAL_STRATEGIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">
              Drop Column Threshold (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={10}
                max={90}
                value={dropThreshold}
                onChange={(e) => setDropThreshold(Number(e.target.value))}
                className="flex-1 accent-copper"
              />
              <span className="text-xs font-mono-data text-copper w-8 text-right">{dropThreshold}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={applyGlobal} className="btn-ghost text-xs gap-1.5">
            Apply Global Strategy
          </button>
          <button onClick={handleApply} className="btn-primary text-xs gap-1.5">
            Confirm Configuration
          </button>
        </div>
      </div>

      {/* Column-level overrides */}
      <div className="bg-surface-1 border border-border rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs font-600 text-foreground">
            Column-Level Overrides
            <span className="ml-2 text-muted-foreground font-normal">
              ({missingCols.length} columns with missing values)
            </span>
          </span>
          <div className="flex items-center gap-1 text-2xs text-muted-foreground font-mono-data">
            <Info size={11} />
            Toggle override to customize per column
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2 text-muted-foreground font-mono-data font-400 uppercase tracking-wider text-2xs">Column</th>
                <th className="text-left px-4 py-2 text-muted-foreground font-mono-data font-400 uppercase tracking-wider text-2xs">Type</th>
                <th className="text-left px-4 py-2 text-muted-foreground font-mono-data font-400 uppercase tracking-wider text-2xs">Missing %</th>
                <th className="text-left px-4 py-2 text-muted-foreground font-mono-data font-400 uppercase tracking-wider text-2xs">Strategy</th>
                <th className="text-left px-4 py-2 text-muted-foreground font-mono-data font-400 uppercase tracking-wider text-2xs">Override</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col, idx) => (
                <tr key={col.name} className={`border-b border-border last:border-0 ${col.override ? 'bg-surface-2' : ''}`}>
                  <td className="px-4 py-2.5 font-mono-data text-foreground">{col.name}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-2xs px-1.5 py-0.5 rounded font-mono-data ${
                      col.type === 'numerical' ?'bg-cyan-700/20 text-cyan-accent border border-cyan-700/40' :'bg-copper-700/20 text-copper border border-copper-700/40'
                    }`}>
                      {col.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${col.missingPct > 20 ? 'bg-red-signal' : col.missingPct > 5 ? 'bg-amber-signal' : 'bg-green-signal'}`}
                          style={{ width: `${Math.min(col.missingPct * 2, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono-data text-muted-foreground">{col.missingPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    {col.override ? (
                      <select
                        value={col.strategy}
                        onChange={(e) => updateColumn(idx, { strategy: e.target.value })}
                        className="bg-surface-3 border border-copper/40 text-foreground text-xs rounded px-2 py-1 font-mono-data focus:outline-none focus:border-copper"
                      >
                        {(col.type === 'numerical' ? NUMERICAL_STRATEGIES : CATEGORICAL_STRATEGIES).map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-mono-data text-muted-foreground">{col.strategy}</span>
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
    </div>
  );
}
