<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RefundRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\Admin\AdminSubscriptionDetailResource;
use App\Http\Resources\Admin\AdminSubscriptionResource;
use App\Http\Resources\Admin\AdminUserDetailResource;
use App\Http\Resources\Admin\AdminUserResource;
use App\Models\CommunicationLog;
use App\Models\Plan;
use App\Models\User;
use App\Services\Admin\AdminStatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Cashier\Subscription;
use Spatie\Activitylog\Models\Activity;
use Stripe\Stripe;

class AdminController extends Controller
{
    public function __construct(
        private AdminStatsService $statsService
    ) {}

    /**
     * Get dashboard statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = $this->statsService->getDashboardStats();

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Get signup trends.
     */
    public function signupTrends(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $trends = $this->statsService->getSignupTrends((int) $days);

        return response()->json([
            'data' => $trends,
        ]);
    }

    /**
     * Get recent activity.
     */
    public function recentActivity(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);
        $activity = $this->statsService->getRecentActivity((int) $limit);

        return response()->json([
            'data' => $activity,
        ]);
    }

    /**
     * List all users with filters and pagination.
     */
    public function users(Request $request): JsonResponse
    {
        $query = User::query();

        // Search by name or email
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Sort
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $allowedSorts = ['created_at', 'name', 'email', 'last_login_at'];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $users = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'data' => AdminUserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Get single user details.
     */
    public function showUser(User $user): JsonResponse
    {
        $user->load(['profile', 'subscriptions']);

        return response()->json([
            'data' => new AdminUserDetailResource($user),
        ]);
    }

    /**
     * Update user details.
     */
    public function updateUser(UpdateUserRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        // Prevent changing super_admin role unless requester is super_admin
        if (isset($validated['role']) && $validated['role'] === 'super_admin') {
            if ($request->user()->role !== 'super_admin') {
                return response()->json([
                    'message' => 'Only super admins can assign super admin role.',
                ], 403);
            }
        }

        // Prevent demoting the last super_admin
        if ($user->role === 'super_admin' && isset($validated['role']) && $validated['role'] !== 'super_admin') {
            $superAdminCount = User::where('role', 'super_admin')->count();
            if ($superAdminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot demote the last super admin.',
                ], 422);
            }
        }

        $user->update($validated);

        activity()
            ->causedBy($request->user())
            ->performedOn($user)
            ->withProperties(['changes' => $validated])
            ->log('Updated user');

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => new AdminUserResource($user->fresh()),
        ]);
    }

    /**
     * Suspend a user account.
     */
    public function suspendUser(Request $request, User $user): JsonResponse
    {
        // Prevent suspending super_admin
        if ($user->role === 'super_admin') {
            return response()->json([
                'message' => 'Cannot suspend a super admin account.',
            ], 422);
        }

        // Prevent self-suspension
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Cannot suspend your own account.',
            ], 422);
        }

        $user->update(['is_active' => false]);

        activity()
            ->causedBy($request->user())
            ->performedOn($user)
            ->log('Suspended user account');

        return response()->json([
            'message' => 'User account suspended successfully.',
            'data' => new AdminUserResource($user->fresh()),
        ]);
    }

    /**
     * Reactivate a suspended user account.
     */
    public function reactivateUser(Request $request, User $user): JsonResponse
    {
        $user->update(['is_active' => true]);

        activity()
            ->causedBy($request->user())
            ->performedOn($user)
            ->log('Reactivated user account');

        return response()->json([
            'message' => 'User account reactivated successfully.',
            'data' => new AdminUserResource($user->fresh()),
        ]);
    }

    /**
     * Get audit logs.
     */
    public function auditLogs(Request $request): JsonResponse
    {
        $query = Activity::with('causer:id,name,email')
            ->latest();

        // Filter by causer (admin)
        if ($causerId = $request->input('causer_id')) {
            $query->where('causer_id', $causerId);
        }

        // Filter by log name
        if ($logName = $request->input('log_name')) {
            $query->where('log_name', $logName);
        }

        // Filter by date range
        if ($from = $request->input('from')) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to = $request->input('to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $logs = $query->paginate($request->input('per_page', 20));

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    /**
     * List all subscriptions with filters and pagination.
     */
    public function subscriptions(Request $request): JsonResponse
    {
        $query = Subscription::with('user')
            ->where('type', 'default');

        // Search by user name or email
        if ($search = $request->input('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($status = $request->input('status')) {
            $query->where('stripe_status', $status);
        }

        // Filter by plan
        if ($planSlug = $request->input('plan')) {
            $plan = Plan::where('slug', $planSlug)->first();
            if ($plan) {
                $query->where(function ($q) use ($plan) {
                    $q->where('stripe_price', $plan->stripe_price_monthly_id)
                        ->orWhere('stripe_price', $plan->stripe_price_annual_id);
                });
            }
        }

        // Filter by billing period
        if ($billingPeriod = $request->input('billing_period')) {
            $monthlyPrices = Plan::whereNotNull('stripe_price_monthly_id')
                ->pluck('stripe_price_monthly_id');
            $annualPrices = Plan::whereNotNull('stripe_price_annual_id')
                ->pluck('stripe_price_annual_id');

            if ($billingPeriod === 'monthly') {
                $query->whereIn('stripe_price', $monthlyPrices);
            } elseif ($billingPeriod === 'annual') {
                $query->whereIn('stripe_price', $annualPrices);
            }
        }

        // Sort
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $allowedSorts = ['created_at', 'stripe_status'];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $subscriptions = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'data' => AdminSubscriptionResource::collection($subscriptions),
            'meta' => [
                'current_page' => $subscriptions->currentPage(),
                'last_page' => $subscriptions->lastPage(),
                'per_page' => $subscriptions->perPage(),
                'total' => $subscriptions->total(),
            ],
        ]);
    }

    /**
     * Get single subscription details.
     */
    public function showSubscription(Subscription $subscription): JsonResponse
    {
        $subscription->load('user');

        return response()->json([
            'data' => new AdminSubscriptionDetailResource($subscription),
        ]);
    }

    /**
     * Retry a failed payment for a subscription.
     */
    public function retryPayment(Request $request, Subscription $subscription): JsonResponse
    {
        // Only allow retry for past_due subscriptions
        if ($subscription->stripe_status !== 'past_due') {
            return response()->json([
                'message' => 'Payment retry is only available for past due subscriptions.',
            ], 422);
        }

        try {
            Stripe::setApiKey(config('cashier.secret'));

            // Get the latest invoice for this subscription
            $stripeSubscription = \Stripe\Subscription::retrieve($subscription->stripe_id);
            $latestInvoiceId = $stripeSubscription->latest_invoice;

            if ($latestInvoiceId) {
                $invoice = \Stripe\Invoice::retrieve($latestInvoiceId);

                // Only retry if the invoice is open or uncollectible
                if (in_array($invoice->status, ['open', 'uncollectible'])) {
                    $invoice->pay();
                }
            }

            activity()
                ->causedBy($request->user())
                ->performedOn($subscription->user)
                ->withProperties(['subscription_id' => $subscription->id])
                ->log('Retried subscription payment');

            return response()->json([
                'message' => 'Payment retry initiated successfully.',
            ]);
        } catch (\Stripe\Exception\CardException $e) {
            return response()->json([
                'message' => 'Payment failed: '.$e->getMessage(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retry payment: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a refund for an invoice.
     */
    public function createRefund(RefundRequest $request, string $invoiceId): JsonResponse
    {
        try {
            Stripe::setApiKey(config('cashier.secret'));

            // Retrieve the invoice
            $invoice = \Stripe\Invoice::retrieve($invoiceId);

            if ($invoice->status !== 'paid') {
                return response()->json([
                    'message' => 'Can only refund paid invoices.',
                ], 422);
            }

            // Get the charge ID from the invoice
            $chargeId = $invoice->charge;

            if (! $chargeId) {
                return response()->json([
                    'message' => 'No charge found for this invoice.',
                ], 422);
            }

            // Create the refund
            $refundParams = [
                'charge' => $chargeId,
                'reason' => 'requested_by_customer',
                'metadata' => [
                    'admin_id' => $request->user()->id,
                    'admin_reason' => $request->input('reason'),
                ],
            ];

            // If amount is specified, create partial refund
            if ($amount = $request->input('amount')) {
                $refundParams['amount'] = $amount;
            }

            $refund = \Stripe\Refund::create($refundParams);

            // Find the user associated with this invoice
            $user = User::where('stripe_id', $invoice->customer)->first();

            if ($user) {
                activity()
                    ->causedBy($request->user())
                    ->performedOn($user)
                    ->withProperties([
                        'invoice_id' => $invoiceId,
                        'refund_id' => $refund->id,
                        'amount' => $refund->amount,
                        'reason' => $request->input('reason'),
                    ])
                    ->log('Created refund');
            }

            return response()->json([
                'message' => 'Refund processed successfully.',
                'data' => [
                    'refund_id' => $refund->id,
                    'amount' => $refund->amount,
                    'status' => $refund->status,
                ],
            ]);
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            return response()->json([
                'message' => 'Invalid request: '.$e->getMessage(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process refund: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get communication logs for a specific user.
     */
    public function userCommunications(Request $request, User $user): JsonResponse
    {
        $query = CommunicationLog::where('user_id', $user->id)
            ->with('triggeredBy:id,name')
            ->latest();

        // Filter by type
        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        // Filter by status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $logs = $query->paginate($request->input('per_page', 20));

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ]);
    }
}
