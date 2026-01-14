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

class FetchInstagramInsightsJob implements ShouldQueue
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
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 30;

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
        Log::info('FetchInstagramInsightsJob started', [
            'validation_id' => $this->validation->id,
        ]);

        // Skip if not active or already ended
        if ($this->validation->status !== 'active') {
            Log::info('FetchInstagramInsightsJob skipped - not active', [
                'validation_id' => $this->validation->id,
                'status' => $this->validation->status,
            ]);

            return;
        }

        try {
            $connection = $this->validation->instagramConnection;

            if (! $connection || ! $this->validation->instagram_post_id) {
                throw new \Exception('Missing Instagram connection or post ID');
            }

            // Fetch current metrics
            $insights = $instagramService->getMediaInsights(
                $connection->access_token,
                $this->validation->instagram_post_id
            );

            // Update validation metrics
            $this->validation->update([
                'likes_count' => $insights['likes'],
                'comments_count' => $insights['comments'],
                'shares_count' => $insights['shares'],
                'saves_count' => $insights['saves'],
            ]);

            // Calculate and update engagement rate
            $followers = $connection->followers_count ?: 1;
            $totalEngagement = $insights['likes'] + $insights['comments'] + $insights['shares'] + $insights['saves'];
            $engagementRate = ($totalEngagement / $followers) * 100;

            $this->validation->update([
                'engagement_rate' => round($engagementRate, 4),
            ]);

            // Append to hourly metrics
            $this->validation->appendHourlyMetric([
                'likes' => $insights['likes'],
                'comments' => $insights['comments'],
                'shares' => $insights['shares'],
                'saves' => $insights['saves'],
                'reach' => $insights['reach'] ?? 0,
                'impressions' => $insights['impressions'] ?? 0,
            ]);

            Log::info('FetchInstagramInsightsJob metrics updated', [
                'validation_id' => $this->validation->id,
                'likes' => $insights['likes'],
                'engagement_rate' => $engagementRate,
            ]);

            // Check if validation period has ended
            if ($this->validation->hasEnded()) {
                // Dispatch finalization job
                FinalizeValidationJob::dispatch($this->validation);
            } else {
                // Schedule next fetch in 1 hour
                self::dispatch($this->validation)
                    ->delay(now()->addHour());
            }

        } catch (\Exception $e) {
            Log::error('FetchInstagramInsightsJob failed', [
                'validation_id' => $this->validation->id,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            // If not final attempt, let it retry
            if ($this->attempts() < $this->tries) {
                throw $e;
            }

            // On final attempt, schedule next try in 1 hour anyway
            // (to continue tracking even if there were temporary issues)
            if (! $this->validation->hasEnded()) {
                self::dispatch($this->validation)
                    ->delay(now()->addHour());
            }
        }
    }

    /**
     * Get the tags that should be assigned to the job.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return [
            'instagram-insights',
            'validation:'.$this->validation->id,
        ];
    }
}
