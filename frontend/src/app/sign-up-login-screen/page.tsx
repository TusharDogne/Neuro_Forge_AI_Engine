import React from 'react';
import AuthPanel from './components/AuthPanel';
import BrandPanel from './components/BrandPanel';

export default function SignUpLoginPage() {
  return (
    <div className="min-h-screen bg-surface-0 flex overflow-hidden">
      <BrandPanel />
      <AuthPanel />
    </div>
  );
}