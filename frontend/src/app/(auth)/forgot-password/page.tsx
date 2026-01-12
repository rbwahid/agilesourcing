'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidationError, getValidationErrors } from '@/lib/api/errors';
import { ArrowLeft, ArrowRight, Loader2, Mail, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: sendResetLink, isPending, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const email = watch('email');
  const validationErrors = isValidationError(error) ? getValidationErrors(error) : {};

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendResetLink(data.email, {
      onSuccess: () => setIsSubmitted(true),
    });
  };

  if (isSubmitted) {
    return (
      <div className="space-y-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center animate-fade-in">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Header */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-serif text-3xl lg:text-4xl text-charcoal">
            Check your email
          </h1>
          <p className="text-charcoal-light">
            We&apos;ve sent a password reset link to
          </p>
          <p className="font-medium text-charcoal">{email}</p>
        </div>

        {/* Info */}
        <div
          className="p-4 bg-mint-accent/20 border border-mint-accent/30 text-sm text-charcoal-light animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <p>
            Didn&apos;t receive the email? Check your spam folder, or{' '}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-charcoal hover:text-agile-teal font-medium"
            >
              try again
            </button>
          </p>
        </div>

        {/* Back to Login */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-charcoal hover:text-agile-teal transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to sign in</span>
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
          <Mail className="w-6 h-6 text-agile-teal" />
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl text-charcoal">
          Forgot password?
        </h1>
        <p className="text-charcoal-light">
          No worries, we&apos;ll send you reset instructions
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
              Send reset link
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
