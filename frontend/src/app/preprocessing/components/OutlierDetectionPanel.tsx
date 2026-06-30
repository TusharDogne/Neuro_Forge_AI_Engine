'use client';

import React, { useState } from 'react';
import { Dataset } from '../../dataset-management/components/datasetData';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  dataset: Dataset;
  onConfigure: (detail: string) => void;
}

const DETECTION_METHODS = ['IQR (Interquartile Range)', 'Z-Score', 'Isolation Forest', 'DBSCAN'];
const TREATMENT_METHODS = ['Cap (Winsorize)', 'Remove Row', 'Replace with Median', 'Log Transform', 'Keep'];

function generateOutlierData() {
  const data = [];
  for (let i = 0; i < 60; i++) {
    data.push({ x: i, y: 50 + (Math.random() - 0.5) * 40 });
  }
  // inject outliers
  data.push({ x: 10, y: 140 }, { x: 25, y: -20 }, { x: 40, y: 155 }, { x: 55, y: -30 });
  return data;
}

const outlierData = generateOutlierData();

const COLUMNS = [
  { name: 'income', outliers: 14, pct: 3.2, method: 'IQR', treatment: 'Cap (Winsorize)', override: false },
  { name: 'loan_amount', outliers: 8, pct: 1.8, method: 'IQR', treatment: 'Cap (Winsorize)', override: false },
  { name: 'credit_score', outliers: 3, pct: 0.7, method: 'Z-Score', treatment: 'Replace with Median', override: false },
  { name: 'employment_years', outliers: 5, pct: 1.1, method: 'IQR', treatment: 'Cap (Winsorize)', override: false },
  { name: 'age', outliers: 2, pct: 0.4, method: 'Z-Score', treatment: 'Keep', override: false },
];

export default function OutlierDetectionPanel({ dataset, onConfigure }: Props) {
  const [detectionMethod, setDetectionMethod] = useState('IQR (Interquartile Range)');
  const [zThreshold, setZThreshold] = useState(3);
  const [iqrMultiplier, setIqrMultiplier] = useState(1.5);
  const [columns, setColumns] = useState(COLUMNS);
  const [applied, setApplied] = useState(false);

  const totalOutliers = columns.reduce((s, c) => s + c.outliers, 0);

  const updateColumn = (idx: number, patch: Partial<typeof COLUMNS[0]>) => {
    setColumns((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const handleApply = () => {
    setApplied(true);
    onConfigure(`${detectionMethod.split(' ')[0]} · ${totalOutliers} outliers · ${columns.filter(c => c.override).length} overrides`);
  };

  return (
    <div className="space-y-4">
      {/* Detection config */}
      <div className="bg-surface-1 border border-border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-signal" />
            <span className="text-sm font-600 text-foreground">Outlier Detection Configuration</span>
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
              Detection Method
            </label>
            <select
              value={detectionMethod}
              onChange={(e) => setDetectionMethod(e.target.value)}
              className="w-full bg-surface-2 border border-border text-foreground text-xs rounded px-2 py-1.5 font-mono-data focus:outline-none focus:border-copper"
            >
              {DETECTION_METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">
              Z-Score Threshold
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range" min={1} max={5} step={0.5}
                value={zThreshold}
                onChange={(e) => setZThreshold(Number(e.target.value))}
                className="flex-1 accent-copper"
              />
              <span className="text-xs font-mono-data text-copper w-6 text-right">{zThreshold}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">
              IQR Multiplier
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range" min={1} max={3} step={0.25}
                value={iqrMultiplier}
                onChange={(e) => setIqrMultiplier(Number(e.target.value))}
                className="flex-1 accent-copper"
              />
              <span className="text-xs font-mono-data text-copper w-6 text-right">{iqrMultiplier}</span>
            </div>
          </div>
        </div>

        {/* Scatter preview */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <TrendingUp size={12} className="text-muted-foreground" />
            <span className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">
              Outlier Scatter Preview — income
            </span>
          </div>
          <div className="h-32 bg-surface-2 rounded border border-border p-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <XAxis dataKey="x" hide />
                <YAxis dataKey="y" hide />
                <Tooltip
                  contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                  labelStyle={{ color: 'var(--muted-foreground)' }}
                />
                <ReferenceLine y={120} stroke="var(--red-signal)" strokeDasharray="3 3" strokeWidth={1} />
                <ReferenceLine y={10} stroke="var(--red-signal)" strokeDasharray="3 3" strokeWidth={1} />
                <Scatter
                  data={outlierData}
                  fill="var(--cyan-500)"
                  opacity={0.7}
                  r={3}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xs text-muted-foreground font-mono-data">
            Red dashed lines = IQR bounds · {totalOutliers} total outliers detected across all numerical columns
          </p>
        </div>

        <button onClick={handleApply} className="btn-primary text-xs gap-1.5">
          Confirm Configuration
        </button>
      </div>

      {/* Column treatment table */}
      <div className="bg-surface-1 border border-border rounded-md overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-xs font-600 text-foreground">
            Per-Column Treatment
            <span className="ml-2 text-muted-foreground font-normal">({totalOutliers} outliers detected)</span>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {['Column', 'Outliers', '% of Rows', 'Treatment', 'Override'].map((h) => (
                  <th key={h} className="text-left px-4 py-2 text-muted-foreground font-mono-data font-400 uppercase tracking-wider text-2xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {columns.map((col, idx) => (
                <tr key={col.name} className={`border-b border-border last:border-0 ${col.override ? 'bg-surface-2' : ''}`}>
                  <td className="px-4 py-2.5 font-mono-data text-foreground">{col.name}</td>
                  <td className="px-4 py-2.5 font-mono-data text-amber-signal">{col.outliers}</td>
                  <td className="px-4 py-2.5 font-mono-data text-muted-foreground">{col.pct}%</td>
                  <td className="px-4 py-2.5">
                    {col.override ? (
                      <select
                        value={col.treatment}
                        onChange={(e) => updateColumn(idx, { treatment: e.target.value })}
                        className="bg-surface-3 border border-copper/40 text-foreground text-xs rounded px-2 py-1 font-mono-data focus:outline-none focus:border-copper"
                      >
                        {TREATMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    ) : (
                      <span className="font-mono-data text-muted-foreground">{col.treatment}</span>
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
