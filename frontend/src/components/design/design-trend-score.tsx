'use client';

import { cn } from '@/lib/utils';

interface DesignTrendScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

function getScoreColor(score: number): {
  gradient: string;
  text: string;
  bg: string;
  label: string;
} {
  if (score >= 70) {
    return {
      gradient: 'from-emerald-400 to-green-500',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      label: 'High Trend Alignment',
    };
  }
  if (score >= 40) {
    return {
      gradient: 'from-amber-400 to-yellow-500',
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      label: 'Moderate Alignment',
    };
  }
  return {
    gradient: 'from-rose-400 to-red-500',
    text: 'text-rose-600',
    bg: 'bg-rose-50',
    label: 'Low Alignment',
  };
}

const sizes = {
  sm: {
    container: 'h-16 w-16',
    ring: 'h-14 w-14',
    text: 'text-lg',
    label: 'text-[10px]',
  },
  md: {
    container: 'h-24 w-24',
    ring: 'h-20 w-20',
    text: 'text-2xl',
    label: 'text-xs',
  },
  lg: {
    container: 'h-32 w-32',
    ring: 'h-28 w-28',
    text: 'text-3xl',
    label: 'text-sm',
  },
};

export function DesignTrendScore({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
}: DesignTrendScoreProps) {
  const colors = getScoreColor(score);
  const sizeClasses = sizes[size];

  // Calculate the circumference and offset for the circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Circular Progress */}
      <div className={cn('relative', sizeClasses.container)}>
        {/* Background ring */}
        <svg
          className="absolute inset-0 -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-100"
          />
          {/* Progress ring with gradient */}
          <defs>
            <linearGradient id={`scoreGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={cn('stop-color-current', colors.gradient.split(' ')[0].replace('from-', 'text-'))} />
              <stop offset="100%" className={cn('stop-color-current', colors.gradient.split(' ')[1].replace('to-', 'text-'))} />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={`url(#scoreGradient-${score})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? circumference : offset}
            className={cn(
              'transition-all duration-1000 ease-out',
              animated && 'animate-score-fill'
            )}
            style={
              animated
                ? {
                    animation: 'scoreFill 1.5s ease-out forwards',
                    '--score-offset': offset,
                  } as React.CSSProperties
                : { strokeDashoffset: offset }
            }
          />
        </svg>

        {/* Score text */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center',
            sizeClasses.ring
          )}
          style={{ margin: 'auto' }}
        >
          <span className={cn('font-bold tabular-nums', sizeClasses.text, colors.text)}>
            {score}
          </span>
          <span className={cn('font-medium text-gray-400', sizeClasses.label)}>
            / 100
          </span>
        </div>

        {/* Glow effect */}
        <div
          className={cn(
            'absolute inset-0 rounded-full opacity-20 blur-xl',
            `bg-gradient-to-br ${colors.gradient}`
          )}
          style={{ transform: 'scale(0.8)' }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <div
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            colors.bg,
            colors.text
          )}
        >
          {colors.label}
        </div>
      )}

      {/* Add keyframes via style tag */}
      <style jsx>{`
        @keyframes scoreFill {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: ${offset};
          }
        }
      `}</style>
    </div>
  );
}
