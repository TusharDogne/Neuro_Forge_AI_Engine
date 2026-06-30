'use client';

import React from 'react';
import { Dataset } from '../../dataset-management/components/datasetData';
import { Database, ChevronDown } from 'lucide-react';

interface Props {
  datasets: Dataset[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const PT_COLORS: Record<string, string> = {
  Classification: 'text-cyan-accent border-cyan-700',
  Regression: 'text-copper border-copper-700',
  Clustering: 'text-amber-signal border-amber-600',
  'Time Series': 'text-blue-signal border-blue-600',
};

export default function AutoMLDatasetSelector({ datasets, selectedId, onSelect, disabled }: Props) {
  const selected = datasets.find((d) => d.id === selectedId) ?? datasets[0];

  return (
    <div className="bg-surface-1 border border-border rounded-md p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Database size={14} className="text-copper" />
          <span className="text-xs font-600 text-foreground">Dataset</span>
        </div>

        <div className="relative flex-1 min-w-[260px] max-w-[420px]">
          <select
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
            disabled={disabled}
            className="w-full appearance-none bg-surface-2 border border-border rounded px-3 py-2 text-xs text-foreground font-mono-data pr-8 focus:outline-none focus:border-copper disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {datasets.map((d) => (
              <option key={d.id} value={d.id ?? ''}>
                {d.name}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Dataset meta chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-2xs font-mono-data border rounded px-2 py-0.5 ${PT_COLORS[selected.problemType] ?? 'text-muted-foreground border-border'}`}>
            {selected.problemType}
          </span>
          <span className="text-2xs font-mono-data text-muted-foreground border border-border rounded px-2 py-0.5">
            {selected.rows} rows
          </span>
          <span className="text-2xs font-mono-data text-muted-foreground border border-border rounded px-2 py-0.5">
            {selected.cols} cols
          </span>
          <span className="text-2xs font-mono-data text-muted-foreground border border-border rounded px-2 py-0.5">
            {selected.size}
          </span>
          {selected.target && (
            <span className="text-2xs font-mono-data text-green-signal border border-green-signal/30 rounded px-2 py-0.5">
              target: {selected.target}
            </span>
          )}
          <span className={`text-2xs font-mono-data border rounded px-2 py-0.5 ${selected.status === 'Ready' ? 'text-green-signal border-green-signal/30' : selected.status === 'Error' ? 'text-red-signal border-red-signal/30' : 'text-muted-foreground border-border'}`}>
            {selected.status}
          </span>
        </div>
      </div>
    </div>
  );
}
