'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { hour: '00:00', calls: 1240 },
  { hour: '02:00', calls: 890 },
  { hour: '04:00', calls: 420 },
  { hour: '06:00', calls: 780 },
  { hour: '08:00', calls: 3420 },
  { hour: '10:00', calls: 5840 },
  { hour: '12:00', calls: 6720 },
  { hour: '14:00', calls: 7140 },
  { hour: '16:00', calls: 6890 },
  { hour: '18:00', calls: 5230 },
  { hour: '20:00', calls: 4180 },
  { hour: '22:00', calls: 2847 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-1 border border-border rounded-lg px-3 py-2 card-elevation">
        <p className="text-2xs font-mono-data text-muted-foreground mb-1">{label}</p>
        <p className="text-xs font-600 text-cyan-500">{payload[0]?.value?.toLocaleString()} calls</p>
      </div>
    );
  }
  return null;
};

export default function APIVolumeChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 card-elevation">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-600 text-foreground">API Inference Volume</p>
          <p className="text-2xs text-muted-foreground mt-0.5 font-mono-data">Today · All endpoints · UTC</p>
        </div>
        <span className="badge-cyan">48,291 total</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="calls" fill="var(--cyan-500)" radius={[2, 2, 0, 0]} opacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}