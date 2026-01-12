'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidationError, getValidationErrors } from '@/lib/api/errors';
import { Eye, EyeOff, ArrowRight, Loader2, Palette, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'designer' | 'supplier';
}

const roles = [
  {
    value: 'designer' as const,
    label: 'Designer',
    description: 'Upload designs and get validation feedback',
    icon: Palette,
  },
  {
    value: 'supplier' as const,
    label: 'Supplier',
    description: 'Discover trending designs to manufacture',
    icon: Package,
  },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: registerUser, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'designer',
    },
  });

  const selectedRole = watch('role');
  const password = watch('password');
  const validationErrors = isValidationError(error) ? getValidationErrors(error) : {};

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl lg:text-4xl text-charcoal">
          Create your account
        </h1>
        <p className="text-charcoal-light">
          Join the fashion validation revolution
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-charcoal tracking-wide">
            I am a
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue('role', role.value)}
                  className={cn(
                    'relative p-4 text-left border-2 transition-all duration-300',
                    isSelected
                      ? 'border-agile-teal bg-mint-accent/10'
                      : 'border-charcoal/10 bg-white hover:border-charcoal/20'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-6 h-6 mb-2',
                      isSelected ? 'text-agile-teal' : 'text-charcoal-light'
                    )}
                  />
                  <p
                    className={cn(
                      'font-medium text-sm',
                      isSelected ? 'text-charcoal' : 'text-charcoal-light'
                    )}
                  >
                    {role.label}
                  </p>
                  <p className="text-xs text-charcoal-light/70 mt-1">
                    {role.description}
                  </p>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-agile-teal rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register('role', { required: true })} />
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-charcoal tracking-wide"
          >
            Full name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            className="h-12 px-4 bg-white border-charcoal/10 focus:border-agile-teal focus:ring-agile-teal/20 placeholder:text-charcoal-light/40 transition-all duration-300"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />
          {(errors.name || validationErrors.name) && (
            <p className="text-sm text-red-600 animate-fade-in">
              {errors.name?.message || validationErrors.name?.[0]}
            </p>
          )}
        </div>

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
          <Label
            htmlFor="password"
            className="text-sm font-medium text-charcoal tracking-wide"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
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
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password_confirmation"
            className="text-sm font-medium text-charcoal tracking-wide"
          >
            Confirm password
          </Label>
          <Input
            id="password_confirmation"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
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
              Create account
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-charcoal-light/70 text-center">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-charcoal hover:text-agile-teal">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-charcoal hover:text-agile-teal">
            Privacy Policy
          </Link>
        </p>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-charcoal/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-charcoal-light">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-charcoal hover:text-agile-teal transition-colors group"
        >
          <span>Sign in instead</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
