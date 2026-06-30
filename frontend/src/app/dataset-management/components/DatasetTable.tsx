'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronUp, ChevronDown, ChevronsUpDown, Eye, FlaskConical, Trash2, Copy, CheckSquare, Square, FileSpreadsheet, FileJson, FileType,  } from 'lucide-react';
import { datasets, Dataset } from './datasetData';
import Icon from '@/components/ui/AppIcon';


type SortKey = keyof Dataset;
type SortDir = 'asc' | 'desc' | null;

interface DatasetTableProps {
  onSelectDataset: (ds: Dataset | null) => void;
  selectedDatasetId: string | null;
}

const formatBadge = (fmt: Dataset['format']) => {
  const map: Record<string, { cls: string; icon: React.ElementType }> = {
    CSV: { cls: 'badge-green', icon: FileSpreadsheet },
    Parquet: { cls: 'badge-copper', icon: FileType },
    JSON: { cls: 'badge-amber', icon: FileJson },
    XLSX: { cls: 'badge-cyan', icon: FileSpreadsheet },
  };
  const { cls, icon: Icon } = map[fmt] || { cls: 'badge-muted', icon: FileSpreadsheet };
  return (
    <span className={cls}>
      <Icon size={10} />
      {fmt}
    </span>
  );
};

const statusBadge = (status: Dataset['status']) => {
  switch (status) {
    case 'Ready': return <span className="badge-green">● Ready</span>;
    case 'Profiling': return <span className="badge-amber animate-pulse-slow">◌ Profiling</span>;
    case 'Uploading': return <span className="badge-cyan">↑ Uploading</span>;
    case 'Error': return <span className="badge-red">✕ Error</span>;
    case 'Archived': return <span className="badge-muted">◎ Archived</span>;
    default: return <span className="badge-muted">{status}</span>;
  }
};

const problemTypeBadge = (pt: Dataset['problemType']) => {
  switch (pt) {
    case 'Classification': return <span className="badge-cyan">{pt}</span>;
    case 'Regression': return <span className="badge-copper">{pt}</span>;
    case 'Clustering': return <span className="badge-muted">{pt}</span>;
    case 'Time Series': return <span className="badge-amber">{pt}</span>;
    default: return <span className="badge-muted">{pt}</span>;
  }
};

const healthScoreBar = (score: number) => {
  const color = score >= 85 ? 'progress-bar-cyan' : score >= 65 ? 'bg-signal-amber' : 'bg-signal-red';
  const textColor = score >= 85 ? 'text-signal-green' : score >= 65 ? 'text-signal-amber' : 'text-signal-red';
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-2xs font-mono-data font-600 ${textColor}`}>{score}</span>
    </div>
  );
};

const columns: { key: SortKey; label: string; sortable: boolean }[] = [
  { key: 'name', label: 'Dataset Name', sortable: true },
  { key: 'format', label: 'Format', sortable: true },
  { key: 'rows', label: 'Rows', sortable: false },
  { key: 'cols', label: 'Cols', sortable: true },
  { key: 'size', label: 'Size', sortable: false },
  { key: 'healthScore', label: 'Health', sortable: true },
  { key: 'missingPct', label: 'Missing %', sortable: true },
  { key: 'problemType', label: 'Problem Type', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'uploadedAt', label: 'Uploaded', sortable: true },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function DatasetTable({ onSelectDataset, selectedDatasetId }: DatasetTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('uploadedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...datasets];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.uploadedBy.toLowerCase().includes(q) ||
          d.problemType.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All') result = result.filter((d) => d.status === statusFilter);
    if (typeFilter !== 'All') result = result.filter((d) => d.problemType === typeFilter);
    if (sortKey && sortDir) {
      result.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av === undefined || bv === undefined) return 0;
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [search, statusFilter, typeFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((d) => d.id)));
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col || !sortDir) return <ChevronsUpDown size={11} className="text-muted-foreground opacity-40" />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="text-copper-500" />
      : <ChevronDown size={11} className="text-copper-500" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg card-elevation">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-wrap">
        <div className="flex items-center gap-2 bg-surface-2 border border-border rounded px-2.5 py-1.5 flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-surface-2 border border-border text-xs text-foreground rounded px-2 py-1.5 outline-none cursor-pointer"
          >
            {['All', 'Ready', 'Profiling', 'Uploading', 'Error', 'Archived'].map((s) => (
              <option key={`sf-${s}`} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="bg-surface-2 border border-border text-xs text-foreground rounded px-2 py-1.5 outline-none cursor-pointer"
          >
            {['All', 'Classification', 'Regression', 'Clustering', 'Time Series', 'Unknown'].map((t) => (
              <option key={`tf-${t}`} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-2xs text-muted-foreground font-mono-data">
            {filtered.length} datasets
          </span>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-copper-500/10 border-b border-copper-500/20">
          <span className="text-xs font-500 text-copper-500">{selectedIds.size} selected</span>
          <div className="flex items-center gap-1.5 ml-2">
            <button className="btn-ghost text-xs py-1 px-2.5 gap-1 text-signal-blue border-signal-blue/20">
              <FlaskConical size={11} /> Run AutoML
            </button>
            <button className="btn-ghost text-xs py-1 px-2.5 gap-1">
              <Copy size={11} /> Duplicate
            </button>
            <button className="btn-ghost text-xs py-1 px-2.5 gap-1 text-signal-red border-signal-red/20">
              <Trash2 size={11} /> Delete
            </button>
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-2xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-border">
              {/* Checkbox */}
              <th className="px-4 py-2.5 w-8">
                <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground transition-colors">
                  {selectedIds.size === paginated.length && paginated.length > 0
                    ? <CheckSquare size={14} className="text-copper-500" />
                    : <Square size={14} />}
                </button>
              </th>
              {columns.map((col) => (
                <th
                  key={`col-${col.key}`}
                  className={`px-3 py-2.5 text-left whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-foreground' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="section-label">{col.label}</span>
                    {col.sortable && <SortIcon col={col.key} />}
                  </div>
                </th>
              ))}
              <th className="px-3 py-2.5 w-16" />
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileType size={28} className="text-muted-foreground opacity-40" />
                    <p className="text-sm font-500 text-foreground">No datasets found</p>
                    <p className="text-xs text-muted-foreground">
                      Adjust your search or filters, or upload a new dataset above
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((ds) => (
                <tr
                  key={ds.id}
                  onMouseEnter={() => setHoveredRow(ds.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onSelectDataset(selectedDatasetId === ds.id ? null : ds)}
                  className={`border-b border-border last:border-0 cursor-pointer transition-colors duration-100 ${
                    selectedDatasetId === ds.id
                      ? 'bg-copper-500/8 border-l-2 border-l-copper-500'
                      : hoveredRow === ds.id
                      ? 'bg-surface-2/50' :''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(ds.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                      {selectedIds.has(ds.id)
                        ? <CheckSquare size={14} className="text-copper-500" />
                        : <Square size={14} />}
                    </button>
                  </td>

                  {/* Name */}
                  <td className="px-3 py-3 max-w-[220px]">
                    <div>
                      <p className="text-xs font-500 text-foreground truncate font-mono-data">{ds.name}</p>
                      <p className="text-2xs text-muted-foreground mt-0.5">by {ds.uploadedBy} · {ds.version}</p>
                    </div>
                  </td>

                  {/* Format */}
                  <td className="px-3 py-3">{formatBadge(ds.format)}</td>

                  {/* Rows */}
                  <td className="px-3 py-3">
                    <span className="text-xs font-mono-data text-foreground">{ds.rows}</span>
                  </td>

                  {/* Cols */}
                  <td className="px-3 py-3">
                    <span className="text-xs font-mono-data text-muted-foreground">{ds.cols}</span>
                  </td>

                  {/* Size */}
                  <td className="px-3 py-3">
                    <span className="text-xs font-mono-data text-muted-foreground">{ds.size}</span>
                  </td>

                  {/* Health */}
                  <td className="px-3 py-3">{healthScoreBar(ds.healthScore)}</td>

                  {/* Missing % */}
                  <td className="px-3 py-3">
                    <span className={`text-xs font-mono-data ${ds.missingPct > 10 ? 'text-signal-red' : ds.missingPct > 5 ? 'text-signal-amber' : 'text-signal-green'}`}>
                      {ds.missingPct}%
                    </span>
                  </td>

                  {/* Problem Type */}
                  <td className="px-3 py-3">{problemTypeBadge(ds.problemType)}</td>

                  {/* Status */}
                  <td className="px-3 py-3">{statusBadge(ds.status)}</td>

                  {/* Uploaded */}
                  <td className="px-3 py-3">
                    <span className="text-2xs font-mono-data text-muted-foreground whitespace-nowrap">{ds.uploadedAt}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div
                      className={`flex items-center gap-1 transition-opacity duration-150 ${hoveredRow === ds.id ? 'opacity-100' : 'opacity-0'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="p-1.5 rounded hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                        title="Profile dataset"
                        onClick={() => onSelectDataset(ds)}
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-surface-3 text-muted-foreground hover:text-cyan-500 transition-colors"
                        title="Initialize AutoML experiment"
                      >
                        <FlaskConical size={12} />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-surface-3 text-muted-foreground hover:text-signal-red transition-colors"
                        title="Delete dataset — this cannot be undone"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-2xs text-muted-foreground">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="bg-surface-2 border border-border text-xs text-foreground rounded px-2 py-1 outline-none cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={`ps-${s}`} value={s}>{s}</option>
            ))}
          </select>
          <span className="text-2xs text-muted-foreground font-mono-data">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-2 py-1 text-xs rounded text-muted-foreground hover:text-foreground hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            «
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 text-xs rounded text-muted-foreground hover:text-foreground hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            ‹
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
            const pageNum = startPage + i;
            if (pageNum > totalPages) return null;
            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => setPage(pageNum)}
                className={`px-2.5 py-1 text-xs rounded transition-all duration-150 font-mono-data ${
                  page === pageNum
                    ? 'bg-copper-500 text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded text-muted-foreground hover:text-foreground hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            ›
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded text-muted-foreground hover:text-foreground hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}