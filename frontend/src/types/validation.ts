/**
 * Validation types for Instagram validation campaigns
 */

import type { Design } from './design';
import type { Mockup } from './instagram';

/**
 * Validation status type
 */
export type ValidationStatus = 'pending' | 'active' | 'completed' | 'failed' | 'cancelled';

/**
 * Validation duration in hours
 */
export type ValidationDuration = 24 | 48 | 72 | 168;

/**
 * Hourly metric snapshot
 */
export interface HourlyMetric {
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach?: number;
  impressions?: number;
}

/**
 * Validation interface
 */
export interface Validation {
  id: number;
  design_id: number;
  design?: {
    id: number;
    title: string;
  };
  mockup?: {
    id: number;
    file_url: string | null;
  };
  instagram_post_id: string | null;
  instagram_post_url: string | null;
  caption: string;
  status: ValidationStatus;
  validation_duration_hours: ValidationDuration;
  posted_at: string | null;
  validation_ends_at: string | null;
  time_remaining: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  engagement_rate: number | null;
  validation_score: number | null;
  is_winner: boolean;
  hourly_metrics?: HourlyMetric[];
  instagram_connection?: {
    username: string;
    followers_count: number;
  };
  created_at: string;
}

/**
 * Validation metrics response
 */
export interface ValidationMetrics {
  validation_id: number;
  status: ValidationStatus;
  total_engagement: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  engagement_rate: number | null;
  validation_score: number | null;
  peak_hour: string | null;
  hourly_breakdown: HourlyMetric[];
  time_remaining: string | null;
  has_ended: boolean;
}

/**
 * Create validation request data
 */
export interface CreateValidationData {
  mockup_id: number;
  caption: string;
  validation_duration_hours: ValidationDuration;
}

/**
 * Validation list filters
 */
export interface ValidationFilters {
  status?: ValidationStatus;
  per_page?: number;
  page?: number;
}

/**
 * Validation duration options
 */
export const VALIDATION_DURATIONS = [
  { value: 24 as const, label: '24 Hours', description: 'Quick validation' },
  { value: 48 as const, label: '48 Hours', description: 'Standard validation' },
  { value: 72 as const, label: '72 Hours', description: 'Extended validation' },
  { value: 168 as const, label: '7 Days', description: 'Full week analysis' },
];

/**
 * Get score interpretation
 */
export function getScoreInterpretation(score: number | null): {
  label: string;
  color: string;
  description: string;
} {
  if (score === null) {
    return {
      label: 'Pending',
      color: 'gray',
      description: 'Score not yet calculated',
    };
  }

  if (score >= 80) {
    return {
      label: 'Excellent',
      color: 'green',
      description: 'Outstanding engagement - strong market potential',
    };
  }

  if (score >= 60) {
    return {
      label: 'Good',
      color: 'emerald',
      description: 'Above average engagement - positive reception',
    };
  }

  if (score >= 40) {
    return {
      label: 'Average',
      color: 'amber',
      description: 'Moderate engagement - consider refinements',
    };
  }

  return {
    label: 'Below Average',
    color: 'red',
    description: 'Low engagement - may need significant changes',
  };
}

/**
 * Calculate total engagement
 */
export function calculateTotalEngagement(validation: Validation): number {
  return (
    validation.likes_count +
    validation.comments_count +
    validation.shares_count +
    validation.saves_count
  );
}

/**
 * Format engagement rate for display
 */
export function formatEngagementRate(rate: number | null): string {
  if (rate === null) return '-';
  return `${rate.toFixed(2)}%`;
}
