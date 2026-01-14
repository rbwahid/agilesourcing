<?php

namespace App\Jobs;

use App\Models\Validation;
use App\Services\Instagram\InstagramService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PostToInstagramJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 2;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public array $backoff = [60, 120];

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Validation $validation
    ) {}

    /**
     * Execute the job.
     */
    public function handle(InstagramService $instagramService): void
    {
        Log::info('PostToInstagramJob started', [
            'validation_id' => $this->validation->id,
        ]);

        // Skip if already posted or cancelled
        if (! in_array($this->validation->status, ['pending'])) {
            Log::info('PostToInstagramJob skipped - invalid status', [
                'validation_id' => $this->validation->id,
                'status' => $this->validation->status,
            ]);

            return;
        }

        try {
            $connection = $this->validation->instagramConnection;
            $mockup = $this->validation->mockup;

            if (! $connection || ! $mockup) {
                throw new \Exception('Missing Instagram connection or mockup');
            }

            // Check token validity
            if ($connection->isTokenExpired()) {
                throw new \Exception('Instagram token has expired');
            }

            // Get the full image URL (must be publicly accessible)
            $imageUrl = $mockup->file_url;
            if (! $imageUrl) {
                throw new \Exception('Mockup image URL not available');
            }

            // Post to Instagram
            $result = $instagramService->publishMedia(
                $connection->access_token,
                $connection->instagram_user_id,
                $imageUrl,
                $this->validation->caption
            );

            // Update validation with Instagram post details
            $this->validation->update([
                'instagram_post_id' => $result['media_id'],
                'instagram_post_url' => $result['permalink'],
                'posted_at' => now(),
                'validation_ends_at' => now()->addHours($this->validation->validation_duration_hours),
                'status' => 'active',
            ]);

            Log::info('PostToInstagramJob completed successfully', [
                'validation_id' => $this->validation->id,
                'instagram_post_id' => $result['media_id'],
            ]);

            // Schedule the first insights fetch (after 1 hour)
            FetchInstagramInsightsJob::dispatch($this->validation)
                ->delay(now()->addHour());

        } catch (\Exception $e) {
            Log::error('PostToInstagramJob failed', [
                'validation_id' => $this->validation->id,
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
        Log::error('PostToInstagramJob permanently failed', [
            'validation_id' => $this->validation->id,
            'error' => $exception?->getMessage(),
        ]);

        $this->validation->update([
            'status' => 'failed',
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
            'instagram-post',
            'validation:'.$this->validation->id,
            'design:'.$this->validation->design_id,
        ];
    }
}
