'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface StorageChartProps {
  usedPct: number;
}

export default function StorageChart({ usedPct }: StorageChartProps) {
  const data = [
    { name: 'Used', value: usedPct, fill: 'var(--copper-500)' },
    { name: 'Free', value: 100 - usedPct, fill: 'var(--surface-3)' },
  ];

  return (
    <div className="relative h-[100px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height={100}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar dataKey="value" cornerRadius={4} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-700 font-mono-data text-foreground">{usedPct}%</span>
        <span className="text-2xs text-muted-foreground">of 100 GB</span>
      </div>
    </div>
  );
}