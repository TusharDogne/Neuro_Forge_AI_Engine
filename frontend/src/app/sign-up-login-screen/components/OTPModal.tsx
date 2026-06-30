'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, CheckCircle2, Mail } from 'lucide-react';

interface OTPModalProps {
  email: string;
  onClose: () => void;
  onVerified: () => void;
}

export default function OTPModal({ email, onClose, onVerified }: OTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Enter all 6 digits');
      return;
    }
    setIsLoading(true);
    // Backend: POST /api/v1/auth/verify-otp with { email, otp: code }
    await new Promise((r) => setTimeout(r, 1000));
    if (code === '123456') {
      setIsVerified(true);
      setTimeout(onVerified, 1200);
    } else {
      setError('Invalid OTP. Use 123456 for demo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-0/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-1 border border-border rounded-xl w-full max-w-sm card-elevation animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center">
              <Mail size={15} className="text-cyan-500" />
            </div>
            <div>
              <p className="text-sm font-600 text-foreground">Email Verification</p>
              <p className="text-2xs text-muted-foreground">OTP sent to your inbox</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-surface-2 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5">
          {isVerified ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={40} className="text-signal-green" />
              <p className="text-sm font-600 text-foreground">Verified Successfully</p>
              <p className="text-xs text-muted-foreground">Redirecting to console...</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Enter the 6-digit verification code sent to{' '}
                <span className="text-foreground font-500">{email}</span>
              </p>

              {/* OTP inputs */}
              <div className="flex items-center gap-2 justify-center mb-4">
                {otp.map((digit, i) => (
                  <input
                    key={`otp-${i}`}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="otp-input"
                  />
                ))}
              </div>

              {error && (
                <p className="text-xs text-signal-red text-center mb-3">{error}</p>
              )}

              <button
                onClick={handleVerify}
                disabled={isLoading}
                className="btn-primary w-full justify-center mb-3"
              >
                {isLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> Verifying...</>
                ) : (
                  'Verify Code'
                )}
              </button>

              <div className="text-center">
                {resendCountdown > 0 ? (
                  <p className="text-xs text-muted-foreground font-mono-data">
                    Resend in {resendCountdown}s
                  </p>
                ) : (
                  <button
                    onClick={() => setResendCountdown(30)}
                    className="text-xs text-copper-500 hover:text-copper-300 transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <p className="text-2xs text-muted-foreground text-center mt-3">Demo OTP: 123456</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}