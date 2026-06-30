'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OTPModal from './OTPModal';

export type AuthTab = 'login' | 'register';

export default function AuthPanel() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [showOTP, setShowOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');

  const handleOTPTrigger = (email: string) => {
    setOtpEmail(email);
    setShowOTP(true);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative overflow-y-auto">
      {/* Background grid */}
      <div className="absolute inset-0 grid-scan-line opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <AppLogo size={28} />
          <span className="text-base font-700 text-foreground">NeuroForge AI</span>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface-1 border border-border rounded-lg p-1 mb-6">
          {(['login', 'register'] as AuthTab[]).map((tab) => (
            <button
              key={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-500 rounded transition-all duration-150 ${
                activeTab === tab
                  ? 'bg-copper-500 text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Forms */}
        {activeTab === 'login' ? (
          <LoginForm onOTPRequired={handleOTPTrigger} />
        ) : (
          <RegisterForm onSuccess={() => setActiveTab('login')} onOTPRequired={handleOTPTrigger} />
        )}

        {/* Demo credentials */}
        <DemoCredentials onFill={(email, password) => {
          // Autofill handled via custom event or prop drilling
        }} />
      </div>

      {/* OTP Modal */}
      {showOTP && (
        <OTPModal
          email={otpEmail}
          onClose={() => setShowOTP(false)}
          onVerified={() => {
            setShowOTP(false);
            // Backend: redirect to dashboard after OTP verification
          }}
        />
      )}
    </div>
  );
}

// Inline AppLogo import for mobile
import AppLogo from '@/components/ui/AppLogo';
import DemoCredentials from './DemoCredentials'
;