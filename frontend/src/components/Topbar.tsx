'use client';

import React, { useState } from 'react';
import { Search, Bell, Zap, HelpCircle, ChevronDown, Activity } from 'lucide-react';


const notifications = [
  { id: 'notif-001', type: 'drift', message: 'Model drift detected: churn-xgb-v3', time: '4m ago', unread: true },
  { id: 'notif-002', type: 'success', message: 'Experiment exp-2847 completed — 94.2% accuracy', time: '18m ago', unread: true },
  { id: 'notif-003', type: 'warning', message: 'Dataset "customer_txn_q2.csv" missing 12.4% values', time: '1h ago', unread: false },
];

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications?.filter((n) => n?.unread)?.length;

  return (
    <header className="flex items-center justify-between px-6 lg:px-8 border-b border-border bg-surface-1 flex-shrink-0 h-[60px]">
      {/* Left: system status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="status-dot-green" />
          <span className="text-2xs font-mono-data text-muted-foreground">SYS NOMINAL</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <Activity size={11} className="text-cyan-500" />
          <span className="text-2xs font-mono-data text-muted-foreground">3 JOBS RUNNING</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <Zap size={11} className="text-copper-500" />
          <span className="text-2xs font-mono-data text-muted-foreground">GPU CLUSTER: 68%</span>
        </div>
      </div>
      {/* Center: search */}
      <div className="hidden md:flex items-center gap-2 bg-surface-2 border border-border rounded px-3 py-1.5 w-72 lg:w-96">
        <Search size={13} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search datasets, experiments, models..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
        />
        <span className="text-2xs font-mono-data text-muted-foreground border border-border rounded px-1 py-0.5">⌘K</span>
      </div>
      {/* Right: actions + user */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all duration-150">
          <HelpCircle size={16} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all duration-150"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-signal-red" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-1 border border-border rounded-lg card-elevation z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-600 text-foreground">Notifications</span>
                <span className="badge-red">{unreadCount} new</span>
              </div>
              {notifications?.map((n) => (
                <div
                  key={n?.id}
                  className={`px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-surface-2 transition-colors duration-150 ${n?.unread ? 'bg-surface-2/30' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-1 flex-shrink-0 ${n?.type === 'drift' ? 'status-dot-red' : n?.type === 'success' ? 'status-dot-green' : 'status-dot-amber'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug">{n?.message}</p>
                      <p className="text-2xs text-muted-foreground mt-0.5 font-mono-data">{n?.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded hover:bg-surface-2 transition-all duration-150 border border-border ml-1">
          <div className="w-6 h-6 rounded-full bg-copper-500 flex items-center justify-center flex-shrink-0">
            <span className="text-2xs font-600 text-primary-foreground">MK</span>
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs font-500 text-foreground leading-tight">Marcus Kim</span>
            <span className="text-2xs text-muted-foreground">ML Engineer</span>
          </div>
          <ChevronDown size={12} className="text-muted-foreground hidden sm:block" />
        </button>
      </div>
    </header>
  );
}