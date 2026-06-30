'use client';

import React, { useRef, useEffect } from 'react';
import { ModelCandidate, ProblemType, TrainingPhase, TrainingLog } from '../page';
import { CheckCircle2, Trophy, Terminal, Download, BarChart3 } from 'lucide-react';

interface Props {
  models: ModelCandidate[];
  bestModelId: string | null;
  phase: TrainingPhase;
  logs: TrainingLog[];
  problemType: ProblemType | null;
}

const LOG_COLORS: Record<TrainingLog['level'], string> = {
  info: 'text-muted-foreground',
  success: 'text-green-signal',
  warn: 'text-amber-signal',
  metric: 'text-cyan-accent',
};

const ALL_METRIC_LABELS: Record<string, string> = {
  accuracy: 'Accuracy', f1: 'F1 Score', precision: 'Precision', recall: 'Recall', auc_roc: 'AUC-ROC',
  r2: 'R²', rmse: 'RMSE', mae: 'MAE', mape: 'MAPE',
  silhouette: 'Silhouette', davies_bouldin: 'Davies-Bouldin', calinski_harabasz: 'Calinski-Harabasz',
  smape: 'sMAPE',
};

const HIGHER_BETTER = new Set(['accuracy', 'f1', 'precision', 'recall', 'auc_roc', 'r2', 'silhouette', 'calinski_harabasz']);

export default function AutoMLResultsPanel({ models, bestModelId, phase, logs, problemType }: Props) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const bestModel = models.find((m) => m.id === bestModelId);

  return (
    <div className="space-y-4">
      {/* Best model card */}
      {bestModel && phase === 'complete' && (
        <div className="bg-surface-1 border border-copper/40 rounded-md p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-copper" />
            <span className="text-xs font-600 text-copper">Best Model</span>
          </div>
          <div>
            <div className="text-sm font-600 text-foreground">{bestModel.name}</div>
            <div className="text-2xs text-muted-foreground font-mono-data mt-0.5">{problemType?.toUpperCase()} · {bestModel.trainTime}s train time</div>
          </div>

          {/* Metrics grid */}
          <div className="space-y-1.5">
            {Object.entries(bestModel.metrics).map(([key, val]) => {
              const isHigherBetter = HIGHER_BETTER.has(key);
              const displayVal = typeof val === 'number' ? (val > 10 ? val.toFixed(1) : val.toFixed(4)) : val;
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">
                    {ALL_METRIC_LABELS[key] ?? key}
                  </span>
                  <span className={`text-xs font-mono-data font-600 ${isHigherBetter ? 'text-green-signal' : 'text-amber-signal'}`}>
                    {displayVal}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 pt-1">
            <button className="flex-1 btn-primary text-2xs gap-1.5 py-1.5">
              <Download size={11} />
              Export Model
            </button>
            <button className="flex-1 btn-ghost text-2xs gap-1.5 py-1.5">
              <BarChart3 size={11} />
              Full Report
            </button>
          </div>
        </div>
      )}

      {/* Training log */}
      <div className="bg-surface-1 border border-border rounded-md overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
          <Terminal size={13} className="text-muted-foreground" />
          <span className="text-xs font-600 text-foreground">Training Log</span>
          <span className="ml-auto text-2xs font-mono-data text-muted-foreground">{logs.length} entries</span>
        </div>
        <div
          ref={logRef}
          className="h-[340px] overflow-y-auto p-3 space-y-0.5 font-mono-data"
          style={{ fontSize: '10px' }}
        >
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground">Run AutoML to see training logs…</span>
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-2 leading-relaxed">
                <span className="text-surface-3 flex-shrink-0 select-none">{log.ts}</span>
                <span className={LOG_COLORS[log.level]}>{log.msg}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Experiment summary */}
      {phase === 'complete' && (
        <div className="bg-surface-1 border border-green-signal/30 rounded-md p-4 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-green-signal" />
            <span className="text-xs font-600 text-green-signal">Experiment Complete</span>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Models Evaluated', value: String(models.filter((m) => m.status === 'done').length) },
              { label: 'Problem Type', value: problemType?.toUpperCase() ?? '—' },
              { label: 'Best Model', value: bestModel?.shortName ?? '—' },
              { label: 'Status', value: 'Saved to Registry' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">{label}</span>
                <span className={`text-xs font-mono-data ${label === 'Status' ? 'text-green-signal' : 'text-foreground'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
