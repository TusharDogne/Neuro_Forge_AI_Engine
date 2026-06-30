'use client';

import React from 'react';
import { ProblemType, TrainingPhase } from '../page';
import { Dataset } from '../../dataset-management/components/datasetData';
import { Loader2, CheckCircle2, BarChart2, TrendingUp, Layers, Activity } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface Props {
  phase: TrainingPhase;
  detectedType: ProblemType | null;
  dataset: Dataset;
}

const PROBLEM_TYPES: { id: ProblemType; label: string; desc: string; icon: React.ElementType; color: string; borderColor: string }[] = [
  { id: 'classification', label: 'Classification', desc: 'Predict discrete categories', icon: Layers, color: 'text-cyan-accent', borderColor: 'border-cyan-700' },
  { id: 'regression', label: 'Regression', desc: 'Predict continuous values', icon: TrendingUp, color: 'text-copper', borderColor: 'border-copper-700' },
  { id: 'clustering', label: 'Clustering', desc: 'Discover natural groupings', icon: BarChart2, color: 'text-amber-signal', borderColor: 'border-amber-600' },
  { id: 'time-series', label: 'Time Series', desc: 'Forecast temporal patterns', icon: Activity, color: 'text-blue-signal', borderColor: 'border-blue-600' },
];

const DETECTION_SIGNALS: Record<ProblemType, string[]> = {
  classification: ['Target column: categorical', 'Unique classes: 2–12', 'Label distribution: analyzed', 'Encoding: detected'],
  regression: ['Target column: continuous', 'Value range: unbounded', 'Distribution: normal-ish', 'Correlation: computed'],
  clustering: ['No target column', 'Feature variance: high', 'Density structure: detected', 'Optimal k: estimated'],
  'time-series': ['Datetime index: detected', 'Temporal ordering: verified', 'Seasonality: analyzed', 'Stationarity: tested'],
};

export default function ProblemTypeDetector({ phase, detectedType, dataset }: Props) {
  if (phase === 'idle') return null;

  return (
    <div className="bg-surface-1 border border-border rounded-md p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        {phase === 'detecting' ? (
          <Loader2 size={14} className="text-cyan-accent animate-spin" />
        ) : (
          <CheckCircle2 size={14} className="text-green-signal" />
        )}
        <span className="text-xs font-600 text-foreground">
          {phase === 'detecting' ? 'Detecting Problem Type…' : 'Problem Type Detected'}
        </span>
        {detectedType && (
          <span className="ml-auto text-2xs font-mono-data text-muted-foreground">
            confidence: 98.4%
          </span>
        )}
      </div>

      {/* Type cards */}
      <div className="grid grid-cols-4 gap-3">
        {PROBLEM_TYPES.map((pt) => {
          const Icon = pt.icon;
          const isDetected = detectedType === pt.id;
          const isActive = phase !== 'detecting';
          return (
            <div
              key={pt.id}
              className={`relative rounded-md border p-3 transition-all duration-500 ${
                isDetected && isActive
                  ? `${pt.borderColor} bg-surface-2`
                  : 'border-border bg-surface-0 opacity-40'
              }`}
            >
              {isDetected && isActive && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 size={12} className="text-green-signal" />
                </div>
              )}
              <Icon size={18} className={`mb-2 ${isDetected && isActive ? pt.color : 'text-muted-foreground'}`} />
              <div className={`text-xs font-600 mb-0.5 ${isDetected && isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {pt.label}
              </div>
              <div className="text-2xs text-muted-foreground font-mono-data">{pt.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Detection signals */}
      {detectedType && phase !== 'detecting' && (
        <div className="flex items-center gap-6 pt-1 border-t border-border">
          {DETECTION_SIGNALS[detectedType].map((sig) => (
            <div key={sig} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-signal flex-shrink-0" />
              <span className="text-2xs font-mono-data text-muted-foreground">{sig}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
