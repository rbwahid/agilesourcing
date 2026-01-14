<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\Admin\AdminUserDetailResource;
use App\Http\Resources\Admin\AdminUserResource;
use App\Models\User;
use App\Services\Admin\AdminStatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

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
}
