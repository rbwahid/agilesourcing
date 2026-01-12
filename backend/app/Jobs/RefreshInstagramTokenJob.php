<?php

namespace App\Jobs;

use App\Models\InstagramConnection;
use App\Services\Instagram\InstagramService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RefreshInstagramTokenJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public array $backoff = [60, 300, 600];

    /**
     * Execute the job.
     * This job should be scheduled to run daily.
     */
    public function handle(InstagramService $instagramService): void
    {
        Log::info('RefreshInstagramTokenJob started');

        // Find all connections with tokens expiring in the next 7 days
        $expiringConnections = InstagramConnection::query()
            ->where('token_expires_at', '<=', now()->addDays(7))
            ->where('token_expires_at', '>', now())
            ->get();

        Log::info('Found connections with expiring tokens', [
            'count' => $expiringConnections->count(),
        ]);

        $refreshed = 0;
        $failed = 0;

        foreach ($expiringConnections as $connection) {
            try {
                $success = $instagramService->refreshToken($connection);

                if ($success) {
                    $refreshed++;
                    Log::info('Token refreshed', [
                        'connection_id' => $connection->id,
                        'user_id' => $connection->user_id,
                    ]);
                } else {
                    $failed++;
                    Log::warning('Token refresh returned false', [
                        'connection_id' => $connection->id,
                    ]);
                }
            } catch (\Exception $e) {
                $failed++;
                Log::error('Token refresh failed', [
                    'connection_id' => $connection->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Log::info('RefreshInstagramTokenJob completed', [
            'refreshed' => $refreshed,
            'failed' => $failed,
        ]);
    }

    /**
     * Get the tags that should be assigned to the job.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return ['instagram-token-refresh'];
    }
}
