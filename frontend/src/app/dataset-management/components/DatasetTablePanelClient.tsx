'use client';

import React, { useState } from 'react';
import DatasetTable from './DatasetTable';
import DatasetProfilingPanel from './DatasetProfilingPanel';
import { Dataset } from './datasetData';

export default function DatasetTablePanelClient() {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  return (
    <div className="flex gap-5 items-start">
      <div className={`flex-1 min-w-0 transition-all duration-300 ${selectedDataset ? 'xl:max-w-[calc(100%-380px)]' : ''}`}>
        <DatasetTable onSelectDataset={setSelectedDataset} selectedDatasetId={selectedDataset?.id ?? null} />
      </div>
      {selectedDataset && (
        <div className="w-[360px] flex-shrink-0">
          <DatasetProfilingPanel dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
        </div>
      )}
    </div>
  );
}