import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardKPIGrid from './components/DashboardKPIGrid';
import DashboardCharts from './components/DashboardCharts';
import DeploymentsTable from './components/DeploymentsTable';
import ActivityFeed from './components/ActivityFeed';
import AIAssistantPanel from './components/AIAssistantPanel';
import StorageWidget from './components/StorageWidget';

export default function UserDashboardPage() {
  return (
    <AppLayout currentPath="/user-dashboard">
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

        {/* KPI Bento Grid */}
        <DashboardKPIGrid />

        {/* Charts row */}
        <DashboardCharts />

        {/* Bottom section: deployments + activity + AI + storage */}
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <DeploymentsTable />
          </div>
          <div className="flex flex-col gap-5">
            <StorageWidget />
            <AIAssistantPanel />
          </div>
        </div>

        {/* Activity feed */}
        <ActivityFeed />
      </div>
    </AppLayout>
  );
}