<?php

namespace App\Jobs;

use App\Models\Validation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class FinalizeValidationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Validation $validation
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('FinalizeValidationJob started', [
            'validation_id' => $this->validation->id,
        ]);

        // Skip if already finalized
        if ($this->validation->status === 'completed') {
            return;
        }

        // Calculate validation score
        $score = $this->calculateValidationScore();

        // Update validation
        $this->validation->update([
            'status' => 'completed',
            'validation_score' => $score,
        ]);

        // Check if this is the winning validation for the design
        $this->checkForWinner();

        Log::info('FinalizeValidationJob completed', [
            'validation_id' => $this->validation->id,
            'validation_score' => $score,
        ]);

        // TODO: Send notification to user about completed validation
    }

    /**
     * Calculate the validation score based on engagement metrics.
     *
     * Scoring formula (0-100):
     * - Likes: 20% weight (benchmark: 3% of followers)
     * - Comments: 30% weight (benchmark: 0.1% of followers)
     * - Saves: 35% weight (benchmark: 2% of followers) - indicates purchase intent
     * - Shares: 15% weight (benchmark: 0.5% of followers)
     */
    private function calculateValidationScore(): int
    {
        $followers = $this->validation->instagramConnection?->followers_count ?? 1;

        // Weight configuration
        $weights = [
            'likes' => 0.20,
            'comments' => 0.30,
            'saves' => 0.35,
            'shares' => 0.15,
        ];

        // Benchmark percentages (what would be considered "100%" performance)
        $benchmarks = [
            'likes' => $followers * 0.03,      // 3% of followers
            'comments' => $followers * 0.001,  // 0.1% of followers
            'saves' => $followers * 0.02,      // 2% of followers
            'shares' => $followers * 0.005,    // 0.5% of followers
        ];

        // Calculate normalized scores
        $scores = [
            'likes' => $this->normalize($this->validation->likes_count, $benchmarks['likes']),
            'comments' => $this->normalize($this->validation->comments_count, $benchmarks['comments']),
            'saves' => $this->normalize($this->validation->saves_count, $benchmarks['saves']),
            'shares' => $this->normalize($this->validation->shares_count, $benchmarks['shares']),
        ];

        // Calculate weighted score
        $totalScore = 0;
        foreach ($weights as $metric => $weight) {
            $totalScore += $scores[$metric] * $weight * 100;
        }

        return (int) min(100, max(0, round($totalScore)));
    }

    /**
     * Normalize a value against a benchmark.
     * Returns 0-1 where 1 means meeting or exceeding the benchmark.
     */
    private function normalize(int $value, float $benchmark): float
    {
        if ($benchmark <= 0) {
            return $value > 0 ? 1 : 0;
        }

        return min(1, $value / $benchmark);
    }

    /**
     * Check if this validation should be marked as the winner for its design.
     */
    private function checkForWinner(): void
    {
        $design = $this->validation->design;

        // Get all completed validations for this design
        $completedValidations = $design->validations()
            ->where('status', 'completed')
            ->whereNotNull('validation_score')
            ->get();

        if ($completedValidations->count() < 2) {
            // Only one validation, so it wins by default
            $this->validation->update(['is_winner' => true]);
            return;
        }

        // Find the one with highest score
        $winner = $completedValidations->sortByDesc('validation_score')->first();

        // Reset all winners for this design
        $design->validations()->update(['is_winner' => false]);

        // Mark the winner
        if ($winner) {
            $winner->update(['is_winner' => true]);
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
            'finalize-validation',
            'validation:' . $this->validation->id,
            'design:' . $this->validation->design_id,
        ];
    }
}
