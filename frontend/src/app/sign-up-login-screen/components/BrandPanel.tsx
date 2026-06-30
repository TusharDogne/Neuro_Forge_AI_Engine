'use client';

import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { Activity, Cpu, Database, Zap, Shield, BarChart3 } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const capabilities = [
  { id: 'cap-automl', icon: Cpu, label: 'AutoML Engine', desc: '15+ algorithms, auto-selection' },
  { id: 'cap-datasets', icon: Database, label: 'Dataset Profiler', desc: 'Intelligent EDA + preprocessing' },
  { id: 'cap-mlops', icon: Activity, label: 'MLOps Studio', desc: 'Drift detection + monitoring' },
  { id: 'cap-deploy', icon: Zap, label: 'One-Click Deploy', desc: 'FastAPI + Docker + Streamlit' },
  { id: 'cap-rag', icon: Shield, label: 'RAG Studio', desc: 'FAISS + ChromaDB + Pinecone' },
  { id: 'cap-viz', icon: BarChart3, label: 'Visualization', desc: 'SHAP, PCA, t-SNE, ROC curves' },
];

const telemetryLines = [
  { id: 'tl-1', label: 'EXP-2847', value: '94.2%', status: 'green', desc: 'XGBoost Classifier · Running' },
  { id: 'tl-2', label: 'EXP-2841', value: '91.8%', status: 'green', desc: 'Random Forest · Completed' },
  { id: 'tl-3', label: 'DEPLOY-114', value: '99.7%', status: 'green', desc: 'churn-model-v3 · Live' },
  { id: 'tl-4', label: 'DRIFT-009', value: '0.241', status: 'red', desc: 'revenue-lstm · Alert' },
];

export default function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col w-[520px] xl:w-[600px] 2xl:w-[680px] flex-shrink-0 bg-surface-1 border-r border-border relative overflow-hidden">
      {/* Grid scan lines */}
      <div className="absolute inset-0 grid-scan-line opacity-30 pointer-events-none" />
      {/* Animated scan line */}
      <div
        className="absolute left-0 right-0 h-px scan-line-animate pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, var(--cyan-500), transparent)', opacity: 0.3 }}
      />
      {/* Header */}
      <div className="relative z-10 p-8 pb-0">
        <div className="flex items-center gap-3 mb-8">
          <AppLogo size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-700 text-foreground tracking-tight">NeuroForge AI</span>
              <span className="badge-copper text-2xs">v2.4.1</span>
            </div>
            <p className="text-2xs font-mono-data text-muted-foreground tracking-widest">ENTERPRISE ML OPERATING SYSTEM</p>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl xl:text-4xl font-700 text-foreground leading-tight mb-3">
            Mission Control<br />
            <span className="text-copper-500">for Machine Learning</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            End-to-end ML platform for senior engineers. From raw data to production deployment — experiment tracking, drift monitoring, and one-click model deployment in a single research console.
          </p>
        </div>

        {/* Telemetry panel */}
        <div className="bg-surface-0 border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">LIVE TELEMETRY</p>
            <div className="flex items-center gap-1.5">
              <div className="status-dot-green animate-pulse-slow" />
              <span className="text-2xs font-mono-data text-muted-foreground">FEED ACTIVE</span>
            </div>
          </div>
          <div className="space-y-2">
            {telemetryLines?.map((line) => (
              <div key={line?.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <div className={line?.status === 'green' ? 'status-dot-green' : 'status-dot-red'} />
                  <span className="text-xs font-mono-data text-muted-foreground">{line?.label}</span>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">{line?.desc}</span>
                <span className={`text-xs font-mono-data font-600 ${line?.status === 'green' ? 'text-signal-green' : 'text-signal-red'}`}>
                  {line?.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Capabilities grid */}
      <div className="relative z-10 px-8 flex-1">
        <p className="section-label mb-3">PLATFORM CAPABILITIES</p>
        <div className="grid grid-cols-2 gap-2">
          {capabilities?.map((cap) => {
            const Icon = cap?.icon;
            return (
              <div key={cap?.id} className="flex items-start gap-2.5 p-3 bg-surface-0 border border-border rounded-lg hover:border-copper-500/30 transition-colors duration-200">
                <div className="w-7 h-7 rounded bg-copper-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={14} className="text-copper-500" />
                </div>
                <div>
                  <p className="text-xs font-600 text-foreground">{cap?.label}</p>
                  <p className="text-2xs text-muted-foreground mt-0.5">{cap?.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Footer */}
      <div className="relative z-10 p-8 pt-4">
        <div className="flex items-center gap-4 text-2xs text-muted-foreground font-mono-data">
          <span>SOC 2 TYPE II</span>
          <span className="text-border">|</span>
          <span>GDPR COMPLIANT</span>
          <span className="text-border">|</span>
          <span>ISO 27001</span>
        </div>
      </div>
    </div>
  );
}