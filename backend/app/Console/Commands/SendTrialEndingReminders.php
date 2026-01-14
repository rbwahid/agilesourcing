<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\TrialEndingNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendTrialEndingReminders extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'trial:send-reminders {--days=3 : Days before trial ends}';

    /**
     * The console command description.
     */
    protected $description = 'Send reminder emails to users whose trials are ending soon';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $daysBeforeEnd = (int) $this->option('days');
        $targetDate = Carbon::now()->addDays($daysBeforeEnd);

        // Find users with trials ending within the target window
        // (ending between now and daysBeforeEnd days from now)
        $users = User::query()
            ->whereNotNull('trial_ends_at')
            ->whereDate('trial_ends_at', '=', $targetDate->toDateString())
            ->whereDoesntHave('subscriptions', function ($query) {
                // Exclude users who have already subscribed
                $query->whereIn('stripe_status', ['active', 'trialing']);
            })
            ->get();

        if ($users->isEmpty()) {
            $this->info('No users with trials ending in '.$daysBeforeEnd.' days.');

            return self::SUCCESS;
        }

        $sent = 0;

        foreach ($users as $user) {
            try {
                $trialEndsAt = Carbon::parse($user->trial_ends_at);
                $daysRemaining = (int) Carbon::now()->diffInDays($trialEndsAt, false);

                // Only send if days remaining matches (to prevent duplicate sends)
                if ($daysRemaining > 0 && $daysRemaining <= $daysBeforeEnd) {
                    $user->notify(new TrialEndingNotification(
                        trialEndsAt: $trialEndsAt,
                        daysRemaining: $daysRemaining
                    ));

                    $sent++;

                    Log::info('Trial ending reminder sent', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'trial_ends_at' => $trialEndsAt->toDateString(),
                        'days_remaining' => $daysRemaining,
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Failed to send trial ending reminder', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("Sent {$sent} trial ending reminders.");

        return self::SUCCESS;
    }
}
