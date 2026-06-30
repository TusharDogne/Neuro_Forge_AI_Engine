import React from 'react';
import {
  FlaskConical,
  TrendingUp,
  Database,
  Rocket,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const kpiCards = [
  {
    id: 'kpi-experiments',
    label: 'ACTIVE EXPERIMENTS',
    value: '7',
    subValue: '3 running now',
    trend: '+2 since yesterday',
    trendPositive: true,
    icon: FlaskConical,
    accentColor: 'text-cyan-500',
    accentBg: 'bg-cyan-500/10',
    borderAccent: 'border-cyan-500/20',
    span: 'col-span-1',
  },
  {
    id: 'kpi-accuracy',
    label: 'BEST MODEL ACCURACY',
    value: '94.2%',
    subValue: 'exp-2847 · XGBoost',
    trend: '+1.4% vs last run',
    trendPositive: true,
    icon: TrendingUp,
    accentColor: 'text-copper-500',
    accentBg: 'bg-copper-500/10',
    borderAccent: 'border-copper-500/30',
    span: 'col-span-1 md:col-span-2',
    hero: true,
  },
  {
    id: 'kpi-datasets',
    label: 'DATASETS READY',
    value: '23',
    subValue: '4 profiling in progress',
    trend: '+5 this week',
    trendPositive: true,
    icon: Database,
    accentColor: 'text-signal-blue',
    accentBg: 'bg-signal-blue/10',
    borderAccent: 'border-signal-blue/20',
    span: 'col-span-1',
  },
  {
    id: 'kpi-deployments',
    label: 'LIVE DEPLOYMENTS',
    value: '5',
    subValue: '1 degraded · 4 nominal',
    trend: '99.1% avg uptime',
    trendPositive: true,
    icon: Rocket,
    accentColor: 'text-signal-green',
    accentBg: 'bg-signal-green/10',
    borderAccent: 'border-signal-green/20',
    span: 'col-span-1',
  },
  {
    id: 'kpi-api',
    label: 'API CALLS TODAY',
    value: '48,291',
    subValue: '2,847 last hour',
    trend: '+18.3% vs yesterday',
    trendPositive: true,
    icon: Zap,
    accentColor: 'text-cyan-500',
    accentBg: 'bg-cyan-500/10',
    borderAccent: 'border-cyan-500/20',
    span: 'col-span-1',
  },
  {
    id: 'kpi-drift',
    label: 'DRIFT ALERTS',
    value: '2',
    subValue: 'revenue-lstm · churn-v2',
    trend: '↑ requires action',
    trendPositive: false,
    icon: AlertTriangle,
    accentColor: 'text-signal-red',
    accentBg: 'bg-signal-red/10',
    borderAccent: 'border-signal-red/30',
    alert: true,
    span: 'col-span-1',
  },
];

export default function DashboardKPIGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {kpiCards?.map((card) => {
        const Icon = card?.icon;
        return (
          <div
            key={card?.id}
            className={`
              relative bg-card border rounded-lg p-4 card-elevation
              hover:card-elevation-hover transition-all duration-200 cursor-default
              ${card?.borderAccent}
              ${card?.hero ? 'md:col-span-2' : ''}
              ${card?.alert ? 'bg-signal-red/5' : ''}
            `}
          >
            {card?.alert && (
              <div className="absolute top-2 right-2">
                <div className="status-dot-red animate-pulse-slow" />
              </div>
            )}
            <div className="flex items-start justify-between mb-3">
              <div className={`w-8 h-8 rounded ${card?.accentBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={15} className={card?.accentColor} />
              </div>
              <span className={`text-2xs font-mono-data ${card?.trendPositive ? 'text-signal-green' : 'text-signal-red'}`}>
                {card?.trend}
              </span>
            </div>
            <p className={`metric-value ${card?.hero ? 'text-4xl' : 'text-2xl'} ${card?.accentColor}`}>
              {card?.value}
            </p>
            <p className="section-label mt-1">{card?.label}</p>
            <p className="text-2xs text-muted-foreground mt-1">{card?.subValue}</p>
          </div>
        );
      })}
    </div>
  );
}