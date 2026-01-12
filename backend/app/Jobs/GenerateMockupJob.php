<?php

namespace App\Jobs;

use App\Models\Mockup;
use App\Services\AI\MockupGeneratorService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateMockupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 2;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public array $backoff = [30, 60];

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     */
    public int $maxExceptions = 2;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Mockup $mockup
    ) {}

    /**
     * Execute the job.
     */
    public function handle(MockupGeneratorService $generatorService): void
    {
        Log::info('GenerateMockupJob started', [
            'mockup_id' => $this->mockup->id,
            'design_id' => $this->mockup->design_id,
        ]);

        try {
            $generatorService->processMockup($this->mockup);

            Log::info('GenerateMockupJob completed successfully', [
                'mockup_id' => $this->mockup->id,
            ]);
        } catch (\Exception $e) {
            Log::error('GenerateMockupJob failed', [
                'mockup_id' => $this->mockup->id,
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
        Log::error('GenerateMockupJob permanently failed', [
            'mockup_id' => $this->mockup->id,
            'error' => $exception?->getMessage(),
        ]);

        $this->mockup->update([
            'status' => 'failed',
            'error_message' => $exception?->getMessage() ?? 'Unknown error',
        ]);
    }

    /**
     * Get the tags that should be assigned to the job.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return [
            'mockup-generation',
            'mockup:' . $this->mockup->id,
            'design:' . $this->mockup->design_id,
        ];
    }
}
