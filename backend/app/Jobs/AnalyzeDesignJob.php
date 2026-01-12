<?php

namespace App\Jobs;

use App\Models\Design;
use App\Services\AI\DesignAnalysisService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AnalyzeDesignJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public array $backoff = [30, 60, 120];

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     */
    public int $maxExceptions = 2;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Design $design
    ) {}

    /**
     * Execute the job.
     */
    public function handle(DesignAnalysisService $analysisService): void
    {
        Log::info('AnalyzeDesignJob started', ['design_id' => $this->design->id]);

        // Update status to processing
        $this->design->update(['ai_analysis_status' => 'processing']);

        try {
            // Perform the AI analysis
            $analysis = $analysisService->analyzeDesign($this->design);

            // Store the results
            $this->design->update([
                'ai_analysis_status' => 'completed',
                'ai_analysis_result' => $analysis,
                'trend_score' => $analysis['trend_score'] ?? null,
            ]);

            Log::info('AnalyzeDesignJob completed successfully', [
                'design_id' => $this->design->id,
                'trend_score' => $analysis['trend_score'] ?? null,
            ]);

            // Optionally dispatch variation generation job
            // GenerateVariationsJob::dispatch($this->design);
        } catch (\Exception $e) {
            Log::error('AnalyzeDesignJob failed', [
                'design_id' => $this->design->id,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            // If this is the final attempt, mark as failed
            if ($this->attempts() >= $this->tries) {
                $this->design->update([
                    'ai_analysis_status' => 'failed',
                    'ai_analysis_result' => [
                        'error' => 'Analysis failed after multiple attempts',
                        'last_error' => $e->getMessage(),
                    ],
                ]);
            }

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(?\Throwable $exception): void
    {
        Log::error('AnalyzeDesignJob permanently failed', [
            'design_id' => $this->design->id,
            'error' => $exception?->getMessage(),
        ]);

        $this->design->update([
            'ai_analysis_status' => 'failed',
            'ai_analysis_result' => [
                'error' => 'Analysis failed',
                'message' => $exception?->getMessage(),
            ],
        ]);
    }

    /**
     * Get the tags that should be assigned to the job.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return ['design-analysis', 'design:'.$this->design->id];
    }
}
