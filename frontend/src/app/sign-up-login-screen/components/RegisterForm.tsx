'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus, Loader2, Building2, User, Shield } from 'lucide-react';

interface RegisterFormData {
  fullName: string;
  email: string;
  organization: string;
  role: 'user' | 'admin' | 'organization';
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface RegisterFormProps {
  onSuccess: () => void;
  onOTPRequired: (email: string) => void;
}

const roleOptions = [
  { value: 'user', label: 'ML Engineer / Data Scientist', icon: User },
  { value: 'admin', label: 'Platform Administrator', icon: Shield },
  { value: 'organization', label: 'Organization Lead', icon: Building2 },
];

export default function RegisterForm({ onSuccess, onOTPRequired }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({ defaultValues: { role: 'user' } });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    // Backend: POST /api/v1/auth/register with registration payload
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    onOTPRequired(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 fade-in-up">
      <div>
        <label className="block text-xs font-500 text-foreground mb-1.5">Full Name</label>
        <input
          type="text"
          className="input-field"
          placeholder="Dr. Sarah Chen"
          {...register('fullName', { required: 'Full name is required' })}
        />
        {errors.fullName && <p className="text-xs text-signal-red mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-500 text-foreground mb-1.5">Work Email</label>
        <input
          type="email"
          className="input-field"
          placeholder="you@company.com"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Valid email required' },
          })}
        />
        {errors.email && <p className="text-xs text-signal-red mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-500 text-foreground mb-1.5">Organization</label>
        <input
          type="text"
          className="input-field"
          placeholder="Acme ML Labs"
          {...register('organization', { required: 'Organization is required' })}
        />
        {errors.organization && <p className="text-xs text-signal-red mt-1">{errors.organization.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-500 text-foreground mb-1.5">Account Role</label>
        <select
          className="input-field"
          {...register('role', { required: true })}
        >
          {roleOptions.map((r) => (
            <option key={`role-${r.value}`} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-500 text-foreground mb-1.5">Password</label>
        <p className="text-2xs text-muted-foreground mb-1.5">Min. 12 characters, include uppercase, number, symbol</p>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-field pr-10"
            placeholder="••••••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 12, message: 'Minimum 12 characters' },
            })}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-signal-red mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-500 text-foreground mb-1.5">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            className="input-field pr-10"
            placeholder="••••••••••••"
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (v) => v === password || 'Passwords do not match',
            })}
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-signal-red mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex items-start gap-2 pt-1">
        <input
          type="checkbox"
          id="terms"
          className="w-3.5 h-3.5 mt-0.5 rounded border-border bg-surface-2 accent-copper-500"
          {...register('agreeTerms', { required: 'You must agree to the terms' })}
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer leading-snug">
          I agree to the{' '}
          <span className="text-copper-500 hover:text-copper-300 cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="text-copper-500 hover:text-copper-300 cursor-pointer">Privacy Policy</span>
        </label>
      </div>
      {errors.agreeTerms && <p className="text-xs text-signal-red">{errors.agreeTerms.message}</p>}

      <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
        {isLoading ? (
          <><Loader2 size={14} className="animate-spin" /> Creating Account...</>
        ) : (
          <><UserPlus size={14} /> Create Research Account</>
        )}
      </button>
    </form>
  );
}