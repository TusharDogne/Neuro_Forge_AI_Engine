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
  Cell,
} from 'recharts';

const data = [
  { col: 'merchant_cat', missing: 1.4 },
  { col: 'device_type', missing: 3.1 },
  { col: 'txn_amount', missing: 0.2 },
  { col: 'session_dur', missing: 0.8 },
  { col: 'customer_id', missing: 0 },
  { col: 'txn_hour', missing: 0 },
  { col: 'is_intl', missing: 0 },
  { col: 'churn_label', missing: 0 },
];

const barColor = (val: number) => {
  if (val > 10) return 'var(--red-signal)';
  if (val > 3) return 'var(--amber-signal)';
  if (val > 0) return 'var(--cyan-500)';
  return 'var(--surface-3)';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-1 border border-border rounded px-2.5 py-1.5 card-elevation">
        <p className="text-2xs font-mono-data text-muted-foreground">{label}</p>
        <p className="text-xs font-600 text-foreground">{payload[0]?.value}% missing</p>
      </div>
    );
  }
  return null;
};

export default function MissingValueChart() {
  return (
    <ResponsiveContainer width="100%" height={130}>
      <BarChart data={data} margin={{ top: 2, right: 2, left: -28, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="col"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="missing" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-mv-${index}`} fill={barColor(entry.missing)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}