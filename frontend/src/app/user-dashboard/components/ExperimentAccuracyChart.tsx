'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { epoch: 'E-01', accuracy: 71.2, loss: 0.82 },
  { epoch: 'E-05', accuracy: 78.4, loss: 0.64 },
  { epoch: 'E-10', accuracy: 82.1, loss: 0.51 },
  { epoch: 'E-15', accuracy: 85.6, loss: 0.42 },
  { epoch: 'E-20', accuracy: 87.3, loss: 0.38 },
  { epoch: 'E-25', accuracy: 89.1, loss: 0.34 },
  { epoch: 'E-30', accuracy: 90.4, loss: 0.29 },
  { epoch: 'E-35', accuracy: 91.8, loss: 0.26 },
  { epoch: 'E-40', accuracy: 92.7, loss: 0.24 },
  { epoch: 'E-45', accuracy: 93.5, loss: 0.22 },
  { epoch: 'E-50', accuracy: 94.2, loss: 0.21 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-1 border border-border rounded-lg px-3 py-2 card-elevation">
        <p className="text-2xs font-mono-data text-muted-foreground mb-1">{label}</p>
        <p className="text-xs font-600 text-copper-500">Accuracy: {payload[0]?.value}%</p>
      </div>
    );
  }
  return null;
};

export default function ExperimentAccuracyChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 card-elevation">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-600 text-foreground">Training Accuracy Curve</p>
          <p className="text-2xs text-muted-foreground mt-0.5 font-mono-data">exp-2847 · XGBoost Classifier · 50 epochs</p>
        </div>
        <span className="badge-copper">94.2% final</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--copper-500)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--copper-500)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="epoch"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[65, 100]}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="accuracy"
            stroke="var(--copper-500)"
            strokeWidth={2}
            fill="url(#accuracyGrad)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--copper-500)', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}