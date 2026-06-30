import React from 'react';
import AppLayout from '@/components/AppLayout';
import DatasetUploadZone from './components/DatasetUploadZone';



export default function DatasetManagementPage() {
  return (
    <AppLayout currentPath="/dataset-management">
      <DatasetManagementContent />
    </AppLayout>
  );
}

function DatasetManagementContent() {
  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-600 text-foreground">Dataset Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono-data">
            23 datasets · 4 profiling · 80.4 GB used
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-xs gap-1.5">
            Export Catalog
          </button>
          <button className="btn-primary text-xs gap-1.5">
            Upload Dataset
          </button>
        </div>
      </div>

      {/* Upload zone */}
      <DatasetUploadZone />

      {/* Main content: table + profiling panel */}
      <DatasetTableWithPanel />
    </div>
  );
}

function DatasetTableWithPanel() {
  return <DatasetTablePanelClient />;
}

import DatasetTablePanelClient from './components/DatasetTablePanelClient'
;