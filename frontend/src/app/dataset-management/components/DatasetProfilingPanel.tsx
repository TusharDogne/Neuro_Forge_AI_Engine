'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  BarChart2,
  Table2,
  Lightbulb,
  FlaskConical,
  Download,
} from 'lucide-react';
import { Dataset } from './datasetData';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';


const MissingValueChart = dynamic(() => import('./MissingValueChart'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-surface-2 rounded h-[140px] w-full" />,
});

const ColumnDistChart = dynamic(() => import('./ColumnDistChart'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-surface-2 rounded h-[120px] w-full" />,
});

interface DatasetProfilingPanelProps {
  dataset: Dataset;
  onClose: () => void;
}

type PanelTab = 'overview' | 'schema' | 'recommendations';

const mockSchema = [
  { id: 'col-001', name: 'customer_id', type: 'int64', missing: 0, unique: 284807, cardinality: 'High' },
  { id: 'col-002', name: 'transaction_amount', type: 'float64', missing: 0.2, unique: 41820, cardinality: 'High' },
  { id: 'col-003', name: 'merchant_category', type: 'object', missing: 1.4, unique: 18, cardinality: 'Low' },
  { id: 'col-004', name: 'transaction_hour', type: 'int32', missing: 0, unique: 24, cardinality: 'Low' },
  { id: 'col-005', name: 'device_type', type: 'object', missing: 3.1, unique: 5, cardinality: 'Low' },
  { id: 'col-006', name: 'session_duration_s', type: 'float64', missing: 0.8, unique: 18420, cardinality: 'High' },
  { id: 'col-007', name: 'is_international', type: 'bool', missing: 0, unique: 2, cardinality: 'Binary' },
  { id: 'col-008', name: 'churn_label', type: 'int32', missing: 0, unique: 2, cardinality: 'Binary' },
];

const recommendations = [
  {
    id: 'rec-001',
    severity: 'warning',
    title: 'Class imbalance detected',
    detail: 'Target column "churn_label" is 93.2% negative class. Apply SMOTE or class weighting before training.',
    action: 'Apply SMOTE',
  },
  {
    id: 'rec-002',
    severity: 'info',
    title: 'High cardinality in customer_id',
    detail: 'customer_id has 284,807 unique values. Consider dropping or using target encoding for tree-based models.',
    action: 'Drop column',
  },
  {
    id: 'rec-003',
    severity: 'success',
    title: 'Low missing value rate',
    detail: 'Only 1.2% missing values detected. Simple median/mode imputation will be sufficient.',
    action: 'Auto-impute',
  },
  {
    id: 'rec-004',
    severity: 'info',
    title: 'Skewness in transaction_amount',
    detail: 'Skewness = 4.72. Apply log transformation to normalize distribution for linear models.',
    action: 'Log transform',
  },
];

const typeColor = (type: string) => {
  if (type.includes('int')) return 'text-cyan-500';
  if (type.includes('float')) return 'text-copper-500';
  if (type === 'object') return 'text-signal-amber';
  if (type === 'bool') return 'text-signal-green';
  return 'text-muted-foreground';
};

const severityIcon = (s: string) => {
  switch (s) {
    case 'warning': return <AlertTriangle size={13} className="text-signal-amber flex-shrink-0 mt-0.5" />;
    case 'success': return <CheckCircle2 size={13} className="text-signal-green flex-shrink-0 mt-0.5" />;
    default: return <Info size={13} className="text-signal-blue flex-shrink-0 mt-0.5" />;
  }
};

const healthColor = (score: number) => {
  if (score >= 85) return 'text-signal-green';
  if (score >= 65) return 'text-signal-amber';
  return 'text-signal-red';
};

export default function DatasetProfilingPanel({ dataset, onClose }: DatasetProfilingPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>('overview');

  const tabs: { id: PanelTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'schema', label: 'Schema', icon: Table2 },
    { id: 'recommendations', label: 'Insights', icon: Lightbulb },
  ];

  return (
    <div className="bg-card border border-border rounded-lg card-elevation flex flex-col h-fit max-h-[calc(100vh-220px)] overflow-hidden fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-xs font-600 text-foreground truncate font-mono-data">{dataset.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`metric-value text-2xl ${healthColor(dataset.healthScore)}`}>
              {dataset.healthScore}
            </span>
            <div>
              <p className="text-2xs text-muted-foreground leading-tight">Health Score</p>
              <p className="text-2xs text-muted-foreground leading-tight">{dataset.version} · {dataset.format}</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-surface-2 transition-colors flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-0 border-b border-border flex-shrink-0">
        {[
          { id: 'qs-rows', label: 'ROWS', value: dataset.rows },
          { id: 'qs-cols', label: 'COLS', value: String(dataset.cols) },
          { id: 'qs-missing', label: 'MISSING', value: `${dataset.missingPct}%` },
        ].map((stat, i) => (
          <div
            key={stat.id}
            className={`px-3 py-2.5 text-center ${i < 2 ? 'border-r border-border' : ''}`}
          >
            <p className="text-sm font-700 font-mono-data text-foreground">{stat.value}</p>
            <p className="section-label mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={`ptab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-500 border-b-2 transition-all duration-150 ${
                activeTab === tab.id
                  ? 'border-copper-500 text-copper-500' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            {/* Problem type + target */}
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label mb-1">DETECTED PROBLEM TYPE</p>
                <div className="flex items-center gap-2">
                  {dataset.problemType === 'Classification' && <span className="badge-cyan">{dataset.problemType}</span>}
                  {dataset.problemType === 'Regression' && <span className="badge-copper">{dataset.problemType}</span>}
                  {dataset.problemType === 'Clustering' && <span className="badge-muted">{dataset.problemType}</span>}
                  {dataset.problemType === 'Time Series' && <span className="badge-amber">{dataset.problemType}</span>}
                  {dataset.problemType === 'Unknown' && <span className="badge-muted">{dataset.problemType}</span>}
                  {dataset.target && (
                    <span className="text-2xs font-mono-data text-muted-foreground">
                      target: <span className="text-cyan-500">{dataset.target}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Missing values chart */}
            <div>
              <p className="section-label mb-2">MISSING VALUES BY COLUMN</p>
              <MissingValueChart />
            </div>

            {/* Column type distribution */}
            <div>
              <p className="section-label mb-2">COLUMN TYPE BREAKDOWN</p>
              <ColumnDistChart />
            </div>

            {/* Class balance indicator */}
            {dataset.target && (
              <div>
                <p className="section-label mb-2">CLASS DISTRIBUTION</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xs text-muted-foreground w-16 font-mono-data">Negative</span>
                    <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
                      <div className="h-full bg-signal-blue rounded-full" style={{ width: '93.2%' }} />
                    </div>
                    <span className="text-2xs font-mono-data text-foreground w-10 text-right">93.2%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xs text-muted-foreground w-16 font-mono-data">Positive</span>
                    <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
                      <div className="h-full bg-signal-amber rounded-full" style={{ width: '6.8%' }} />
                    </div>
                    <span className="text-2xs font-mono-data text-signal-amber w-10 text-right">6.8%</span>
                  </div>
                </div>
                <p className="text-2xs text-signal-amber mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={10} /> Severe class imbalance — SMOTE recommended
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button className="btn-primary text-xs py-1.5 px-3 flex-1 justify-center gap-1.5">
                <FlaskConical size={12} /> Initialize AutoML
              </button>
              <button className="btn-ghost text-xs py-1.5 px-3 gap-1.5">
                <Download size={12} /> Report
              </button>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Column', 'Type', 'Missing', 'Cardinality'].map((h) => (
                    <th key={`sh-${h}`} className="px-4 py-2.5 text-left section-label whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockSchema.map((col) => (
                  <tr key={col.id} className="border-b border-border last:border-0 hover:bg-surface-2/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-mono-data text-foreground">{col.name}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-mono-data ${typeColor(col.type)}`}>{col.type}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-mono-data ${col.missing > 5 ? 'text-signal-red' : col.missing > 0 ? 'text-signal-amber' : 'text-signal-green'}`}>
                        {col.missing}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`badge-muted text-2xs`}>{col.cardinality}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="p-4 space-y-3">
            <p className="text-2xs text-muted-foreground">
              {recommendations.length} intelligent recommendations based on dataset profile
            </p>
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`border rounded-lg p-3 ${
                  rec.severity === 'warning' ?'border-signal-amber/20 bg-signal-amber/5'
                    : rec.severity === 'success' ?'border-signal-green/20 bg-signal-green/5' :'border-signal-blue/20 bg-signal-blue/5'
                }`}
              >
                <div className="flex items-start gap-2 mb-1.5">
                  {severityIcon(rec.severity)}
                  <p className="text-xs font-600 text-foreground">{rec.title}</p>
                </div>
                <p className="text-2xs text-muted-foreground leading-snug ml-5 mb-2">{rec.detail}</p>
                <div className="ml-5">
                  <button className="text-2xs text-copper-500 hover:text-copper-300 transition-colors font-500 border border-copper-500/20 rounded px-2 py-0.5">
                    {rec.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}