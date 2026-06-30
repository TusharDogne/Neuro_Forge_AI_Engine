'use client';

import React from 'react';
import { PipelineStep } from '../page';
import { Dataset } from '../../dataset-management/components/datasetData';
import { CheckCircle2, Circle, Loader2, AlertCircle, ChevronRight, Cpu } from 'lucide-react';

interface Props {
  steps: PipelineStep[];
  dataset: Dataset;
  runComplete: boolean;
  isRunning: boolean;
  onGoToStep: (id: string) => void;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  idle: <Circle size={14} className="text-muted-foreground" />,
  running: <Loader2 size={14} className="text-cyan-accent animate-spin" />,
  done: <CheckCircle2 size={14} className="text-green-signal" />,
  warning: <AlertCircle size={14} className="text-amber-signal" />,
};

export default function PreprocessingPipelinePanel({ steps, dataset, runComplete, isRunning, onGoToStep }: Props) {
  const doneCount = steps.filter((s) => s.status === 'done').length;
  const progress = (doneCount / steps.length) * 100;

  return (
    <div className="space-y-4">
      {/* Pipeline header */}
      <div className="bg-surface-1 border border-border rounded-md p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-copper" />
          <span className="text-xs font-600 text-foreground">Pipeline Status</span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-2xs text-muted-foreground font-mono-data">
              {doneCount}/{steps.length} steps configured
            </span>
            <span className="text-2xs font-mono-data text-copper">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-copper rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="space-y-1">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => onGoToStep(step.id)}
              className="w-full flex items-center gap-2.5 p-2.5 rounded hover:bg-surface-2 transition-colors duration-150 text-left group"
            >
              <div className="flex-shrink-0">{STATUS_ICONS[step.status]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-500 text-foreground truncate">{step.label}</div>
                <div className="text-2xs text-muted-foreground font-mono-data truncate">{step.detail}</div>
              </div>
              <ChevronRight size={11} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Dataset summary */}
      <div className="bg-surface-1 border border-border rounded-md p-4 space-y-3">
        <span className="text-xs font-600 text-foreground">Dataset Summary</span>
        <div className="space-y-2">
          {[
            { label: 'Name', value: dataset.name.length > 24 ? dataset.name.slice(0, 24) + '…' : dataset.name },
            { label: 'Rows', value: dataset.rows },
            { label: 'Columns', value: String(dataset.cols) },
            { label: 'Missing', value: `${dataset.missingPct}%` },
            { label: 'Problem Type', value: dataset.problemType },
            { label: 'Target', value: dataset.target ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">{label}</span>
              <span className="text-xs font-mono-data text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Output preview */}
      {runComplete && (
        <div className="bg-surface-1 border border-green-signal/30 rounded-md p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-signal" />
            <span className="text-xs font-600 text-green-signal">Pipeline Complete</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Rows After', value: dataset.rows },
              { label: 'Cols After', value: String(dataset.cols + 4) },
              { label: 'Null Values', value: '0' },
              { label: 'Outliers Treated', value: '12' },
              { label: 'Status', value: 'Model-Ready' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-2xs text-muted-foreground font-mono-data uppercase tracking-wider">{label}</span>
                <span className={`text-xs font-mono-data ${label === 'Status' ? 'text-green-signal' : 'text-foreground'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      {!runComplete && !isRunning && (
        <div className="bg-surface-1 border border-border rounded-md p-3">
          <p className="text-2xs text-muted-foreground font-mono-data leading-relaxed">
            Configure all steps then click <span className="text-copper">Run Pipeline</span> to apply preprocessing and generate a model-ready dataset.
          </p>
        </div>
      )}
    </div>
  );
}
