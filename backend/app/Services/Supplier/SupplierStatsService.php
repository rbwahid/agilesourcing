<?php

namespace App\Services\Supplier;

use App\Models\Conversation;
use App\Models\Profile;
use App\Models\Supplier;
use App\Models\SupplierProfileView;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupplierStatsService
{
    /**
     * Record a profile view for a supplier.
     */
    public function recordProfileView(User $supplier, ?User $viewer, Request $request): void
    {
        // Don't record if supplier is viewing their own profile
        if ($viewer && $viewer->id === $supplier->id) {
            return;
        }

        // Rate limit: don't record multiple views from same viewer within 1 hour
        $recentView = SupplierProfileView::where('supplier_id', $supplier->id)
            ->where(function ($query) use ($viewer, $request) {
                if ($viewer) {
                    $query->where('viewer_id', $viewer->id);
                } else {
                    $query->where('viewer_ip', $request->ip());
                }
            })
            ->where('created_at', '>=', now()->subHour())
            ->exists();

        if ($recentView) {
            return;
        }

        SupplierProfileView::create([
            'supplier_id' => $supplier->id,
            'viewer_id' => $viewer?->id,
            'viewer_ip' => $request->ip(),
            'viewer_user_agent' => $request->userAgent(),
        ]);
    }

    /**
     * Get comprehensive stats for a supplier.
     */
    public function getStats(User $supplier): array
    {
        $now = now();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $sixtyDaysAgo = $now->copy()->subDays(60);

        // Profile views
        $currentViews = SupplierProfileView::where('supplier_id', $supplier->id)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();

        $previousViews = SupplierProfileView::where('supplier_id', $supplier->id)
            ->whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])
            ->count();

        $viewsChange = $this->calculatePercentageChange($previousViews, $currentViews);

        // Inquiries received
        $currentInquiries = Conversation::where('supplier_id', $supplier->id)
            ->whereHas('inquiry')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();

        $previousInquiries = Conversation::where('supplier_id', $supplier->id)
            ->whereHas('inquiry')
            ->whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])
            ->count();

        $inquiriesChange = $this->calculatePercentageChange($previousInquiries, $currentInquiries);

        // Saved by designers - need to find supplier through profile
        $supplierModel = Supplier::whereHas('profile', function ($q) use ($supplier) {
            $q->where('user_id', $supplier->id);
        })->first();

        $savedBy = $supplierModel ? $supplierModel->savedByUsers()->count() : 0;

        // Previous period saved (approximation - we'd need timestamps on saved_suppliers)
        $savedChange = 0; // Can't calculate without historical data

        // Profile completion percentage
        $profileCompletion = $this->calculateProfileCompletion($supplier);

        // Response rate and time
        $responseStats = $this->calculateResponseStats($supplier);

        return [
            'profile_views' => $currentViews,
            'profile_views_change' => $viewsChange,
            'inquiries_received' => $currentInquiries,
            'inquiries_change' => $inquiriesChange,
            'saved_by_designers' => $savedBy,
            'saved_change' => $savedChange,
            'profile_completion' => $profileCompletion,
            'response_rate' => $responseStats['rate'],
            'avg_response_time' => $responseStats['avg_time'],
        ];
    }

    /**
     * Get views timeline data for charts.
     */
    public function getViewsTimeline(User $supplier, int $days = 30): array
    {
        $startDate = now()->subDays($days)->startOfDay();

        $views = SupplierProfileView::where('supplier_id', $supplier->id)
            ->where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as views'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $timeline = [];
        for ($i = $days; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $timeline[] = [
                'date' => $date,
                'views' => $views->get($date)?->views ?? 0,
            ];
        }

        return $timeline;
    }

    /**
     * Get top viewers of a supplier's profile.
     */
    public function getTopViewers(User $supplier, int $limit = 10): array
    {
        return SupplierProfileView::where('supplier_id', $supplier->id)
            ->whereNotNull('viewer_id')
            ->select('viewer_id', DB::raw('COUNT(*) as view_count'))
            ->groupBy('viewer_id')
            ->orderByDesc('view_count')
            ->limit($limit)
            ->with('viewer:id,name')
            ->get()
            ->map(function ($view) {
                return [
                    'id' => $view->viewer_id,
                    'name' => $view->viewer?->name ?? 'Unknown',
                    'views' => $view->view_count,
                ];
            })
            ->toArray();
    }

    /**
     * Get recent activity for a supplier.
     */
    public function getRecentActivity(User $supplier, int $limit = 10): array
    {
        $activities = [];

        // Recent profile views
        $recentViews = SupplierProfileView::where('supplier_id', $supplier->id)
            ->whereNotNull('viewer_id')
            ->with('viewer:id,name')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function ($view) {
                return [
                    'id' => $view->id,
                    'type' => 'profile_view',
                    'viewer' => $view->viewer ? [
                        'id' => $view->viewer->id,
                        'name' => $view->viewer->name,
                    ] : null,
                    'created_at' => $view->created_at->toISOString(),
                ];
            });

        $activities = array_merge($activities, $recentViews->toArray());

        // Recent inquiries
        $recentInquiries = Conversation::where('supplier_id', $supplier->id)
            ->whereHas('inquiry')
            ->with('designer:id,name')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function ($conversation) {
                return [
                    'id' => $conversation->id,
                    'type' => 'inquiry_received',
                    'viewer' => $conversation->designer ? [
                        'id' => $conversation->designer->id,
                        'name' => $conversation->designer->name,
                    ] : null,
                    'created_at' => $conversation->created_at->toISOString(),
                ];
            });

        $activities = array_merge($activities, $recentInquiries->toArray());

        // Sort by created_at and limit
        usort($activities, function ($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return array_slice($activities, 0, $limit);
    }

    /**
     * Calculate percentage change between two values.
     */
    private function calculatePercentageChange(int $previous, int $current): int
    {
        if ($previous === 0) {
            return $current > 0 ? 100 : 0;
        }

        return (int) round((($current - $previous) / $previous) * 100);
    }

    /**
     * Calculate profile completion percentage.
     */
    private function calculateProfileCompletion(User $supplier): int
    {
        $profile = $supplier->profile;
        $supplierModel = Supplier::whereHas('profile', function ($q) use ($supplier) {
            $q->where('user_id', $supplier->id);
        })->first();

        if (! $profile || ! $supplierModel) {
            return 0;
        }

        $fields = [
            'business_name' => ! empty($profile->business_name),
            'logo' => ! empty($profile->profile_picture_url),
            'bio' => ! empty($profile->bio),
            'location' => ! empty($profile->location),
            'service_type' => ! empty($supplierModel->service_type),
            'moq' => ! empty($supplierModel->minimum_order_quantity),
            'lead_time' => ! empty($supplierModel->lead_time_days),
            'certifications' => $supplierModel->certificationRecords()->count() > 0,
        ];

        $completed = count(array_filter($fields));
        $total = count($fields);

        return (int) round(($completed / $total) * 100);
    }

    /**
     * Calculate response rate and average response time.
     */
    private function calculateResponseStats(User $supplier): array
    {
        $conversations = Conversation::where('supplier_id', $supplier->id)
            ->where('created_at', '>=', now()->subDays(30))
            ->with(['messages' => function ($q) {
                $q->orderBy('created_at', 'asc');
            }])
            ->get();

        if ($conversations->isEmpty()) {
            return ['rate' => 100, 'avg_time' => 0];
        }

        $responded = 0;
        $totalResponseTime = 0;
        $responseCount = 0;

        foreach ($conversations as $conversation) {
            $messages = $conversation->messages;
            $firstMessage = $messages->first();

            if (! $firstMessage || $firstMessage->sender_id === $supplier->id) {
                continue;
            }

            // Find first supplier response
            $supplierResponse = $messages->first(function ($message) use ($supplier) {
                return $message->sender_id === $supplier->id;
            });

            if ($supplierResponse) {
                $responded++;
                $responseTime = $firstMessage->created_at->diffInHours($supplierResponse->created_at);
                $totalResponseTime += $responseTime;
                $responseCount++;
            }
        }

        $totalConversations = $conversations->count();
        $rate = $totalConversations > 0 ? (int) round(($responded / $totalConversations) * 100) : 100;
        $avgTime = $responseCount > 0 ? round($totalResponseTime / $responseCount, 1) : 0;

        return ['rate' => $rate, 'avg_time' => $avgTime];
    }
}
