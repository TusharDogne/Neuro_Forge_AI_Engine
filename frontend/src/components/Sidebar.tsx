'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Database,
  FlaskConical,
  BrainCircuit,
  BarChart3,
  Bot,
  Network,
  Cpu,
  Rocket,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Activity,
  Users,
  SlidersHorizontal,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  badgeVariant?: 'copper' | 'red' | 'cyan' | 'amber';
  group?: string;
}

const navItems: NavItem[] = [
  { id: 'nav-dashboard', label: 'Command Center', href: '/user-dashboard', icon: LayoutDashboard, group: 'WORKSPACE' },
  { id: 'nav-datasets', label: 'Dataset Management', href: '/dataset-management', icon: Database, badge: 3, badgeVariant: 'cyan', group: 'WORKSPACE' },
  { id: 'nav-preprocessing', label: 'Preprocessing', href: '/preprocessing', icon: SlidersHorizontal, group: 'WORKSPACE' },
  { id: 'nav-experiments', label: 'Experiments', href: '/user-dashboard', icon: FlaskConical, badge: 2, badgeVariant: 'copper', group: 'WORKSPACE' },
  { id: 'nav-automl', label: 'AutoML Engine', href: '/automl', icon: BrainCircuit, group: 'ML STUDIO' },
  { id: 'nav-dl-studio', label: 'Deep Learning Studio', href: '/user-dashboard', icon: Cpu, group: 'ML STUDIO' },
  { id: 'nav-visualization', label: 'Visualization Engine', href: '/user-dashboard', icon: BarChart3, group: 'ML STUDIO' },
  { id: 'nav-chatbot', label: 'Chatbot Builder', href: '/user-dashboard', icon: Bot, group: 'AI MODULES' },
  { id: 'nav-rag', label: 'RAG Studio', href: '/user-dashboard', icon: Network, group: 'AI MODULES' },
  { id: 'nav-agents', label: 'Agent Studio', href: '/user-dashboard', icon: Activity, group: 'AI MODULES' },
  { id: 'nav-mlops', label: 'MLOps Studio', href: '/user-dashboard', icon: AlertTriangle, badge: 1, badgeVariant: 'red', group: 'OPERATIONS' },
  { id: 'nav-deploy', label: 'Deployment Center', href: '/user-dashboard', icon: Rocket, group: 'OPERATIONS' },
  { id: 'nav-reports', label: 'Report Generator', href: '/user-dashboard', icon: FileText, group: 'OPERATIONS' },
  { id: 'nav-admin', label: 'Admin Panel', href: '/user-dashboard', icon: Users, group: 'SYSTEM' },
  { id: 'nav-settings', label: 'Settings', href: '/user-dashboard', icon: Settings, group: 'SYSTEM' },
];

const groups = ['WORKSPACE', 'ML STUDIO', 'AI MODULES', 'OPERATIONS', 'SYSTEM'];

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const badgeClass = (variant?: string) => {
    switch (variant) {
      case 'red': return 'badge-red';
      case 'copper': return 'badge-copper';
      case 'cyan': return 'badge-cyan';
      case 'amber': return 'badge-amber';
      default: return 'badge-muted';
    }
  };

  return (
    <aside
      className="relative flex flex-col bg-surface-1 border-r border-border flex-shrink-0 overflow-hidden"
      style={{
        width: collapsed ? '64px' : '240px',
        transition: 'width 300ms ease',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border flex-shrink-0 min-h-[60px]">
        <div className="flex-shrink-0">
          <AppLogo size={28} />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-sm font-700 text-foreground leading-tight tracking-tight truncate">
              NeuroForge
            </span>
            <span className="text-2xs text-muted-foreground font-mono-data tracking-widest">
              AI OS v2.4.1
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group);
          return (
            <div key={`group-${group}`} className="mb-4">
              {!collapsed && (
                <p className="section-label px-2 mb-1.5">{group}</p>
              )}
              {collapsed && <div className="telemetry-line mx-2 mb-2" />}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href || (item.href === '/user-dashboard' && currentPath === '/');
                return (
                  <Link
                    key={item.id}
                    href={item.href === '/user-dashboard' && currentPath === '/' ? '/' : item.href}
                    className={`sidebar-nav-item mb-0.5 group relative ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate text-sm">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className={badgeClass(item.badgeVariant)}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge !== undefined && (
                      <span
                        className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-signal-red"
                        style={{ fontSize: '0' }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2 flex-shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : (
            <>
              <ChevronLeft size={14} />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}