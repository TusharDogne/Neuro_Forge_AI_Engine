'use client';

import React, { useState } from 'react';
import { ExternalLink, RefreshCw, AlertTriangle, Activity } from 'lucide-react';

const deployments = [
  {
    id: 'deploy-114',
    name: 'churn-xgb-v3',
    type: 'FastAPI',
    model: 'XGBoost Classifier',
    accuracy: '94.2%',
    requests: '18,420',
    latency: '24ms',
    uptime: '99.8%',
    drift: 0.041,
    status: 'live',
  },
  {
    id: 'deploy-112',
    name: 'revenue-lstm-v2',
    type: 'Docker',
    model: 'LSTM Time Series',
    accuracy: '88.7%',
    requests: '9,841',
    latency: '142ms',
    uptime: '97.2%',
    drift: 0.241,
    status: 'degraded',
  },
  {
    id: 'deploy-109',
    name: 'sentiment-bert-v1',
    type: 'FastAPI',
    model: 'BERT Fine-tuned',
    accuracy: '91.3%',
    requests: '12,047',
    latency: '88ms',
    uptime: '99.9%',
    drift: 0.028,
    status: 'live',
  },
  {
    id: 'deploy-107',
    name: 'fraud-rf-v4',
    type: 'Streamlit',
    model: 'Random Forest',
    accuracy: '96.1%',
    requests: '6,230',
    latency: '18ms',
    uptime: '100%',
    drift: 0.012,
    status: 'live',
  },
  {
    id: 'deploy-103',
    name: 'segmentation-kmeans',
    type: 'Flask',
    model: 'KMeans Clustering',
    accuracy: 'N/A',
    requests: '1,753',
    latency: '31ms',
    uptime: '99.4%',
    drift: 0.089,
    status: 'live',
  },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'live': return <span className="badge-green">● Live</span>;
    case 'degraded': return <span className="badge-red">⚠ Degraded</span>;
    case 'offline': return <span className="badge-muted">○ Offline</span>;
    default: return <span className="badge-muted">{status}</span>;
  }
};

const driftBadge = (score: number) => {
  if (score < 0.05) return <span className="badge-green font-mono-data">{score.toFixed(3)}</span>;
  if (score < 0.15) return <span className="badge-amber font-mono-data">{score.toFixed(3)}</span>;
  return <span className="badge-red font-mono-data">{score.toFixed(3)}</span>;
};

export default function DeploymentsTable() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="bg-card border border-border rounded-lg card-elevation">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-sm font-600 text-foreground">Active Deployments</p>
          <p className="text-2xs text-muted-foreground font-mono-data mt-0.5">5 endpoints · 1 requires attention</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-red flex items-center gap-1">
            <AlertTriangle size={10} /> 1 drift alert
          </span>
          <button className="btn-ghost text-xs py-1.5 px-3 gap-1">
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Endpoint', 'Type', 'Model', 'Accuracy', 'Req/Today', 'Latency', 'Drift Score', 'Status', ''].map((h) => (
                <th key={`dth-${h}`} className="px-4 py-2.5 text-left section-label whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deployments.map((dep) => (
              <tr
                key={dep.id}
                onMouseEnter={() => setHoveredRow(dep.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-border last:border-0 transition-colors duration-100 ${hoveredRow === dep.id ? 'bg-surface-2/50' : ''}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={dep.status === 'live' ? 'status-dot-green' : dep.status === 'degraded' ? 'status-dot-red' : 'status-dot-amber'} />
                    <span className="text-xs font-500 text-foreground font-mono-data">{dep.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="badge-muted text-2xs">{dep.type}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground">{dep.model}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono-data font-600 text-foreground">{dep.accuracy}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono-data text-muted-foreground">{dep.requests}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono-data text-cyan-500">{dep.latency}</span>
                </td>
                <td className="px-4 py-3">
                  {driftBadge(dep.drift)}
                </td>
                <td className="px-4 py-3">
                  {statusBadge(dep.status)}
                </td>
                <td className="px-4 py-3">
                  <div className={`flex items-center gap-1 transition-opacity duration-150 ${hoveredRow === dep.id ? 'opacity-100' : 'opacity-0'}`}>
                    <button className="p-1.5 rounded hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors" title="View endpoint">
                      <ExternalLink size={12} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors" title="Monitor">
                      <Activity size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}