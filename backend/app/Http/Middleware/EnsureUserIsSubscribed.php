<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSubscribed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Check if user has an active subscription
        if ($user->subscribed('default')) {
            return $next($request);
        }

        // Check if user is on trial
        if ($user->onTrial()) {
            return $next($request);
        }

        // No active subscription or trial
        return response()->json([
            'message' => 'A subscription is required to access this feature.',
            'error' => 'subscription_required',
            'upgrade_url' => '/pricing',
        ], 402);
    }
}
