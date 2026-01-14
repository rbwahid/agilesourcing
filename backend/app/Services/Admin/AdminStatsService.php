<?php

namespace App\Services\Admin;

use App\Models\Design;
use App\Models\SupplierCertification;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminStatsService
{
    /**
     * Get comprehensive dashboard statistics.
     */
    public function getDashboardStats(): array
    {
        return [
            'users' => $this->getUserStats(),
            'subscriptions' => $this->getSubscriptionStats(),
            'verifications' => $this->getVerificationStats(),
            'designs' => $this->getDesignStats(),
        ];
    }

    /**
     * Get user statistics.
     */
    private function getUserStats(): array
    {
        return [
            'total' => User::count(),
            'designers' => User::where('role', 'designer')->count(),
            'suppliers' => User::where('role', 'supplier')->count(),
            'admins' => User::whereIn('role', ['admin', 'super_admin'])->count(),
            'active' => User::where('is_active', true)->count(),
            'new_today' => User::whereDate('created_at', today())->count(),
            'new_this_week' => User::where('created_at', '>=', now()->subWeek())->count(),
            'new_this_month' => User::where('created_at', '>=', now()->subMonth())->count(),
        ];
    }

    /**
     * Get subscription statistics.
     */
    private function getSubscriptionStats(): array
    {
        $activeCount = User::whereHas('subscriptions', function ($query) {
            $query->where('stripe_status', 'active');
        })->count();

        $trialingCount = User::whereHas('subscriptions', function ($query) {
            $query->where('stripe_status', 'trialing');
        })->count();

        $cancelledCount = User::whereHas('subscriptions', function ($query) {
            $query->where('stripe_status', 'canceled');
        })->count();

        return [
            'active' => $activeCount,
            'trialing' => $trialingCount,
            'cancelled' => $cancelledCount,
            'mrr' => $this->calculateMRR(),
        ];
    }

    /**
     * Get verification statistics.
     */
    private function getVerificationStats(): array
    {
        return [
            'pending' => SupplierCertification::whereNull('verified_at')->count(),
            'approved_total' => SupplierCertification::whereNotNull('verified_at')->count(),
            'approved_this_week' => SupplierCertification::whereNotNull('verified_at')
                ->where('verified_at', '>=', now()->subWeek())
                ->count(),
        ];
    }

    /**
     * Get design statistics.
     */
    private function getDesignStats(): array
    {
        return [
            'total' => Design::count(),
            'this_week' => Design::where('created_at', '>=', now()->subWeek())->count(),
            'this_month' => Design::where('created_at', '>=', now()->subMonth())->count(),
        ];
    }

    /**
     * Calculate Monthly Recurring Revenue.
     */
    private function calculateMRR(): int
    {
        // For MVP, we calculate MRR from active subscriptions
        // This is a simplified calculation - production would integrate with Stripe
        $activeSubscriptions = DB::table('subscriptions')
            ->where('stripe_status', 'active')
            ->count();

        // Assuming average subscription price of $29/month for MVP estimation
        // In production, fetch actual prices from Stripe or plans table
        return $activeSubscriptions * 2900; // Return in cents
    }

    /**
     * Get signup trends for the specified number of days.
     */
    public function getSignupTrends(int $days = 30): array
    {
        $trends = [];
        $startDate = now()->subDays($days - 1)->startOfDay();

        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            $trends[] = [
                'date' => $date->toDateString(),
                'count' => User::whereDate('created_at', $date)->count(),
            ];
        }

        return $trends;
    }

    /**
     * Get recent platform activity.
     */
    public function getRecentActivity(int $limit = 10): array
    {
        $activities = [];

        // Recent user registrations
        $recentUsers = User::latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        foreach ($recentUsers as $user) {
            $activities[] = [
                'type' => 'user_registered',
                'description' => "{$user->name} registered as {$user->role}",
                'user_id' => $user->id,
                'created_at' => $user->created_at,
            ];
        }

        // Recent verification submissions
        $recentVerifications = SupplierCertification::with('user:id,name')
            ->whereNull('verified_at')
            ->latest()
            ->take(5)
            ->get();

        foreach ($recentVerifications as $verification) {
            $activities[] = [
                'type' => 'verification_submitted',
                'description' => "{$verification->user->name} submitted {$verification->certification_type} certification",
                'user_id' => $verification->user_id,
                'created_at' => $verification->created_at,
            ];
        }

        // Sort by created_at and limit
        usort($activities, fn ($a, $b) => $b['created_at'] <=> $a['created_at']);

        return array_slice($activities, 0, $limit);
    }
}
