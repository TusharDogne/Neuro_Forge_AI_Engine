'use client';

import React from 'react';
import { ProblemType, TrainingPhase } from '../page';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Loader2 } from 'lucide-react';

interface EpochPoint {
  epoch: number;
  loss: number;
  val_loss: number;
  score: number;
}

interface Props {
  epochData: EpochPoint[];
  currentEpoch: number;
  totalEpochs: number;
  phase: TrainingPhase;
  problemType: ProblemType | null;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: number }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded p-2 text-2xs font-mono-data space-y-1">
      <div className="text-muted-foreground mb-1">Epoch {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="text-foreground">{p.value.toFixed(4)}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrainingMetricsPanel({ epochData, currentEpoch, totalEpochs, phase, problemType }: Props) {
  if (phase === 'idle' || phase === 'detecting' || phase === 'selecting') return null;

  const progress = totalEpochs > 0 ? (currentEpoch / totalEpochs) * 100 : 0;
  const lastPoint = epochData[epochData.length - 1];

  return (
    <div className="bg-surface-1 border border-border rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-cyan-accent" />
          <span className="text-xs font-600 text-foreground">Training Metrics</span>
          {phase === 'training' && (
            <span className="flex items-center gap-1 text-2xs text-cyan-accent font-mono-data">
              <Loader2 size={10} className="animate-spin" />
              live
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {lastPoint && (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-copper" />
                <span className="text-2xs font-mono-data text-muted-foreground">loss: <span className="text-foreground">{lastPoint.loss.toFixed(4)}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-accent" />
                <span className="text-2xs font-mono-data text-muted-foreground">val_loss: <span className="text-foreground">{lastPoint.val_loss.toFixed(4)}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-signal" />
                <span className="text-2xs font-mono-data text-muted-foreground">score: <span className="text-foreground">{lastPoint.score.toFixed(4)}</span></span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Epoch progress */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-2xs font-mono-data text-muted-foreground">
            Epoch {currentEpoch} / {totalEpochs}
          </span>
          <span className="text-2xs font-mono-data text-copper">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-copper rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 divide-x divide-border">
        {/* Loss curve */}
        <div className="p-4">
          <div className="text-2xs font-mono-data text-muted-foreground uppercase tracking-wider mb-3">Loss Curve</div>
          {epochData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={epochData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis dataKey="epoch" tick={{ fontSize: 9, fill: '#7c8192', fontFamily: 'IBM Plex Mono' }} />
                <YAxis tick={{ fontSize: 9, fill: '#7c8192', fontFamily: 'IBM Plex Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="loss" stroke="#c87941" strokeWidth={1.5} dot={false} name="train_loss" />
                <Line type="monotone" dataKey="val_loss" stroke="#22d3ee" strokeWidth={1.5} dot={false} name="val_loss" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[160px] flex items-center justify-center">
              <span className="text-2xs text-muted-foreground font-mono-data">Waiting for data…</span>
            </div>
          )}
        </div>

        {/* Score curve */}
        <div className="p-4">
          <div className="text-2xs font-mono-data text-muted-foreground uppercase tracking-wider mb-3">Score Curve</div>
          {epochData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={epochData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis dataKey="epoch" tick={{ fontSize: 9, fill: '#7c8192', fontFamily: 'IBM Plex Mono' }} />
                <YAxis tick={{ fontSize: 9, fill: '#7c8192', fontFamily: 'IBM Plex Mono' }} domain={[0, 1]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={1.5} dot={false} name="score" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[160px] flex items-center justify-center">
              <span className="text-2xs text-muted-foreground font-mono-data">Waiting for data…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
