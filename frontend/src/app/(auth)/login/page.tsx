'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidationError, getValidationErrors } from '@/lib/api/errors';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const validationErrors = isValidationError(error) ? getValidationErrors(error) : {};

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl lg:text-4xl text-charcoal">
          Welcome back
        </h1>
        <p className="text-charcoal-light">
          Sign in to continue to your dashboard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
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

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-charcoal tracking-wide"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-agile-teal hover:text-charcoal transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="h-12 px-4 pr-12 bg-white border-charcoal/10 focus:border-agile-teal focus:ring-agile-teal/20 placeholder:text-charcoal-light/40 transition-all duration-300"
              {...register('password', {
                required: 'Password is required',
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
        </div>

        {/* General Error */}
        {error && !isValidationError(error) && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm animate-fade-in">
            An error occurred. Please try again.
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
              Sign in
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-charcoal/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-charcoal-light">
            New to AgileSourcing?
          </span>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 text-charcoal hover:text-agile-teal transition-colors group"
        >
          <span>Create an account</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
