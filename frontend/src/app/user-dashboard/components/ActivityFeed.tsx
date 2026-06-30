import React from 'react';
import { FlaskConical, Database, Rocket, AlertTriangle, CheckCircle2, Upload, Bot } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const activities = [
  {
    id: 'act-001',
    type: 'experiment_complete',
    icon: CheckCircle2,
    iconColor: 'text-signal-green',
    iconBg: 'bg-signal-green/10',
    title: 'Experiment exp-2847 completed',
    detail: 'XGBoost Classifier · 94.2% accuracy · 50 epochs',
    time: '18 minutes ago',
    tag: 'EXP',
    tagClass: 'badge-copper',
  },
  {
    id: 'act-002',
    type: 'drift_alert',
    icon: AlertTriangle,
    iconColor: 'text-signal-red',
    iconBg: 'bg-signal-red/10',
    title: 'Data drift detected: revenue-lstm-v2',
    detail: 'PSI score 0.241 exceeds threshold 0.15 · Requires retraining',
    time: '42 minutes ago',
    tag: 'DRIFT',
    tagClass: 'badge-red',
  },
  {
    id: 'act-003',
    type: 'dataset_upload',
    icon: Upload,
    iconColor: 'text-signal-blue',
    iconBg: 'bg-signal-blue/10',
    title: 'Dataset uploaded: customer_behavior_q2_2026.parquet',
    detail: '2.4M rows · 47 features · Auto-profiling initiated',
    time: '1 hour ago',
    tag: 'DATA',
    tagClass: 'badge-cyan',
  },
  {
    id: 'act-004',
    type: 'deployment',
    icon: Rocket,
    iconColor: 'text-copper-500',
    iconBg: 'bg-copper-500/10',
    title: 'Model deployed: fraud-rf-v4',
    detail: 'FastAPI endpoint · /api/v1/predict/fraud · Response 18ms',
    time: '3 hours ago',
    tag: 'DEPLOY',
    tagClass: 'badge-copper',
  },
  {
    id: 'act-005',
    type: 'chatbot',
    icon: Bot,
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-500/10',
    title: 'Chatbot project created: Customer Support Bot v2',
    detail: 'Type: Customer Support · Knowledge base: 142 documents',
    time: '5 hours ago',
    tag: 'BOT',
    tagClass: 'badge-cyan',
  },
  {
    id: 'act-006',
    type: 'experiment_start',
    icon: FlaskConical,
    iconColor: 'text-signal-amber',
    iconBg: 'bg-signal-amber/10',
    title: 'Experiment exp-2848 queued',
    detail: 'LightGBM · churn_dataset_v3.csv · Auto-hyperparameter tuning',
    time: '6 hours ago',
    tag: 'EXP',
    tagClass: 'badge-copper',
  },
  {
    id: 'act-007',
    type: 'dataset_profile',
    icon: Database,
    iconColor: 'text-signal-blue',
    iconBg: 'bg-signal-blue/10',
    title: 'Data profiling completed: sales_q1_2026.csv',
    detail: '128k rows · Health score 78/100 · 3 recommendations generated',
    time: '8 hours ago',
    tag: 'DATA',
    tagClass: 'badge-cyan',
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-lg card-elevation">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <p className="text-sm font-600 text-foreground">Recent Activity</p>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all</button>
      </div>
      <div className="divide-y divide-border">
        {activities?.map((act) => {
          const Icon = act?.icon;
          return (
            <div key={act?.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface-2/30 transition-colors duration-150 cursor-default">
              <div className={`w-8 h-8 rounded ${act?.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={14} className={act?.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={act?.tagClass}>{act?.tag}</span>
                  <p className="text-xs font-500 text-foreground">{act?.title}</p>
                </div>
                <p className="text-2xs text-muted-foreground mt-0.5 leading-snug">{act?.detail}</p>
              </div>
              <span className="text-2xs font-mono-data text-muted-foreground flex-shrink-0 mt-0.5 whitespace-nowrap">{act?.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}