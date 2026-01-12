'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDesign } from '@/lib/api/designs';
import { designKeys } from './use-designs';
import type { AIAnalysisStatus } from '@/types/design';

interface UseDesignPollingOptions {
  /**
   * Whether polling is enabled
   */
  enabled?: boolean;
  /**
   * Polling interval in milliseconds (default: 5000)
   */
  pollInterval?: number;
  /**
   * Callback when analysis completes
   */
  onAnalysisComplete?: () => void;
  /**
   * Callback when analysis fails
   */
  onAnalysisFailed?: () => void;
}

/**
 * Hook for polling design status during AI analysis
 *
 * Automatically polls every 5 seconds while the design's AI analysis
 * status is 'pending' or 'processing'. Stops polling when completed or failed.
 */
export function useDesignPolling(
  designId: number,
  options: UseDesignPollingOptions = {}
) {
  const {
    enabled = true,
    pollInterval = 5000,
    onAnalysisComplete,
    onAnalysisFailed,
  } = options;

  const queryClient = useQueryClient();

  return useQuery({
    queryKey: designKeys.detail(designId),
    queryFn: () => getDesign(designId),
    enabled: enabled && !!designId,
    staleTime: 0, // Always consider data stale during polling
    refetchInterval: (query) => {
      const status = query.state.data?.ai_analysis_status as
        | AIAnalysisStatus
        | undefined;

      // Poll while pending or processing
      if (status === 'pending' || status === 'processing') {
        return pollInterval;
      }

      // Trigger callbacks on status change
      const previousStatus = queryClient.getQueryData<{ ai_analysis_status: AIAnalysisStatus }>(
        designKeys.detail(designId)
      )?.ai_analysis_status;

      if (previousStatus !== status) {
        if (status === 'completed' && onAnalysisComplete) {
          onAnalysisComplete();
        } else if (status === 'failed' && onAnalysisFailed) {
          onAnalysisFailed();
        }
      }

      // Stop polling when completed or failed
      return false;
    },
  });
}

/**
 * Hook to check if a design is currently being analyzed
 */
export function useIsAnalyzing(designId: number): boolean {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<{ ai_analysis_status: AIAnalysisStatus }>(
    designKeys.detail(designId)
  );

  return data?.ai_analysis_status === 'pending' || data?.ai_analysis_status === 'processing';
}
