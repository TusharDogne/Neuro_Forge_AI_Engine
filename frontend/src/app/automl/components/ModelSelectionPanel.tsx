'use client';

import React from 'react';
import { ModelCandidate, ProblemType, TrainingPhase } from '../page';
import { Loader2, CheckCircle2, Circle, Trophy } from 'lucide-react';

interface Props {
  models: ModelCandidate[];
  phase: TrainingPhase;
  bestModelId: string | null;
  problemType: ProblemType | null;
}

const PRIMARY_METRIC: Record<ProblemType, string> = {
  classification: 'accuracy',
  regression: 'r2',
  clustering: 'silhouette',
  'time-series': 'mae',
};

const METRIC_LABEL: Record<string, string> = {
  accuracy: 'Accuracy',
  r2: 'R²',
  silhouette: 'Silhouette',
  mae: 'MAE',
};

function ScoreBar({ score, isBest, problemType }: { score: number; isBest: boolean; problemType: ProblemType | null }) {
  const isLowerBetter = problemType === 'time-series' || (problemType === 'clustering');
  const displayScore = isLowerBetter ? Math.max(0, 1 - score) : score;
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isBest ? 'bg-copper' : 'bg-surface-3 border border-cyan-700'}`}
          style={{ width: `${Math.min(100, displayScore * 100)}%`, background: isBest ? undefined : '#22d3ee44' }}
        />
      </div>
    </div>
  );
}

export default function ModelSelectionPanel({ models, phase, bestModelId, problemType }: Props) {
  if (phase === 'idle' || phase === 'detecting') return null;

  const primaryMetric = problemType ? PRIMARY_METRIC[problemType] : 'accuracy';
  const isLowerBetter = problemType === 'time-series';

  const sortedModels = phase === 'complete'
    ? [...models].sort((a, b) => {
        const aVal = a.metrics[primaryMetric] ?? 0;
        const bVal = b.metrics[primaryMetric] ?? 0;
        return isLowerBetter ? aVal - bVal : bVal - aVal;
      })
    : models;

  return (
    <div className="bg-surface-1 border border-border rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-copper" />
          <span className="text-xs font-600 text-foreground">Model Leaderboard</span>
          {phase === 'selecting' && (
            <span className="flex items-center gap-1 text-2xs text-cyan-accent font-mono-data">
              <Loader2 size={10} className="animate-spin" />
              Loading candidates…
            </span>
          )}
        </div>
        {problemType && (
          <span className="text-2xs font-mono-data text-muted-foreground">
            Primary metric: {METRIC_LABEL[primaryMetric]}
          </span>
        )}
      </div>

      {/* Table header */}
      {models.length > 0 && (
        <div className="grid grid-cols-[28px_1fr_100px_80px_80px_60px] gap-3 px-4 py-2 border-b border-border">
          {['#', 'Model', 'Score Bar', METRIC_LABEL[primaryMetric] ?? 'Score', 'Time (s)', 'Status'].map((h) => (
            <span key={h} className="text-2xs font-mono-data text-muted-foreground uppercase tracking-wider">{h}</span>
          ))}
        </div>
      )}

      {/* Model rows */}
      <div className="divide-y divide-border">
        {sortedModels.map((model, idx) => {
          const isBest = model.id === bestModelId;
          const primaryVal = model.metrics[primaryMetric];
          return (
            <div
              key={model.id}
              className={`grid grid-cols-[28px_1fr_100px_80px_80px_60px] gap-3 items-center px-4 py-2.5 transition-colors duration-200 ${isBest ? 'bg-copper/5 border-l-2 border-l-copper' : 'hover:bg-surface-2'}`}
            >
              {/* Rank */}
              <span className={`text-xs font-mono-data ${isBest ? 'text-copper font-600' : 'text-muted-foreground'}`}>
                {phase === 'complete' ? `#${idx + 1}` : '—'}
              </span>

              {/* Name */}
              <div className="min-w-0">
                <div className={`text-xs font-500 truncate ${isBest ? 'text-foreground' : 'text-foreground/80'}`}>
                  {model.name}
                  {isBest && <span className="ml-1.5 text-2xs text-copper font-mono-data">★ BEST</span>}
                </div>
              </div>

              {/* Score bar */}
              <div className="flex items-center">
                {model.status === 'done' ? (
                  <ScoreBar score={primaryVal ?? 0} isBest={isBest} problemType={problemType} />
                ) : model.status === 'training' ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 size={11} className="text-cyan-accent animate-spin" />
                    <span className="text-2xs text-cyan-accent font-mono-data">training</span>
                  </div>
                ) : (
                  <span className="text-2xs text-muted-foreground font-mono-data">—</span>
                )}
              </div>

              {/* Primary metric value */}
              <span className={`text-xs font-mono-data ${isBest ? 'text-copper font-600' : 'text-foreground'}`}>
                {primaryVal !== undefined ? primaryVal.toFixed(4) : '—'}
              </span>

              {/* Train time */}
              <span className="text-xs font-mono-data text-muted-foreground">
                {model.trainTime > 0 ? `${model.trainTime}s` : '—'}
              </span>

              {/* Status */}
              <div className="flex items-center">
                {model.status === 'done' ? (
                  <CheckCircle2 size={13} className="text-green-signal" />
                ) : model.status === 'training' ? (
                  <Loader2 size={13} className="text-cyan-accent animate-spin" />
                ) : (
                  <Circle size={13} className="text-muted-foreground" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {models.length === 0 && phase === 'selecting' && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono-data">
            <Loader2 size={13} className="animate-spin text-cyan-accent" />
            Initializing model candidates…
          </div>
        </div>
      )}
    </div>
  );
}
