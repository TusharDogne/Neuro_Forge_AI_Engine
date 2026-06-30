'use client';

import React from 'react';
import { Dataset } from '../../dataset-management/components/datasetData';
import { Database, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  datasets: Dataset[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function PreprocessingDatasetSelector({ datasets, selectedId, onSelect }: Props) {
  const selected = datasets.find((d) => d.id === selectedId) ?? datasets[0];

  const healthColor = (score: number) => {
    if (score >= 80) return 'text-green-signal';
    if (score >= 60) return 'text-amber-signal';
    return 'text-red-signal';
  };

  return (
    <div className="bg-surface-1 border border-border rounded-md p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Database size={14} className="text-copper" />
          <span className="text-xs font-500 text-muted-foreground uppercase tracking-wider font-mono-data">
            Active Dataset
          </span>
        </div>

        {/* Dataset select */}
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="bg-surface-2 border border-border text-foreground text-xs rounded px-3 py-1.5 font-mono-data focus:outline-none focus:border-copper min-w-[260px]"
        >
          {datasets.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Stats strip */}
        <div className="flex items-center gap-4 ml-auto flex-wrap">
          <StatChip label="Rows" value={selected.rows} />
          <StatChip label="Cols" value={String(selected.cols)} />
          <StatChip label="Format" value={selected.format} />
          <StatChip label="Size" value={selected.size} />
          <div className="flex items-center gap-1.5">
            <span className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">Health</span>
            <span className={`text-xs font-600 font-mono-data ${healthColor(selected.healthScore)}`}>
              {selected.healthScore}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {selected.missingPct > 10 ? (
              <AlertTriangle size={12} className="text-amber-signal" />
            ) : (
              <CheckCircle2 size={12} className="text-green-signal" />
            )}
            <span className="text-xs font-mono-data text-muted-foreground">
              {selected.missingPct}% missing
            </span>
          </div>
          <span className={`text-2xs px-2 py-0.5 rounded font-mono-data border ${
            selected.status === 'Ready' ?'border-green-signal text-green-signal'
              : selected.status === 'Error' ?'border-red-signal text-red-signal' :'border-muted text-muted-foreground'
          }`}>
            {selected.status}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">{label}</span>
      <span className="text-xs font-600 font-mono-data text-foreground">{value}</span>
    </div>
  );
}
