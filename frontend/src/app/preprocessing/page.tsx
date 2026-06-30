'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import PreprocessingDatasetSelector from './components/PreprocessingDatasetSelector';
import NullValuePanel from './components/NullValuePanel';
import OutlierDetectionPanel from './components/OutlierDetectionPanel';
import FeatureScalingPanel from './components/FeatureScalingPanel';
import CategoricalEncodingPanel from './components/CategoricalEncodingPanel';
import PreprocessingPipelinePanel from './components/PreprocessingPipelinePanel';
import { datasets } from '../dataset-management/components/datasetData';
import { CheckCircle2, Play, RotateCcw, Download, ChevronRight } from 'lucide-react';

export type StepStatus = 'idle' | 'running' | 'done' | 'warning';

export interface PipelineStep {
  id: string;
  label: string;
  status: StepStatus;
  detail: string;
}

const INITIAL_STEPS: PipelineStep[] = [
  { id: 'null', label: 'Null Value Handling', status: 'idle', detail: 'Not configured' },
  { id: 'outlier', label: 'Outlier Detection', status: 'idle', detail: 'Not configured' },
  { id: 'scaling', label: 'Feature Scaling', status: 'idle', detail: 'Not configured' },
  { id: 'encoding', label: 'Categorical Encoding', status: 'idle', detail: 'Not configured' },
];

export default function PreprocessingPage() {
  return (
    <AppLayout currentPath="/preprocessing">
      <PreprocessingWorkspace />
    </AppLayout>
  );
}

function PreprocessingWorkspace() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(datasets[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<'null' | 'outlier' | 'scaling' | 'encoding'>('null');
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS);
  const [isRunning, setIsRunning] = useState(false);
  const [runComplete, setRunComplete] = useState(false);

  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId) ?? datasets[0];

  const updateStep = (id: string, patch: Partial<PipelineStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const handleRunPipeline = () => {
    setIsRunning(true);
    setRunComplete(false);
    const ids = ['null', 'outlier', 'scaling', 'encoding'];
    ids.forEach((id, i) => {
      setTimeout(() => {
        updateStep(id, { status: 'running', detail: 'Processing…' });
        setTimeout(() => {
          updateStep(id, {
            status: 'done',
            detail: id === 'null' ? 'Imputed 3 columns' : id === 'outlier' ? '12 outliers capped' : id === 'scaling' ? 'StandardScaler applied' : '4 columns encoded',
          });
          if (i === ids.length - 1) {
            setIsRunning(false);
            setRunComplete(true);
          }
        }, 900);
      }, i * 1100);
    });
  };

  const handleReset = () => {
    setSteps(INITIAL_STEPS);
    setRunComplete(false);
    setIsRunning(false);
  };

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'null', label: 'Null Values' },
    { id: 'outlier', label: 'Outliers' },
    { id: 'scaling', label: 'Feature Scaling' },
    { id: 'encoding', label: 'Encoding' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono-data mb-1">
            <span>Dataset Management</span>
            <ChevronRight size={12} />
            <span className="text-copper">Preprocessing Workspace</span>
          </div>
          <h1 className="text-xl font-600 text-foreground">Preprocessing Workspace</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono-data">
            Automated pipeline · manual override controls · model-ready output
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="btn-ghost text-xs gap-1.5" disabled={isRunning}>
            <RotateCcw size={13} />
            Reset
          </button>
          {runComplete && (
            <button className="btn-ghost text-xs gap-1.5 text-cyan-accent border-cyan-700">
              <Download size={13} />
              Export Processed
            </button>
          )}
          <button
            onClick={handleRunPipeline}
            disabled={isRunning}
            className="btn-primary text-xs gap-1.5"
          >
            <Play size={13} />
            {isRunning ? 'Running Pipeline…' : 'Run Pipeline'}
          </button>
        </div>
      </div>

      {/* Dataset selector */}
      <PreprocessingDatasetSelector
        datasets={datasets}
        selectedId={selectedDatasetId}
        onSelect={setSelectedDatasetId}
      />

      {/* Main layout: tabs + pipeline */}
      <div className="flex gap-5 items-start">
        {/* Left: step tabs + content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Tab bar */}
          <div className="flex gap-1 bg-surface-1 border border-border rounded-md p-1">
            {tabs.map((t) => {
              const step = steps.find((s) => s.id === t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs font-500 transition-all duration-150 ${
                    activeTab === t.id
                      ? 'bg-surface-3 text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {step?.status === 'done' && (
                    <CheckCircle2 size={11} className="text-green-signal flex-shrink-0" />
                  )}
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === 'null' && (
            <NullValuePanel
              dataset={selectedDataset}
              onConfigure={(detail) => updateStep('null', { status: 'done', detail })}
            />
          )}
          {activeTab === 'outlier' && (
            <OutlierDetectionPanel
              dataset={selectedDataset}
              onConfigure={(detail) => updateStep('outlier', { status: 'done', detail })}
            />
          )}
          {activeTab === 'scaling' && (
            <FeatureScalingPanel
              dataset={selectedDataset}
              onConfigure={(detail) => updateStep('scaling', { status: 'done', detail })}
            />
          )}
          {activeTab === 'encoding' && (
            <CategoricalEncodingPanel
              dataset={selectedDataset}
              onConfigure={(detail) => updateStep('encoding', { status: 'done', detail })}
            />
          )}
        </div>

        {/* Right: pipeline summary */}
        <div className="w-[300px] flex-shrink-0">
          <PreprocessingPipelinePanel
            steps={steps}
            dataset={selectedDataset}
            runComplete={runComplete}
            isRunning={isRunning}
            onGoToStep={(id) => setActiveTab(id as typeof activeTab)}
          />
        </div>
      </div>
    </div>
  );
}
