'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, FileJson, FileType, Loader2, CheckCircle2, X } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const fileTypes = [
  { id: 'ft-csv', ext: 'CSV', icon: FileSpreadsheet, color: 'text-signal-green' },
  { id: 'ft-excel', ext: 'XLSX', icon: FileSpreadsheet, color: 'text-signal-blue' },
  { id: 'ft-json', ext: 'JSON', icon: FileJson, color: 'text-signal-amber' },
  { id: 'ft-parquet', ext: 'Parquet', icon: FileType, color: 'text-copper-500' },
];

interface UploadFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'profiling' | 'done' | 'error';
}

export default function DatasetUploadZone() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (fileName: string, fileSize: string) => {
    const id = `upload-${Date.now()}`;
    const newFile: UploadFile = { id, name: fileName, size: fileSize, progress: 0, status: 'uploading' };
    setUploads((prev) => [...prev, newFile]);

    // Backend: POST /api/v1/datasets/upload with multipart form data
    let prog = 0;
    const interval = setInterval(() => {
      prog += 12;
      if (prog >= 100) {
        clearInterval(interval);
        setUploads((prev) => prev.map((f) => f.id === id ? { ...f, progress: 100, status: 'profiling' } : f));
        setTimeout(() => {
          setUploads((prev) => prev.map((f) => f.id === id ? { ...f, status: 'done' } : f));
        }, 1800);
      } else {
        setUploads((prev) => prev.map((f) => f.id === id ? { ...f, progress: prog } : f));
      }
    }, 160);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((f) => simulateUpload(f.name, `${(f.size / 1024 / 1024).toFixed(1)} MB`));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => simulateUpload(f.name, `${(f.size / 1024 / 1024).toFixed(1)} MB`));
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`drag-drop-zone p-6 cursor-pointer flex flex-col items-center gap-3 bg-card ${isDragOver ? 'drag-over' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".csv,.xlsx,.xls,.json,.parquet"
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="w-10 h-10 rounded-lg bg-copper-500/10 flex items-center justify-center">
          <Upload size={20} className="text-copper-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-500 text-foreground">
            Drop datasets here or <span className="text-copper-500">browse files</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports CSV, Excel, JSON, Parquet · Max 2 GB per file · Large file chunked upload
          </p>
        </div>
        <div className="flex items-center gap-3">
          {fileTypes.map((ft) => {
            const Icon = ft.icon;
            return (
              <div key={ft.id} className="flex items-center gap-1.5">
                <Icon size={13} className={ft.color} />
                <span className="text-2xs text-muted-foreground font-mono-data">{ft.ext}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active uploads */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((file) => (
            <div key={file.id} className="flex items-center gap-3 bg-surface-1 border border-border rounded-lg px-4 py-2.5">
              <div className="flex-shrink-0">
                {file.status === 'done' ? (
                  <CheckCircle2 size={16} className="text-signal-green" />
                ) : file.status === 'error' ? (
                  <X size={16} className="text-signal-red" />
                ) : (
                  <Loader2 size={16} className="animate-spin text-copper-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-500 text-foreground truncate">{file.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-2xs text-muted-foreground font-mono-data">{file.size}</span>
                    {file.status === 'uploading' && (
                      <span className="text-2xs font-mono-data text-copper-500">{file.progress}%</span>
                    )}
                    {file.status === 'profiling' && (
                      <span className="badge-amber">Profiling...</span>
                    )}
                    {file.status === 'done' && (
                      <span className="badge-green">Ready</span>
                    )}
                  </div>
                </div>
                {file.status === 'uploading' && (
                  <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
                    <div
                      className="h-full progress-bar-copper rounded-full transition-all duration-200"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => removeUpload(file.id)}
                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}