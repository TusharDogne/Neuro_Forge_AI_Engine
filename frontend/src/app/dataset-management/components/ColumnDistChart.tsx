'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Numerical', value: 18, color: 'var(--cyan-500)' },
  { name: 'Categorical', value: 9, color: 'var(--copper-500)' },
  { name: 'Boolean', value: 2, color: 'var(--green-signal)' },
  { name: 'Datetime', value: 2, color: 'var(--amber-signal)' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-1 border border-border rounded px-2.5 py-1.5 card-elevation">
        <p className="text-xs font-600 text-foreground">{payload[0]?.name}: {payload[0]?.value} cols</p>
      </div>
    );
  }
  return null;
};

const renderLegend = () => (
  <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
    {data.map((entry) => (
      <div key={`leg-${entry.name}`} className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.color }} />
        <span className="text-2xs text-muted-foreground">{entry.name} ({entry.value})</span>
      </div>
    ))}
  </div>
);

export default function ColumnDistChart() {
  return (
    <div>
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={28}
            outerRadius={44}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-cd-${index}`} fill={entry.color} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {renderLegend()}
    </div>
  );
}