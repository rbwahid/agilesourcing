<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\InstagramConnection;
use App\Services\Instagram\InstagramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class InstagramAuthController extends Controller
{
    public function __construct(
        private InstagramService $instagramService
    ) {}

    /**
     * Get the OAuth authorization URL.
     */
    public function redirect(Request $request): JsonResponse
    {
        // Generate a unique state token to prevent CSRF
        $state = Str::random(40);

        // Store state in session (will be validated on callback)
        $request->session()->put('instagram_oauth_state', $state);

        $authUrl = $this->instagramService->getAuthUrl($state);

        return response()->json([
            'url' => $authUrl,
        ]);
    }

    /**
     * Handle the OAuth callback from Instagram/Facebook.
     */
    public function callback(Request $request): JsonResponse
    {
        // Validate state token
        $savedState = $request->session()->pull('instagram_oauth_state');

        if (! $savedState || $savedState !== $request->state) {
            return response()->json([
                'message' => 'Invalid OAuth state. Please try again.',
            ], 400);
        }

        // Check for errors
        if ($request->error) {
            Log::warning('Instagram OAuth error', [
                'error' => $request->error,
                'error_description' => $request->error_description,
            ]);

            return response()->json([
                'message' => $request->error_description ?? 'Authorization was denied.',
            ], 400);
        }

        // Exchange code for token
        if (! $request->code) {
            return response()->json([
                'message' => 'No authorization code received.',
            ], 400);
        }

        try {
            // Exchange code for long-lived token
            $tokenData = $this->instagramService->exchangeCodeForToken($request->code);

            // Get Instagram profile
            $profile = $this->instagramService->getProfile($tokenData['access_token']);

            $user = $request->user();

            // Check if this Instagram account is already connected to another user
            $existingConnection = InstagramConnection::where('instagram_user_id', $profile['instagram_user_id'])
                ->where('user_id', '!=', $user->id)
                ->first();

            if ($existingConnection) {
                return response()->json([
                    'message' => 'This Instagram account is already connected to another user.',
                ], 409);
            }

            // Create or update the connection
            $connection = InstagramConnection::updateOrCreate(
                [
                    'user_id' => $user->id,
                ],
                [
                    'instagram_user_id' => $profile['instagram_user_id'],
                    'instagram_username' => $profile['instagram_username'],
                    'access_token' => $tokenData['access_token'],
                    'token_expires_at' => now()->addSeconds($tokenData['expires_in']),
                    'profile_picture_url' => $profile['profile_picture_url'],
                    'followers_count' => $profile['followers_count'],
                ]
            );

            Log::info('Instagram connected successfully', [
                'user_id' => $user->id,
                'instagram_username' => $profile['instagram_username'],
            ]);

            // Redirect to frontend settings page with success
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

            return response()->json([
                'message' => 'Instagram connected successfully.',
                'redirect_url' => $frontendUrl.'/settings?instagram=connected',
                'data' => [
                    'id' => $connection->id,
                    'instagram_username' => $connection->instagram_username,
                    'profile_picture_url' => $connection->profile_picture_url,
                    'followers_count' => $connection->followers_count,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Instagram OAuth callback failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to connect Instagram: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get the current Instagram connection status.
     */
    public function status(Request $request): JsonResponse
    {
        $connection = $request->user()->instagramConnection;

        if (! $connection) {
            return response()->json([
                'connected' => false,
                'data' => null,
            ]);
        }

        return response()->json([
            'connected' => true,
            'data' => [
                'id' => $connection->id,
                'instagram_user_id' => $connection->instagram_user_id,
                'instagram_username' => $connection->instagram_username,
                'profile_picture_url' => $connection->profile_picture_url,
                'followers_count' => $connection->followers_count,
                'token_expires_at' => $connection->token_expires_at,
                'is_token_expired' => $connection->isTokenExpired(),
                'is_token_expiring_soon' => $connection->isTokenExpiringSoon(),
                'created_at' => $connection->created_at,
            ],
        ]);
    }

    /**
     * Disconnect the Instagram account.
     */
    public function disconnect(Request $request): JsonResponse
    {
        $connection = $request->user()->instagramConnection;

        if (! $connection) {
            return response()->json([
                'message' => 'No Instagram account connected.',
            ], 404);
        }

        $username = $connection->instagram_username;
        $connection->delete();

        Log::info('Instagram disconnected', [
            'user_id' => $request->user()->id,
            'instagram_username' => $username,
        ]);

        return response()->json([
            'message' => 'Instagram account disconnected successfully.',
        ]);
    }

    /**
     * Refresh the Instagram access token.
     */
    public function refresh(Request $request): JsonResponse
    {
        $connection = $request->user()->instagramConnection;

        if (! $connection) {
            return response()->json([
                'message' => 'No Instagram account connected.',
            ], 404);
        }

        $success = $this->instagramService->refreshToken($connection);

        if (! $success) {
            return response()->json([
                'message' => 'Failed to refresh token. Please reconnect your Instagram account.',
            ], 500);
        }

        return response()->json([
            'message' => 'Token refreshed successfully.',
            'data' => [
                'token_expires_at' => $connection->fresh()->token_expires_at,
            ],
        ]);
    }
}
