'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ExperimentAccuracyChart = dynamic(
  () => import('./ExperimentAccuracyChart'),
  { ssr: false, loading: () => <div className="animate-pulse bg-surface-2 rounded-lg h-[220px] w-full" /> }
);

const APIVolumeChart = dynamic(
  () => import('./APIVolumeChart'),
  { ssr: false, loading: () => <div className="animate-pulse bg-surface-2 rounded-lg h-[220px] w-full" /> }
);

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
      <ExperimentAccuracyChart />
      <APIVolumeChart />
    </div>
  );
}