'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface DemoCredentialsProps {
  onFill?: (email: string, password: string) => void;
}

const credentials = [
  { role: 'ML Engineer', email: 'marcus.kim@neuroforge.ai', password: 'NF$Engineer2026', badge: 'badge-cyan' },
  { role: 'Admin', email: 'admin@neuroforge.ai', password: 'NF$Admin2026', badge: 'badge-copper' },
  { role: 'Organization', email: 'org.lead@neuroforge.ai', password: 'NF$OrgLead2026', badge: 'badge-muted' },
];

export default function DemoCredentials({ onFill }: DemoCredentialsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mt-5 border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-2 border-b border-border">
        <Terminal size={12} className="text-copper-500" />
        <span className="text-2xs font-mono-data text-muted-foreground tracking-widest">DEMO ACCESS CREDENTIALS</span>
      </div>
      <div className="divide-y divide-border">
        {credentials.map((cred, i) => (
          <div key={`cred-${i}`} className="px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-surface-2/50 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <span className={cred.badge}>{cred.role}</span>
              <span className="text-2xs font-mono-data text-muted-foreground truncate">{cred.email}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => handleCopy(cred.email, `email-${i}`)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
                title="Copy email"
              >
                {copiedId === `email-${i}` ? <Check size={11} className="text-signal-green" /> : <Copy size={11} />}
              </button>
              <button
                onClick={() => handleCopy(cred.password, `pw-${i}`)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
                title="Copy password"
              >
                {copiedId === `pw-${i}` ? <Check size={11} className="text-signal-green" /> : <Copy size={11} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}