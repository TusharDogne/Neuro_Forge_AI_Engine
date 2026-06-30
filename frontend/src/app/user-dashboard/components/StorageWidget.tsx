'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const StorageChart = dynamic(
  () => import('./StorageChart'),
  { ssr: false, loading: () => <div className="animate-pulse bg-surface-2 rounded h-[120px] w-full" /> }
);

const storageBreakdown = [
  { id: 'stor-datasets', label: 'Datasets', used: 48.2, color: 'bg-cyan-500' },
  { id: 'stor-models', label: 'Model Artifacts', used: 21.7, color: 'bg-copper-500' },
  { id: 'stor-reports', label: 'Reports', used: 6.4, color: 'bg-signal-blue' },
  { id: 'stor-logs', label: 'Experiment Logs', used: 4.1, color: 'bg-signal-amber' },
];

const total = 100;
const used = storageBreakdown?.reduce((s, b) => s + b?.used, 0);
const usedPct = ((used / total) * 100)?.toFixed(0);

export default function StorageWidget() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 card-elevation">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-600 text-foreground">Storage Usage</p>
        <span className={parseInt(usedPct) > 80 ? 'badge-red' : 'badge-muted'}>
          {usedPct}% used
        </span>
      </div>
      <StorageChart usedPct={parseInt(usedPct)} />
      <div className="flex items-center justify-between mb-3 mt-2">
        <span className="text-2xs text-muted-foreground font-mono-data">{used?.toFixed(1)} GB used</span>
        <span className="text-2xs text-muted-foreground font-mono-data">{total} GB quota</span>
      </div>
      {/* Breakdown */}
      <div className="space-y-2">
        {storageBreakdown?.map((item) => (
          <div key={item?.id} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-sm flex-shrink-0 ${item?.color}`} />
            <span className="text-2xs text-muted-foreground flex-1">{item?.label}</span>
            <span className="text-2xs font-mono-data text-foreground">{item?.used} GB</span>
          </div>
        ))}
      </div>
    </div>
  );
}