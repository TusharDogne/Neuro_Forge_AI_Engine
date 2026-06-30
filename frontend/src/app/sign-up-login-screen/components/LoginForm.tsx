'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const DEMO_CREDENTIALS = [
  { role: 'ML Engineer', email: 'marcus.kim@neuroforge.ai', password: 'NF$Engineer2026' },
  { role: 'Admin', email: 'admin@neuroforge.ai', password: 'NF$Admin2026' },
  { role: 'Organization', email: 'org.lead@neuroforge.ai', password: 'NF$OrgLead2026' },
];

interface LoginFormProps {
  onOTPRequired: (email: string) => void;
}

export default function LoginForm({ onOTPRequired }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({ defaultValues: { remember: false } });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError('');
    // Backend: POST /api/v1/auth/login with { email, password }
    await new Promise((r) => setTimeout(r, 1200));

    const match = DEMO_CREDENTIALS.find(
      (c) => c.email === data.email && c.password === data.password
    );

    if (!match) {
      setServerError('Invalid credentials — use the demo accounts below to sign in.');
      setIsLoading(false);
      return;
    }

    // Backend: store JWT + refresh token, then redirect
    router.push('/user-dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 fade-in-up">
      <div>
        <label className="block text-xs font-500 text-foreground mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          className="input-field"
          placeholder="you@organization.ai"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' },
          })}
        />
        {errors.email && (
          <p className="text-xs text-signal-red mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-500 text-foreground">Password</label>
          <button
            type="button"
            className="text-2xs text-copper-500 hover:text-copper-300 transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-field pr-10"
            placeholder="••••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-signal-red mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember"
          className="w-3.5 h-3.5 rounded border-border bg-surface-2 accent-copper-500"
          {...register('remember')}
        />
        <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
          Keep me signed in for 30 days
        </label>
      </div>

      {serverError && (
        <div className="bg-signal-red/10 border border-signal-red/20 rounded px-3 py-2">
          <p className="text-xs text-signal-red">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Authenticating...
          </>
        ) : (
          <>
            <LogIn size={14} />
            Sign In to Console
          </>
        )}
      </button>

      <div className="relative flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-2xs text-muted-foreground">or continue with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        type="button"
        className="btn-ghost w-full justify-center gap-2 text-sm"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>
    </form>
  );
}