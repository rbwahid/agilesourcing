<?php

namespace App\Jobs;

use App\Models\Design;
use App\Services\AI\VariationGeneratorService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateVariationsJob implements ShouldQueue
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
        public Design $design,
        public int $variationCount = 3
    ) {}

    /**
     * Execute the job.
     */
    public function handle(VariationGeneratorService $variationService): void
    {
        Log::info('GenerateVariationsJob started', [
            'design_id' => $this->design->id,
            'count' => $this->variationCount,
        ]);

        // Ensure design has completed analysis
        if (! $this->design->isAnalysisComplete()) {
            Log::warning('GenerateVariationsJob skipped - analysis not complete', [
                'design_id' => $this->design->id,
                'status' => $this->design->ai_analysis_status,
            ]);

            return;
        }

        try {
            // Generate variations
            $variations = $variationService->generateVariations(
                $this->design,
                $this->variationCount
            );

            Log::info('GenerateVariationsJob completed successfully', [
                'design_id' => $this->design->id,
                'variations_created' => count($variations),
            ]);
        } catch (\Exception $e) {
            Log::error('GenerateVariationsJob failed', [
                'design_id' => $this->design->id,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(?\Throwable $exception): void
    {
        Log::error('GenerateVariationsJob permanently failed', [
            'design_id' => $this->design->id,
            'error' => $exception?->getMessage(),
        ]);
    }

    /**
     * Get the tags that should be assigned to the job.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return ['variation-generation', 'design:'.$this->design->id];
    }
}
