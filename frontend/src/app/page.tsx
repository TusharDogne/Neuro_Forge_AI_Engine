import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardKPIGrid from './user-dashboard/components/DashboardKPIGrid';
import DashboardCharts from './user-dashboard/components/DashboardCharts';
import DeploymentsTable from './user-dashboard/components/DeploymentsTable';
import ActivityFeed from './user-dashboard/components/ActivityFeed';
import AIAssistantPanel from './user-dashboard/components/AIAssistantPanel';
import StorageWidget from './user-dashboard/components/StorageWidget';

export default function HomePage() {
  return (
    <AppLayout currentPath="/">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-600 text-foreground">Command Center</h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono-data">
              Last sync: 2026-06-28 20:14:52 UTC · 3 jobs active
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost text-xs gap-1.5">
              <span className="text-2xs">⌘</span> New Experiment
            </button>
            <button className="btn-primary text-xs gap-1.5">
              Initialize Experiment
            </button>
          </div>
        </div>

        <DashboardKPIGrid />
        <DashboardCharts />

        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <DeploymentsTable />
          </div>
          <div className="flex flex-col gap-5">
            <StorageWidget />
            <AIAssistantPanel />
          </div>
        </div>

        <ActivityFeed />
      </div>
    </AppLayout>
  );
}