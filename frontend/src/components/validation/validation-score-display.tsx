'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getScoreInterpretation } from '@/types/validation';
import { TrendingUp, Target, Sparkles } from 'lucide-react';

interface ValidationScoreDisplayProps {
  score: number | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function ValidationScoreDisplay({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
  className,
}: ValidationScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const interpretation = getScoreInterpretation(score);

  // Animate score on mount
  useEffect(() => {
    if (!animated || score === null) {
      setDisplayScore(score ?? 0);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score, animated]);

  const sizeConfig = {
    sm: {
      container: 'h-20 w-20',
      circle: 'h-16 w-16',
      score: 'text-2xl',
      label: 'text-[10px]',
      stroke: 6,
    },
    md: {
      container: 'h-32 w-32',
      circle: 'h-28 w-28',
      score: 'text-4xl',
      label: 'text-xs',
      stroke: 8,
    },
    lg: {
      container: 'h-44 w-44',
      circle: 'h-40 w-40',
      score: 'text-6xl',
      label: 'text-sm',
      stroke: 10,
    },
  };

  const config = sizeConfig[size];

  // Calculate SVG parameters
  const radius = (size === 'sm' ? 64 : size === 'md' ? 112 : 160) / 2 - config.stroke;
  const circumference = 2 * Math.PI * radius;
  const progress = score !== null ? (score / 100) * circumference : 0;

  // Color based on score
  const getColor = () => {
    if (score === null) return '#9CA3AF'; // gray-400
    if (score >= 80) return '#10B981'; // emerald-500
    if (score >= 60) return '#22C55E'; // green-500
    if (score >= 40) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className={cn('relative', config.container)}>
        {/* Background circle */}
        <svg className="absolute inset-0 -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius / (size === 'sm' ? 0.64 : size === 'md' ? 1.12 : 1.6)}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={config.stroke / (size === 'sm' ? 0.64 : size === 'md' ? 1.12 : 1.6)}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius / (size === 'sm' ? 0.64 : size === 'md' ? 1.12 : 1.6)}
            fill="none"
            stroke={getColor()}
            strokeWidth={config.stroke / (size === 'sm' ? 0.64 : size === 'md' ? 1.12 : 1.6)}
            strokeLinecap="round"
            strokeDasharray={circumference / (size === 'sm' ? 0.64 : size === 'md' ? 1.12 : 1.6)}
            strokeDashoffset={
              (circumference - progress) / (size === 'sm' ? 0.64 : size === 'md' ? 1.12 : 1.6)
            }
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center rounded-full bg-white shadow-inner',
            'm-auto',
            config.circle
          )}
        >
          {score !== null ? (
            <>
              <span className={cn('font-bold text-charcoal', config.score)}>
                {displayScore}
              </span>
              <span className={cn('text-gray-500 -mt-1', config.label)}>/ 100</span>
            </>
          ) : (
            <>
              <Target className={cn('text-gray-300', size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12')} />
              <span className={cn('text-gray-400 mt-1', config.label)}>Pending</span>
            </>
          )}
        </div>
      </div>

      {showLabel && score !== null && (
        <div className="text-center">
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
              interpretation.color === 'green' && 'bg-emerald-50 text-emerald-700',
              interpretation.color === 'emerald' && 'bg-green-50 text-green-700',
              interpretation.color === 'amber' && 'bg-amber-50 text-amber-700',
              interpretation.color === 'red' && 'bg-red-50 text-red-700',
              interpretation.color === 'gray' && 'bg-gray-100 text-gray-600'
            )}
          >
            {interpretation.color === 'green' && <Sparkles className="h-3.5 w-3.5" />}
            {interpretation.color === 'emerald' && <TrendingUp className="h-3.5 w-3.5" />}
            {interpretation.label}
          </div>
          <p className="mt-1 text-xs text-gray-500 max-w-[200px]">
            {interpretation.description}
          </p>
        </div>
      )}
    </div>
  );
}
