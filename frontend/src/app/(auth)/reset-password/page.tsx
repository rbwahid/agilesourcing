'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useResetPassword } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidationError, getValidationErrors } from '@/lib/api/errors';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

interface ResetPasswordFormData {
  email: string;
  password: string;
  password_confirmation: string;
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: emailFromUrl || '',
    },
  });

  const password = watch('password');
  const validationErrors = isValidationError(error) ? getValidationErrors(error) : {};

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;

    resetPassword(
      {
        token,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
      {
        onSuccess: () => setIsSubmitted(true),
      }
    );
  };

  // No token provided
  if (!token) {
    return (
      <div className="space-y-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center animate-fade-in">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-serif text-3xl lg:text-4xl text-charcoal">
            Invalid reset link
          </h1>
          <p className="text-charcoal-light">
            This password reset link is invalid or has expired.
          </p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-charcoal hover:text-agile-teal transition-colors group"
          >
            <span>Request a new reset link</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="space-y-8 text-center">
        <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center animate-fade-in">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-serif text-3xl lg:text-4xl text-charcoal">
            Password reset!
          </h1>
          <p className="text-charcoal-light">
            Your password has been successfully reset.
            <br />
            You can now sign in with your new password.
          </p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link href="/login">
            <Button className="h-12 px-8 bg-charcoal hover:bg-charcoal-light text-white font-medium tracking-wide transition-all duration-300 group">
              Sign in now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="mx-auto w-14 h-14 bg-mint-accent/20 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-agile-teal" />
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl text-charcoal">
          Set new password
        </h1>
        <p className="text-charcoal-light">
          Your new password must be different from previously used passwords
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field (hidden if from URL, shown if not) */}
        {!emailFromUrl && (
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-charcoal tracking-wide"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-12 px-4 bg-white border-charcoal/10 focus:border-agile-teal focus:ring-agile-teal/20 placeholder:text-charcoal-light/40 transition-all duration-300"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email',
                },
              })}
            />
            {(errors.email || validationErrors.email) && (
              <p className="text-sm text-red-600 animate-fade-in">
                {errors.email?.message || validationErrors.email?.[0]}
              </p>
            )}
          </div>
        )}

        {/* Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-charcoal tracking-wide"
          >
            New password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              autoComplete="new-password"
              className="h-12 px-4 pr-12 bg-white border-charcoal/10 focus:border-agile-teal focus:ring-agile-teal/20 placeholder:text-charcoal-light/40 transition-all duration-300"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {(errors.password || validationErrors.password) && (
            <p className="text-sm text-red-600 animate-fade-in">
              {errors.password?.message || validationErrors.password?.[0]}
            </p>
          )}
          <p className="text-xs text-charcoal-light/70">
            Must be at least 8 characters
          </p>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password_confirmation"
            className="text-sm font-medium text-charcoal tracking-wide"
          >
            Confirm new password
          </Label>
          <Input
            id="password_confirmation"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your new password"
            autoComplete="new-password"
            className="h-12 px-4 bg-white border-charcoal/10 focus:border-agile-teal focus:ring-agile-teal/20 placeholder:text-charcoal-light/40 transition-all duration-300"
            {...register('password_confirmation', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />
          {errors.password_confirmation && (
            <p className="text-sm text-red-600 animate-fade-in">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        {/* General Error */}
        {error && !isValidationError(error) && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm animate-fade-in">
            An error occurred. The reset link may have expired. Please request a new one.
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-charcoal hover:bg-charcoal-light text-white font-medium tracking-wide transition-all duration-300 group"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Reset password
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-charcoal-light hover:text-charcoal transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-charcoal-light" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
